const C_companyBalance = require("../models/C_companyBalance");
const C_Receipt = require("../models/C_Receipt");
const companyBalance = require("../models/companyBalance");
const companyCashBalance = require("../models/companyCashBalance");
const Account = require("../models/Account");
const Receipt = require("../models/Receipt");
const User = require("../models/user");
const { Sequelize, Op } = require("sequelize");
const companyBankDetails = require("../models/companyBankDetails");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const C_WalletLedger = require("../models/C_WalletLedger");
const { TRANSACTION_TYPE, ROLE } = require("../constant/constant");
const C_UserBalance = require("../models/C_userBalance");
const C_Cashbook = require("../models/C_Cashbook");
const C_DailyBalance = require("../models/C_DailyBalance");
const BankBalance = require("../models/BankBalance");
const BankLedger = require("../models/BankLedger");
/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */
const syncDailyBalances = async (startDate, companyId, transaction = null) => {
  // 1. Fetch all balance snapshots from the modified date forward, ordered by DATE
  const balances = await C_DailyBalance.findAll({
    where: {
      companyId,
      date: { [Op.gte]: startDate }
    },
    order: [['date', 'ASC']], // Crucial: Order by transaction date, not ID
    transaction
  });

  for (let i = 0; i < balances.length; i++) {
    const current = balances[i];

    // 2. Determine the Opening Balance
    if (i === 0) {
      // For the first record in our affected set, look back one day in the DB
      const lastDay = await C_DailyBalance.findOne({
        where: {
          companyId,
          date: { [Op.lt]: current.date }
        },
        order: [['date', 'DESC']], // Get the day immediately before
        transaction
      });
      current.openingBalance = lastDay ? lastDay.closingBalance : 0;
    } else {
      // Pull opening balance from the day we just processed in the loop
      current.openingBalance = balances[i - 1].closingBalance;
    }

    // 3. Recalculate Closing: Opening + Credit - Debit
    current.closingBalance = Number(current.openingBalance) +
      Number(current.totalCredit) -
      Number(current.totalDebit);

    await current.save({ transaction });
  }
};

