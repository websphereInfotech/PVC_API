const C_companyBalance = require("../models/C_companyBalance");
const C_Payment = require("../models/C_Payment");
const companyBalance = require("../models/companyBalance");
const Payment = require("../models/Payment");
const User = require("../models/user");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const Account = require("../models/Account");
const { Sequelize } = require("sequelize");
const companyBankDetails = require("../models/companyBankDetails");
const { TRANSACTION_TYPE, ROLE } = require("../constant/constant");
const CompanyCashBalance = require("../models/companyCashBalance");
const C_WalletLedger = require("../models/C_WalletLedger");
const C_UserBalance = require("../models/C_userBalance");
const C_Cashbook = require("../models/C_Cashbook");

/*=============================================================================================================
                                         Type C API
 ============================================================================================================ */

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
    const balance = existingBalance?.balance ?? 0;
    if (balance < amount) {
      return res.status(400).json({
        status: "false",
        message: "Not enough fund.",
      });
    }
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
    const oldAmount = paymentId?.amount ?? 0;
    const balance = existingBalance?.balance ?? 0;
    const newAmount = amount - oldAmount;

    if (balance < newAmount) {
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
      await C_WalletLedger.update(
        {
          date: date,
        },
        {
          where: {
            paymentId: id,
            userId: user,
            companyId: companyId,
          },
        }
      );
    }
    if (existingBalance) {
      await existingBalance.increment("balance", { by: oldAmount });
      await existingBalance.decrement("balance", { by: amount });
    }

    // await C_vendorLedger.update(
    //   {
    //     vendorId,
    //     date,
    //   },
    //   { where: { creditId: id } }
    // );

    // const existingBalance = await C_companyBalance.findOne({
    //   where: { companyId: companyId },
    // });
    //
    // const balanceChange = amount - paymentId.amount;
    // const newBalance = existingBalance.balance - balanceChange;
    //
    // await C_companyBalance.update(
    //   {
    //     balance: newBalance,
    //   },
    //   { where: { companyId: companyId } }
    // );
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

    const data = await C_Payment.destroy({
      where: { id: id, companyId: companyId },
    });
    if (existingBalance) {
      await existingBalance.increment("balance", { by: oldAmount });
    }
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Payment Cash Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Cash Not Found" });
    }
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

    // await vendorLedger.create({
    //   vendorId,
    //   creditId: data.id,
    //   date: paymentdate,
    //   companyId: req.user.companyId,
    // });

    // await companyBankLedger.create({
    //   companyId: req.user.companyId,
    //   debitId: data.id,
    //   date: paymentdate,
    // });

    // await companySingleBankLedger.create({
    //   companyId: req.user.companyId,
    //   debitId: data.id,
    //   date: paymentdate,
    //   accountId: accountId,
    // });
    // For Account
    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      paymentId: data.id,
      date: paymentdate,
    });

    await C_Cashbook.create({
      paymentId: data.id,
      companyId: companyId,
      date: paymentdate,
    });

    if (transactionType === TRANSACTION_TYPE.CASH) {
      const existsingCashBalance = await CompanyCashBalance.findOne({
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
        existsingBalance.balance -= amount;
        await existsingBalance.save();
      }
    }

    // const balanceExists = await companySingleBank.findOne({
    //   where: { companyId: companyId, accountId: accountId },
    // });
    //
    // if (balanceExists) {
    //   balanceExists.balance -= amount;
    //   await balanceExists.save();
    // }

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

    // await vendorLedger.update(
    //   {
    //     vendorId,
    //     date: paymentdate,
    //   },
    //   { where: { creditId: id } }
    // );
    //
    // await companyBankLedger.update(
    //   {
    //     companyId: req.user.companyId,
    //     date: paymentdate,
    //   },
    //   { where: { debitId: id } }
    // );
    //
    // await companySingleBankLedger.update(
    //   {
    //     companyId: req.user.companyId,
    //     accountId: accountId,
    //     date: paymentdate,
    //     },
    //     { where: { debitId: id } }
    //     );

    await C_Cashbook.update(
      {
        date: date,
      },
      {
        where: {
          paymentId: data.id,
          companyId: companyId,
        },
      }
    );

    if (transactionType === TRANSACTION_TYPE.CASH) {
      const existsingCashBalance = await CompanyCashBalance.findOne({
        where: { companyId: companyId },
      });
      if (existsingCashBalance) {
        await existsingCashBalance.increment("balance", { by: amount });
        await existsingCashBalance.decrement("balance", { by: amount });
      }
    } else if (transactionType === TRANSACTION_TYPE.BANK) {
      const existsingBalance = await companyBalance.findOne({
        where: { companyId: companyId },
      });

      const balanceChange = amount - voucherNoExist.amount;
      const newBalance = existsingBalance.balance + balanceChange;

      await companyBalance.update(
        {
          balance: newBalance,
        },
        { where: { companyId: companyId } }
      );
    }

    const existingBalance = await companyBalance.findOne({
      where: { companyId: companyId },
    });

    const balanceChange = amount - paymentdata.amount;
    const newBalance = existingBalance.balance - balanceChange;

    await companyBalance.update(
      {
        balance: newBalance,
      },
      { where: { companyId: companyId } }
    );
    // const balanceExists = await companySingleBank.findOne({
    //   where: { accountId: accountId, companyId: companyId },
    // });
    //
    // const changeBalance = amount - paymentdata.amount;
    // const balanceNew = balanceExists.balance - changeBalance;
    //
    // await companySingleBank.update(
    //   {
    //     balance: balanceNew,
    //   },
    //   { where: { companyId: req.user.companyId, accountId: accountId } }
    // );
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

    const data = await Payment.destroy({
      where: { id: id, companyId: companyId },
    });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Payment Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Not Found" });
    }
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
