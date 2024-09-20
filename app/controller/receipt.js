const C_companyBalance = require("../models/C_companyBalance");
const C_Receipt = require("../models/C_Receipt");
const C_userBalance = require("../models/C_userBalance");
const companyBalance = require("../models/companyBalance");
const companyCashBalance = require("../models/companyCashBalance");
const Account = require("../models/Account");
const Receipt = require("../models/Receipt");
const User = require("../models/user");
const { Sequelize } = require("sequelize");
const companyBankDetails = require("../models/companyBankDetails");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const C_WalletLedger = require("../models/C_WalletLedger");
const { TRANSACTION_TYPE, ROLE } = require("../constant/constant");
const C_UserBalance = require("../models/C_userBalance");
const C_Cashbook = require("../models/C_Cashbook");

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */

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

    // let userBalance = await C_userBalance.findOne({
    //   where: { userId: user, companyId: companyId },
    // });
    //
    // if (userBalance) {
    //   userBalance.balance += amount;
    //   userBalance.incomes += amount;
    //   await userBalance.save();
    // }

    // const existingBalance = await C_companyBalance.findOne({
    //   where: { companyId: companyId },
    // });
    // if (existingBalance) {
    //   existingBalance.balance += amount;
    //   await existingBalance.save();
    // }

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
      where: { companyId: companyId },
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
    const oldAmount = receiveId?.amount ?? 0;

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
      await C_WalletLedger.update(
        {
          date: date,
        },
        {
          where: {
            receiptId: id,
            userId: user,
            companyId: companyId,
          },
        }
      );
    }
    if (existingBalance) {
      await existingBalance.decrement("balance", { by: oldAmount });
      await existingBalance.increment("balance", { by: amount });
      if (existingBalance?.incomes >= 0) {
        await existingBalance.decrement("incomes", { by: oldAmount });
        await existingBalance.increment("incomes", { by: amount });
      }
    }

    // await C_customerLedger.update(
    //   {
    //     companyId: req.user.companyId,
    //     customerId,
    //     date,
    //   },
    //   { where: { debitId: id } }
    // );
    // await C_claimLedger.update(
    //   {
    //     companyId: req.user.companyId,
    //     date,
    //   },
    //   { where: { receiveId: id } }
    // );

    // const existsingBalance = await C_userBalance.findOne({
    //   where: { userId: user, companyId: req.user.companyId },
    // });
    //
    // const balanceChange = amount - receiveId.amount;
    // const newBalance = existsingBalance.balance + balanceChange;

    // await C_userBalance.update(
    //   {
    //     balance: newBalance,
    //   },
    //   { where: { userId: user, companyId: req.user.companyId } }
    // );

    // const balanceExists = await C_companyBalance.findOne({
    //   where: { companyId: companyId },
    // });
    //
    // const changeBalance = amount - receiveId.amount;
    // const balanceNew = balanceExists.balance + changeBalance;
    //
    // await C_companyBalance.update(
    //     {
    //       balance: balanceNew,
    //     },
    //     { where: { companyId: companyId } }
    // );
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
    const balance = existingBalance?.balance ?? 0;

    if (balance < oldAmount) {
      return res.status(400).json({
        status: "false",
        message: "Not enough fund.",
      });
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

/*=============================================================================================================
                                         Without  Type C API
 ============================================================================================================ */
exports.create_receive_bank = async (req, res) => {
  try {
    const user = req.user.userId;
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

    await C_Cashbook.create({
      receiptId: data.id,
      companyId: companyId,
      date: paymentdate,
    });

    if (transactionType === TRANSACTION_TYPE.CASH) {
      const existsingCashBalance = await companyCashBalance.findOne({
        where: { companyId: companyId },
      });
      if (existsingCashBalance) {
        await existsingCashBalance.increment("balance", { by: amount });
      }
    } else if (transactionType === TRANSACTION_TYPE.BANK) {
      const existsingBalance = await companyBalance.findOne({
        where: { companyId: companyId },
      });
      if (existsingBalance) {
        existsingBalance.balance += amount;
        await existsingBalance.save();
      }
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

    await C_Cashbook.update(
      {
        date: paymentdate,
      },
      {
        where: {
          receiptId: id,
          companyId: companyId,
        },
      }
    );

    // await customerLedger.update(
    //   {
    //     customerId,
    //     date: paymentdate,
    //     companyId: req.user.companyId,
    //   },
    //   { where: { debitId: id } }
    // );
    //
    // await companyBankLedger.update(
    //   {
    //     companyId: req.user.companyId,
    //     date: paymentdate,
    //   },
    //   { where: { creditId: id } }
    // );
    //
    // await companySingleBankLedger.update(
    //   {
    //     companyId: req.user.companyId,
    //     date: paymentdate,
    //     accountId: accountId,
    //   },
    //   { where: { creditId: id } }
    // );
    if (transactionType === TRANSACTION_TYPE.CASH) {
      const existsingCashBalance = await companyCashBalance.findOne({
        where: { companyId: companyId },
      });
      if (existsingCashBalance) {
        await existsingCashBalance.decrement("balance", {
          by: receiveBankId.amount,
        });
        await existsingCashBalance.increment("balance", { by: amount });
      }
    } else if (transactionType === TRANSACTION_TYPE.BANK) {
      const existsingBalance = await companyBalance.findOne({
        where: { companyId: companyId },
      });

      const balanceChange = amount - receiveBankId.amount;
      const newBalance = existsingBalance.balance + balanceChange;

      existsingBalance.balance = newBalance;
      await existsingBalance.save();
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
    const { companyId } = req.user;

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
      const existsingCashBalance = await companyCashBalance.findOne({
        where: { companyId: companyId },
      });
      if (existsingCashBalance) {
        await existsingCashBalance.decrement("balance", { by: amount });
      }
    } else if (transactionType === TRANSACTION_TYPE.BANK) {
      const existsingBalance = await companyBalance.findOne({
        where: { companyId: companyId },
      });
      if (existsingBalance) {
        await existsingBalance.decrement("balance", { by: amount });
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