exports.C_create_receiveCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const companyId = req.user.companyId;
    const role = req.user.role;
    const { accountId, receiptNo, amount, description, date } = req.body;

    const receiptNoExist = await C_Receipt.findOne({
      where: {
        receiptNo: receiptNo,
        companyId: companyId,
      },
    });
    if (receiptNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Receipt Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }

    if (description.length > 20) {
      return res.status(400).json({
        status: "false",
        message: "Description Cannot Have More Then 20 Characters",
      });
    }

    const [dailyRow, created] = await C_DailyBalance.findOrCreate({
      where: { date, companyId },
      defaults: {
        openingBalance: 0,
        totalCredit: 0,
        totalDebit: 0,
        closingBalance: 0
      }
    });

    if (created) {
      // Fetch the most recent closing balance before this date to set openingBalance
      const lastDay = await C_DailyBalance.findOne({
        where: { companyId, date: { [Op.lt]: date } },
        order: [['date', 'DESC']]
      });

      const prevClosing = lastDay ? Number(lastDay.closingBalance) : 0;
      await dailyRow.update({
        openingBalance: prevClosing,
        closingBalance: prevClosing
      });
    }

    // Increment snapshots for the Receipt (Credit)
    await dailyRow.increment('totalCredit', { by: amount });
    await dailyRow.increment('closingBalance', { by: amount });

    let existingBalance;
    if (role === ROLE.SUPER_ADMIN) {
      existingBalance = await C_companyBalance.findOne({
        where: { companyId: companyId },
      });
    } else {
      existingBalance = await C_UserBalance.findOne({
        where: { companyId: companyId, userId: user },
      });
    }
    const data = await C_Receipt.create({
      accountId,
      amount,
      description,
      date,
      receiptNo,
      createdBy: user,
      updatedBy: user,
      companyId: companyId,
    });

    await C_Ledger.create({
      accountId: accountId,
      companyId: companyId,
      receiptId: data.id,
      date: date,
    });

    if (role === ROLE.SUPER_ADMIN) {
      await C_WalletLedger.create({
        receiptId: data.id,
        userId: user,
        companyId: companyId,
        date: date,
        isApprove: true,
        approveDate: new Date(),
      });

      await C_Cashbook.create({
        C_receiptId: data.id,
        companyId: companyId,
        date: date,
      });
    } else {
      await C_WalletLedger.create({
        receiptId: data.id,
        userId: user,
        companyId: companyId,
        date: date,
      });
    }

    if (existingBalance) {
      await existingBalance.increment("balance", { by: amount });
      if (existingBalance?.incomes >= 0) {
        await existingBalance.increment("incomes", { by: amount });
      }
    }

    await syncDailyBalances(date, companyId);

    return res.status(200).json({
      status: "true",
      message: "Receipt Cash Create Successfully.",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_get_all_receiveCash = async (req, res) => {
  try {
    const { companyId } = req.user;
    const data = await C_Receipt.findAll({
      where: { companyId: companyId, isActive: true },
      include: [
        { model: Account, as: "accountReceiptCash" },
        { model: User, as: "receiveCreate", attributes: ["username"] },
        { model: User, as: "receiveUpdate", attributes: ["username"] },
      ],
    });
    return res.status(200).json({
      status: "true",
      message: "Receipt Cash Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_view_receiveCash = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const data = await C_Receipt.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: Account, as: "accountReceiptCash" }],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Receipt Cash Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Receipt Cash not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_update_receiveCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const companyId = req.user.companyId;
    const role = req.user.role;
    const { id } = req.params;
    const { accountId, receiptNo, amount, description, date } = req.body;

    const receiptNoExist = await C_Receipt.findOne({
      where: {
        receiptNo: receiptNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (receiptNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Receipt Number Already Exists" });
    }
    const receiveId = await C_Receipt.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!receiveId) {
      return res
        .status(404)
        .json({ status: "false", message: "Receive Cash Not Found" });
    }

    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    const oldAmount = Number(receiveId.amount || 0);
    const oldDate = receiveId.date;
    const newAmount = Number(amount || 0);

    // 1. Remove old amount from the OLD DATE snapshot
    const oldDailyRow = await C_DailyBalance.findOne({ where: { date: oldDate, companyId } });
    if (oldDailyRow) {
      await oldDailyRow.decrement('totalCredit', { by: oldAmount });
      await oldDailyRow.decrement('closingBalance', { by: oldAmount });
    }

    // 2. Add new amount to the NEW DATE snapshot (Handles date changes)
    const [newDailyRow, created] = await C_DailyBalance.findOrCreate({
      where: { date: date, companyId },
      defaults: { openingBalance: 0, totalCredit: 0, totalDebit: 0, closingBalance: 0 }
    });

    if (created) {
      const lastDay = await C_DailyBalance.findOne({
        where: { companyId, date: { [Op.lt]: date } },
        order: [['date', 'DESC']]
      });
      const prevClosing = lastDay ? Number(lastDay.closingBalance) : 0;
      await newDailyRow.update({ openingBalance: prevClosing, closingBalance: prevClosing });
    }

    await newDailyRow.increment('totalCredit', { by: newAmount });
    await newDailyRow.increment('closingBalance', { by: newAmount });

    let existingBalance;
    if (role === ROLE.SUPER_ADMIN) {
      existingBalance = await C_companyBalance.findOne({
        where: { companyId: companyId },
      });
    } else {
      existingBalance = await C_UserBalance.findOne({
        where: { companyId: companyId, userId: user },
      });
    }

    await C_Receipt.update(
      {
        accountId,
        amount,
        description,
        date,
        receiptNo,
        createdBy: receiveId.createdBy,
        updatedBy: user,
        companyId: companyId,
      },
      { where: { id: id } }
    );

    await C_Ledger.update(
      {
        accountId: accountId,
        receiptId: id,
        date: date,
      },
      {
        where: {
          receiptId: id,
          companyId: companyId,
        },
      }
    );

    if (role === ROLE.SUPER_ADMIN) {
      await C_WalletLedger.update(
        {
          date: date,
          approveDate: new Date(),
        },
        {
          where: {
            receiptId: id,
            userId: user,
            companyId: companyId,
          },
        }
      );

      await C_Cashbook.update(
        {
          date: date,
        },
        {
          where: {
            C_receiptId: id,
            companyId: companyId,
          },
        }
      );
    } else {
      const walletLedgerExist = await C_WalletLedger.findOne({
        where: {
          receiptId: id,
          userId: user,
          companyId: companyId,
        },
      });
      const cashbookEntry = await C_Cashbook.findOne({
        where: {
          C_receiptId: id,
          companyId: companyId,
        },
      });
      const entryApprove = walletLedgerExist.isApprove;
      if (entryApprove) {
        walletLedgerExist.approveDate = new Date();
        cashbookEntry.date = date;
        await cashbookEntry.save();
      }
      walletLedgerExist.date = date;
      await walletLedgerExist.save();
    }
    if (existingBalance) {
      await existingBalance.decrement("balance", { by: oldAmount });
      await existingBalance.increment("balance", { by: amount });
      if (existingBalance?.incomes >= 0) {
        await existingBalance.decrement("incomes", { by: oldAmount });
        await existingBalance.increment("incomes", { by: amount });
      }
    }

    await syncDailyBalances(date, companyId);

    const data = await C_Receipt.findOne({
      where: { id: id, companyId: companyId },
    });

    return res.status(200).json({
      status: "true",
      message: "Receipt Cash Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_delete_receiveCash = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, role, userId } = req.user;
    const receiptData = await C_Receipt.findOne({
      where: { id: id, companyId: companyId },
    });
    let existingBalance;
    if (role === ROLE.SUPER_ADMIN) {
      existingBalance = await C_companyBalance.findOne({
        where: { companyId: companyId },
      });
    } else {
      existingBalance = await C_UserBalance.findOne({
        where: { companyId: companyId, userId: userId },
      });
    }
    const oldAmount = receiptData?.amount ?? 0;
    const oldDate = receiptData.date;
    const balance = existingBalance?.balance ?? 0;

    if (balance < oldAmount) {
      return res.status(400).json({
        status: "false",
        message: "Not enough fund.",
      });
    }

    const dailyRow = await C_DailyBalance.findOne({
      where: { date: oldDate, companyId }
    });

    if (dailyRow) {
      // Subtract the deleted amount from the daily credit totals and closing balance
      await dailyRow.decrement('totalCredit', { by: oldAmount });
      await dailyRow.decrement('closingBalance', { by: oldAmount });
    }

    const data = await C_Receipt.destroy({
      where: { id: id, companyId: companyId },
    });
    if (existingBalance) {
      await existingBalance.decrement("balance", { by: oldAmount });
      if (existingBalance?.incomes >= 0) {
        await existingBalance.decrement("incomes", { by: oldAmount });
      }
    }

    await syncDailyBalances(oldDate, companyId);

    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Receipt Cash Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Receipt Cash Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_soft_delete_receiveCash = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId } = req.user;
    const receiptData = await C_Receipt.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!receiptData) {
      return res
        .status(404)
        .json({ status: "false", message: "Receipt Cash Not Found" });
    }

    // Soft delete - mark as inactive (NO balance change)
    const data = await C_Receipt.update(
      { isActive: false, updatedBy: userId },
      { where: { id: id, companyId: companyId } }
    );

    if (data[0] > 0) {
      return res
        .status(200)
        .json({ status: "true", message: "Receipt Cash Soft Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Receipt Cash Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

/*=============================================================================================================
                                         Without  Type C API
 ============================================================================================================ */
exports.create_receive_bank = async (req, res) => {
  try {
    const user = req.user.userId;
    const role = req.user.role;
    const companyId = req.user.companyId;
    const {
      voucherno,
      bankAccountId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
      paymentType,
      transactionType,
    } = req.body;

    const voucherNoExist = await Receipt.findOne({
      where: {
        voucherno: voucherno,
        companyId: companyId,
      },
    });
    if (voucherNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Voucher Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: {
        id: accountId,
        companyId: companyId,
        isActive: true,
      },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (transactionType === TRANSACTION_TYPE.BANK) {
      const accountData = await companyBankDetails.findOne({
        where: {
          id: bankAccountId,
          companyId: companyId,
        },
      });
      if (!accountData) {
        return res
          .status(404)
          .json({ status: "false", message: "Bank Account Not Found" });
      }
    }

    const data = await Receipt.create({
      voucherno,
      bankAccountId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
      transactionType,
      paymentType,
      createdBy: user,
      updatedBy: user,
      companyId: companyId,
    });

    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      receiptId: data.id,
      date: paymentdate,
    });

    if (transactionType === TRANSACTION_TYPE.CASH) {
      let existsingCashBalance;
      if (role === ROLE.SUPER_ADMIN) {
        existsingCashBalance = await companyCashBalance.findOne({
          where: { companyId: companyId },
        });
      } else {
        existsingCashBalance = await C_UserBalance.findOne({
          where: { companyId: companyId, userId: user },
        });
      }
      // const existsingCashBalance = await companyCashBalance.findOne({
      //   where: { companyId: companyId },
      // });
      if (existsingCashBalance) {
        await existsingCashBalance.increment("balance", { by: amount });
        if (existsingCashBalance?.incomes >= 0) {
          await existsingCashBalance.increment("incomes", { by: amount });
        }
      }
      await BankLedger.create({
        bankId: 1,
        receiptId: data.id,
        companyId: companyId,
        date: paymentdate,
      });
    } else if (transactionType === TRANSACTION_TYPE.BANK) {
      const existsingBalance = await companyBalance.findOne({
        where: { companyId: companyId },
      });
      const bankBalance = await BankBalance.findOne({
        where: {
          companyId: companyId,
          bankId: bankAccountId,
        },
      });
      if (existsingBalance) {
        existsingBalance.balance += amount;
        await existsingBalance.save();
      }

      if (bankBalance) {
        await bankBalance.increment("balance", { by: amount });
      }
      await BankLedger.create({
        bankId: bankAccountId,
        receiptId: data.id,
        companyId: companyId,
        date: paymentdate,
      });
    }
    return res.status(200).json({
      status: "true",
      message: "Receipt Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.update_receive_bank = async (req, res) => {
  try {
    const user = req.user.userId;
    const role = req.user.role;
    const companyId = req.user.companyId;
    const { id } = req.params;

    const {
      voucherno,
      bankAccountId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
      paymentType,
      transactionType,
    } = req.body;

    const receiveBankId = await Receipt.findOne({
      where: {
        id: id,
        companyId: companyId,
      },
    });
    if (!receiveBankId) {
      return res
        .status(404)
        .json({ status: "false", message: "Receipt Not Found" });
    }
    const voucherNoExist = await Receipt.findOne({
      where: {
        voucherno: voucherno,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (voucherNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Voucher Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: {
        id: accountId,
        companyId: companyId,
        isActive: true,
      },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (transactionType === TRANSACTION_TYPE.BANK) {
      const accountData = await companyBankDetails.findOne({
        where: {
          id: bankAccountId,
          companyId: companyId,
        },
      });
      if (!accountData) {
        return res
          .status(404)
          .json({ status: "false", message: "Bank Account Not Found" });
      }
    }

    await Receipt.update(
      {
        voucherno,
        bankAccountId,
        paymentdate,
        mode,
        referance,
        accountId,
        amount,
        paymentType,
        transactionType,
        createdBy: receiveBankId.createdBy,
        updatedBy: user,
        companyId: companyId,
      },
      { where: { id } }
    );

    if (transactionType === TRANSACTION_TYPE.CASH) {
      let existsingCashBalance;
      if (role === ROLE.SUPER_ADMIN) {
        existsingCashBalance = await companyCashBalance.findOne({
          where: { companyId: companyId },
        });
      } else {
        existsingCashBalance = await C_UserBalance.findOne({
          where: { companyId: companyId, userId: user },
        });
      }
      // const existsingCashBalance = await companyCashBalance.findOne({
      //   where: { companyId: companyId },
      // });
      if (existsingCashBalance) {
        await existsingCashBalance.decrement("balance", { by: receiveBankId.amount, });
        await existsingCashBalance.increment("balance", { by: amount });
        if (existsingCashBalance?.incomes >= 0) {
          await existsingCashBalance.decrement("incomes", { by: receiveBankId.amount });
          await existsingCashBalance.increment("incomes", { by: amount });
        }
      }
      await BankLedger.update(
        {
          date: paymentdate,
        },
        {
          where: {
            companyId: companyId,
            receiptId: id,
          },
        }
      );
    } else if (transactionType === TRANSACTION_TYPE.BANK) {
      const existsingBalance = await companyBalance.findOne({
        where: { companyId: companyId },
      });

      const bankBalance = await BankBalance.findOne({
        where: {
          companyId: companyId,
          bankId: bankAccountId,
        },
      });

      const balanceChange = amount - receiveBankId.amount;
      const newBalance = existsingBalance.balance + balanceChange;

      existsingBalance.balance = newBalance;
      await existsingBalance.save();

      if (bankBalance) {
        await bankBalance.decrement("balance", { by: receiveBankId.amount });
        await bankBalance.increment("balance", { by: amount });
      }

      await BankLedger.update(
        {
          date: paymentdate,
          bankId: bankAccountId,
        },
        {
          where: {
            companyId: companyId,
            receiptId: id,
          },
        }
      );
    }

    const data = await Receipt.findOne({
      where: { id: id, companyId: companyId },
    });
    return res.status(200).json({
      status: "true",
      message: "Receipt Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.delete_receive_bank = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user.userId;
    const role = req.user.role;
    const { companyId, } = req.user;

    const receiptExist = await Receipt.findOne({
      where: {
        id: id,
        companyId: companyId,
      },
    });

    if (!receiptExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Receipt Not Found" });
    }

    const transactionType = receiptExist.transactionType;
    const amount = receiptExist.amount;

    if (transactionType === TRANSACTION_TYPE.CASH) {
      let existsingCashBalance;
      if (role === ROLE.SUPER_ADMIN) {
        existsingCashBalance = await companyCashBalance.findOne({
          where: { companyId: companyId },
        });
      } else {
        existsingCashBalance = await C_UserBalance.findOne({
          where: { companyId: companyId, userId: user },
        });
      }
      // const existsingCashBalance = await companyCashBalance.findOne({
      //   where: { companyId: companyId },
      // });
      if (existsingCashBalance) {
        await existsingCashBalance.decrement("balance", { by: amount });
        if (existsingCashBalance?.incomes >= 0) {
          await existsingCashBalance.decrement("incomes", { by: amount });
        }
      }
    } else if (transactionType === TRANSACTION_TYPE.BANK) {
      const existsingBalance = await companyBalance.findOne({
        where: { companyId: companyId },
      });
      const bankBalance = await BankBalance.findOne({
        where: {
          companyId: companyId,
          bankId: receiptExist.bankAccountId,
        },
      });
      if (receiptExist.amount > bankBalance.balance) {
        return res.status(400).json({
          status: "false",
          message: "Bank Account has no enough money."
        })
      }
      if (existsingBalance) {
        await existsingBalance.decrement("balance", { by: amount });
      }
      if (bankBalance) {
        await bankBalance.decrement("balance", { by: amount });
      }
    }
    await receiptExist.destroy();

    return res
      .status(200)
      .json({ status: "true", message: "Receipt Delete Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_receive_bank = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await Receipt.findOne({
      where: { id: id, companyId: companyId },
      include: [
        { model: Account, as: "accountReceipt" },
        { model: companyBankDetails, as: "receiptBankAccount" },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Receipt Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Receipt Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_all_receive_bank = async (req, res) => {
  try {
    const { companyId } = req.user;
    const data = await Receipt.findAll({
      where: { companyId: companyId },
      include: [
        { model: Account, as: "accountReceipt" },
        { model: companyBankDetails, as: "receiptBankAccount" },
        { model: User, as: "bankCreateUser", attributes: ["username"] },
        { model: User, as: "bankUpdateUser", attributes: ["username"] },
      ],
    });

    return res.status(200).json({
      status: "true",
      message: "Receive Bank Show Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
