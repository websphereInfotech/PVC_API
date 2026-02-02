const C_companyBalance = require("../models/C_companyBalance");
const C_Payment = require("../models/C_Payment");
const companyBalance = require("../models/companyBalance");
const Payment = require("../models/Payment");
const User = require("../models/user");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const Account = require("../models/Account");
const { Sequelize, Op } = require("sequelize");
const companyBankDetails = require("../models/companyBankDetails");
const { TRANSACTION_TYPE, ROLE } = require("../constant/constant");
const CompanyCashBalance = require("../models/companyCashBalance");
const C_WalletLedger = require("../models/C_WalletLedger");
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

exports.C_create_paymentCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const role = req.user.role;
    const companyId = req.user.companyId;
    const { accountId, paymentNo, amount, description, date } = req.body;

    const paymentNoExist = await C_Payment.findOne({
      where: {
        paymentNo: paymentNo,
        companyId: companyId,
      },
    });
    if (paymentNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Payment Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }

    if (description.length > 30) {
      return res.status(400).json({
        status: "false",
        message: "Description Cannot Have More Then 20 Characters",
      });
    }
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
    const balance = existingBalance?.balance ?? 0;
    if (balance < amount) {
      return res.status(400).json({
        status: "false",
        message: "Not enough fund.",
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
      // Fetch the last recorded day's closing balance to use as today's opening balance
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

    // Increment totalDebit and decrement closingBalance for this date snapshot
    await dailyRow.increment('totalDebit', { by: amount });
    await dailyRow.increment('closingBalance', { by: -amount });

    const data = await C_Payment.create({
      accountId,
      amount,
      description,
      date,
      paymentNo: paymentNo,
      createdBy: user,
      updatedBy: user,
      companyId: companyId,
    });

    await C_Ledger.create({
      accountId: accountId,
      companyId: companyId,
      paymentId: data.id,
      date: date,
    });
    if (role === ROLE.SUPER_ADMIN) {
      await C_WalletLedger.create({
        paymentId: data.id,
        userId: user,
        companyId: companyId,
        date: date,
        isApprove: true,
        approveDate: new Date(),
      });

      await C_Cashbook.create({
        C_paymentId: data.id,
        companyId: companyId,
        date: date,
      });
    } else {
      await C_WalletLedger.create({
        paymentId: data.id,
        userId: user,
        companyId: companyId,
        date: date,
      });
    }
    if (existingBalance) {
      await existingBalance.decrement("balance", { by: amount });
    }
    await syncDailyBalances(date, companyId);
    return res.status(200).json({
      status: "true",
      message: "Payment Cash Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_get_all_paymentCash = async (req, res) => {
  try {
    const { companyId } = req.user;
    const data = await C_Payment.findAll({
      where: { companyId: companyId },
      include: [
        { model: Account, as: "accountPaymentCash" },
        { model: User, as: "paymentCreate", attributes: ["username"] },
        { model: User, as: "paymentUpdate", attributes: ["username"] },
      ],
    });
    return res.status(200).json({
      status: "true",
      message: "Payment Cash Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_view_paymentCash = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const data = await C_Payment.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: Account, as: "accountPaymentCash" }],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Payment Cash Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Cash not found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_update_paymentCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const role = req.user.role;
    const companyId = req.user.companyId;
    const { id } = req.params;
    const { accountId, paymentNo, amount, description, date } = req.body;
    const paymentNoExist = await C_Payment.findOne({
      where: {
        paymentNo: paymentNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (paymentNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Payment Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    const paymentId = await C_Payment.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!paymentId) {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Cash Not Found" });
    }

    const oldAmount = Number(paymentId.amount || 0);
    const oldDate = paymentId.date;
    const newAmount = Number(amount || 0);

    // 1. Reverse the old debit amount from the original date snapshot
    const oldDailyRow = await C_DailyBalance.findOne({ where: { date: oldDate, companyId } });
    if (oldDailyRow) {
      // Reversing a debit means decreasing totalDebit and increasing closingBalance
      await oldDailyRow.decrement('totalDebit', { by: oldAmount });
      await oldDailyRow.increment('closingBalance', { by: oldAmount });
    }

    // 2. Apply the new debit amount to the target date snapshot (handles date changes)
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

    // Apply the new debit: increase totalDebit and decrease closingBalance
    await newDailyRow.increment('totalDebit', { by: newAmount });
    await newDailyRow.increment('closingBalance', { by: -newAmount });

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
    const balance = existingBalance?.balance ?? 0;
    const balanceNeeded = amount - oldAmount;

    if (balance < balanceNeeded) {
      return res.status(400).json({
        status: "false",
        message: "Not enough fund.",
      });
    }

    await C_Payment.update(
      {
        accountId,
        amount,
        description,
        date,
        paymentNo,
        createdBy: paymentId.createdBy,
        updatedBy: user,
        companyId: companyId,
      },
      { where: { id: id } }
    );

    await C_Ledger.update(
      {
        accountId: accountId,
        paymentId: id,
        date: date,
      },
      {
        where: {
          paymentId: id,
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
            paymentId: id,
            companyId: companyId,
            userId: user,
          },
        }
      );

      await C_Cashbook.update(
        {
          date: date,
        },
        {
          where: {
            C_paymentId: id,
            companyId: companyId,
          },
        }
      );
    } else {
      const walletLedgerExist = await C_WalletLedger.findOne({
        where: {
          paymentId: id,
          companyId: companyId,
          userId: user,
        },
      });

      const cashbookEntry = await C_Cashbook.findOne({
        where: {
          C_paymentId: id,
          companyId: companyId,
        },
      });
      const entryApprove = walletLedgerExist.isApprove;
      if (entryApprove) {
        walletLedgerExist.approveDate = new Date();
        cashbookEntry.date = date;
        await cashbookEntry.save();
        if (existingBalance) {
          await existingBalance.increment("incomes", { by: oldAmount });
          await existingBalance.decrement("incomes", { by: amount });
        }
      }
      walletLedgerExist.date = date;
      await walletLedgerExist.save();
    }
    if (existingBalance) {
      await existingBalance.increment("balance", { by: oldAmount });
      await existingBalance.decrement("balance", { by: amount });
    }

    await syncDailyBalances(date, companyId);

    const data = await C_Payment.findOne({
      where: { id: id, companyId: companyId },
    });

    return res.status(200).json({
      status: "true",
      message: "Payment Cash Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_delete_paymentCash = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId, role } = req.user;
    const paymentData = await C_Payment.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!paymentData) {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Cash Not Found" });
    }
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
    const oldAmount = paymentData?.amount ?? 0;
    const oldDate = paymentData.date;

    const walletLedgerExist = await C_WalletLedger.findOne({
      where: {
        paymentId: id,
        companyId: companyId,
        userId: userId,
      },
    });
    const entryApprove = walletLedgerExist?.isApprove;

    const dailyRow = await C_DailyBalance.findOne({
      where: { date: oldDate, companyId }
    });

    if (dailyRow) {
      // Reversing a payment: reduce totalDebit and restore the closingBalance
      await dailyRow.decrement('totalDebit', { by: oldAmount });
      await dailyRow.increment('closingBalance', { by: oldAmount });
    }

    await C_Payment.destroy({
      where: { id: id, companyId: companyId },
    });
    if (existingBalance) {
      await existingBalance.increment("balance", { by: oldAmount });
      if (existingBalance?.incomes >= 0 && entryApprove) {
        await existingBalance.increment("incomes", { by: oldAmount });
      }
    }

    await syncDailyBalances(oldDate, companyId);

    return res
      .status(200)
      .json({ status: "true", message: "Payment Cash Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_soft_delete_paymentCash = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId } = req.user;
    const paymentData = await C_Payment.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!paymentData) {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Cash Not Found" });
    }

    // Soft delete - mark as inactive (NO balance change)
    await C_Payment.update(
      { isActive: false, updatedBy: userId },
      { where: { id: id, companyId: companyId } }
    );

    return res
      .status(200)
      .json({ status: "true", message: "Payment Cash Soft Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
/*=============================================================================================================
                                        Without Type C API
 ============================================================================================================ */

exports.create_payment_bank = async (req, res) => {
  try {
    const user = req.user.userId;
    const role = req.user.role;
    const companyId = req.user.companyId;
    const {
      voucherno,
      paymentdate,
      mode,
      referance,
      accountId,
      bankAccountId,
      amount,
      paymentType,
      transactionType,
    } = req.body;
    const voucherNoExist = await Payment.findOne({
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
      where: { id: accountId, companyId: companyId, isActive: true },
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
      const bankBalance = await BankBalance.findOne({
        where: {
          companyId: companyId,
          bankId: bankAccountId,
        },
      });

      if (bankBalance && amount > bankBalance.balance) {
        return res.status(400).json({
          status: "false",
          message: "Bank Account has no enough money.",
        });
      }
    }

    const data = await Payment.create({
      voucherno,
      accountId,
      bankAccountId,
      paymentdate,
      mode,
      referance,
      amount,
      paymentType,
      transactionType,
      createdBy: user,
      updatedBy: user,
      companyId: companyId,
    });

    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      paymentId: data.id,
      date: paymentdate,
    });

    if (transactionType === TRANSACTION_TYPE.CASH) {
      // const existsingCashBalance = await CompanyCashBalance.findOne({
      //   where: { companyId: companyId },
      // });
      let existsingCashBalance;
      if (role === ROLE.SUPER_ADMIN) {
        existsingCashBalance = await C_companyBalance.findOne({
          where: { companyId: companyId },
        });
      } else {
        existsingCashBalance = await C_UserBalance.findOne({
          where: { companyId: companyId, userId: user },
        });
      }
      if (existsingCashBalance) {
        await existsingCashBalance.decrement("balance", { by: amount });
        if (existsingCashBalance?.incomes >= 0) {
          await existsingCashBalance.decrement("incomes", { by: amount });
        }
      }
      await BankLedger.create({
        bankId: 1,
        paymentId: data.id,
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
        existsingBalance.balance -= amount;
        await existsingBalance.save();
      }

      if (bankBalance) {
        await bankBalance.decrement("balance", { by: amount });
      }
      await BankLedger.create({
        bankId: bankAccountId,
        paymentId: data.id,
        companyId: companyId,
        date: paymentdate,
      });
    }

    return res.status(200).json({
      status: "true",
      message: "Payment Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.update_payment_bank = async (req, res) => {
  try {
    const user = req.user.userId;
    const role = req.user.role;
    const companyId = req.user.companyId;
    const { id } = req.params;
    const {
      voucherno,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
      paymentType,
      bankAccountId,
      transactionType,
    } = req.body;

    const paymentdata = await Payment.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!paymentdata) {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Not Found" });
    }
    const voucherNoExist = await Payment.findOne({
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
      where: { id: accountId, companyId: companyId, isActive: true },
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
      const bankBalance = await BankBalance.findOne({
        where: {
          companyId: companyId,
          bankId: bankAccountId,
        },
      });

      const newBalance = bankBalance.balance + paymentdata.amount

      if (bankBalance && amount > newBalance) {
        return res.status(400).json({
          status: "false",
          message: "Bank Account has no enough money.",
        });
      }
    }
    await Payment.update(
      {
        voucherno,
        bankAccountId,
        paymentdate,
        mode,
        referance,
        accountId,
        amount,
        paymentType,
        createdBy: paymentdata.createdBy,
        updatedBy: user,
        companyId: companyId,
        transactionType,
      },
      { where: { id } }
    );

    if (transactionType === TRANSACTION_TYPE.CASH) {
      let existsingCashBalance;
      if (role === ROLE.SUPER_ADMIN) {
        existsingCashBalance = await C_companyBalance.findOne({
          where: { companyId: companyId },
        });
      } else {
        existsingCashBalance = await C_UserBalance.findOne({
          where: { companyId: companyId, userId: user },
        });
      }
      // const existsingCashBalance = await CompanyCashBalance.findOne({
      //   where: { companyId: companyId },
      // });
      if (existsingCashBalance) {
        await existsingCashBalance.increment("balance", { by: paymentdata.amount, });
        await existsingCashBalance.decrement("balance", { by: amount });
        if (existsingCashBalance?.incomes >= 0) {
          await existsingCashBalance.increment("incomes", { by: paymentdata.amount, });
          await existsingCashBalance.decrement("incomes", { by: amount });
        }
      }
      await BankLedger.update(
        {
          date: paymentdate,
        },
        {
          where: {
            paymentId: id,
            companyId: companyId,
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

      const balanceChange = amount - paymentdata.amount;
      const newBalance = existsingBalance.balance - balanceChange;

      if (existsingBalance) {
        existsingBalance.balance = newBalance;
        await existsingBalance.save();
      }
      if (bankBalance) {
        await bankBalance.increment("balance", { by: paymentdata.amount });
        await bankBalance.decrement("balance", { by: amount });
      }

      await BankLedger.update(
        {
          date: paymentdate,
          bankId: bankAccountId,
        },
        {
          where: {
            companyId: companyId,
            paymentId: id,
          },
        }
      );
    }

    const data = await Payment.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    return res.status(200).json({
      status: "true",
      message: "Payment Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.delete_payment_bank = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const role = req.user.role;
    const user = req.user.userId;

    const paymentExist = await Payment.findOne({
      where: {
        id: id,
        companyId: companyId,
      },
    });

    if (!paymentExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Not Found" });
    }

    const transactionType = paymentExist.transactionType;
    const amount = paymentExist.amount;

    if (transactionType === TRANSACTION_TYPE.CASH) {
      let existsingCashBalance;
      if (role === ROLE.SUPER_ADMIN) {
        existsingCashBalance = await C_companyBalance.findOne({
          where: { companyId: companyId },
        });
      } else {
        existsingCashBalance = await C_UserBalance.findOne({
          where: { companyId: companyId, userId: user },
        });
      }
      // const existsingCashBalance = await CompanyCashBalance.findOne({
      //   where: { companyId: companyId },
      // });
      if (existsingCashBalance) {
        await existsingCashBalance.increment("balance", { by: amount });
        if (existsingCashBalance?.incomes >= 0) {
          await existsingCashBalance.increment("incomes", { by: amount });
        }
      }
    } else if (transactionType === TRANSACTION_TYPE.BANK) {
      const existsingBalance = await companyBalance.findOne({
        where: { companyId: companyId },
      });

      const bankBalance = await BankBalance.findOne({
        where: {
          companyId: companyId,
          bankId: paymentExist.bankAccountId,
        },
      });

      if (existsingBalance) {
        await existsingBalance.increment("balance", { by: amount });
      }
      if (bankBalance) {
        await bankBalance.increment("balance", { by: amount });
      }
    }
    await paymentExist.destroy();
    return res
      .status(200)
      .json({ status: "true", message: "Payment Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_payment_bank = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const data = await Payment.findOne({
      where: { id: id, companyId: companyId },
      include: [
        { model: Account, as: "accountPayment" },
        { model: companyBankDetails, as: "paymentBankAccount" },
      ],
    });

    return res.status(200).json({
      status: "true",
      message: "Payment Show Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_all_payment_bank = async (req, res) => {
  try {
    const data = await Payment.findAll({
      where: { companyId: req.user.companyId },
      include: [
        { model: Account, as: "accountPayment" },
        { model: companyBankDetails, as: "paymentBankAccount" },
        { model: User, as: "paymentCreateUser", attributes: ["username"] },
        { model: User, as: "paymentUpdateUser", attributes: ["username"] },
      ],
    });

    return res.status(200).json({
      status: "true",
      message: "Payment Show Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};