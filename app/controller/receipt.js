const C_companyBalance = require("../models/C_companyBalance");
const C_Receipt = require("../models/C_Receipt");
const C_userBalance = require("../models/C_userBalance");
const companyBalance = require("../models/companyBalance");
const Account = require("../models/Account");
const Receipt = require("../models/Receipt");
const User = require("../models/user");
const {Sequelize} = require("sequelize");

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */

exports.C_create_receiveCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const companyId = req.user.companyId;
    const { accountId, receiptNo, amount, description, date } = req.body;

    const receiptNoExist = await C_Receipt.findOne({
      where: {
        receiptNo: receiptNo,
        companyId: companyId
      }
    })
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

    // await C_customerLedger.create({
    //   companyId: req.user.companyId,
    //   debitId: data.id,
    //   customerId,
    //   date,
    // });
    //
    // await C_claimLedger.create({
    //   companyId: req.user.companyId,
    //   receiveId: data.id,
    //   userId: user,
    //   date,
    // });

    let userBalance = await C_userBalance.findOne({
      where: { userId: user, companyId: companyId },
    });

    if (userBalance) {
      userBalance.balance += amount;
      await userBalance.save();
    }

    const existingBalance = await C_companyBalance.findOne({
      where: { companyId: companyId },
    });
    if (existingBalance) {
      existingBalance.balance += amount;
      await existingBalance.save();
    }

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
    const {companyId} = req.user;
    const data = await C_Receipt.findAll({
      where: { companyId: companyId },
      include: [
        { model: Account, as: "accountReceiptCash" },
        { model: User, as: "receiveCreate", attributes: ["username"] },
        { model: User, as: "receiveUpdate", attributes: ["username"] },
      ],
      order: [["createdAt", "DESC"]],
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
    const {companyId} = req.user;
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
    const { id } = req.params;
    const { accountId, receiptNo,  amount, description, date } = req.body;


    const receiptNoExist = await C_Receipt.findOne({
      where: {
        receiptNo: receiptNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id }
      }
    })
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

    const balanceExists = await C_companyBalance.findOne({
      where: { companyId: companyId },
    });

    const changeBalance = amount - receiveId.amount;
    const balanceNew = balanceExists.balance + changeBalance;

    await C_companyBalance.update(
      {
        balance: balanceNew,
      },
      { where: { companyId: companyId } }
    );
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
    const {companyId} = req.user;

    const data = await C_Receipt.destroy({
      where: { id: id, companyId: companyId },
    });
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
      receiptAccountId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
      paymentType
    } = req.body;

    const voucherNoExist = await Receipt.findOne({
      where: {
        voucherno: voucherno,
        companyId: companyId,
      }
    })
    if (voucherNoExist) {
      return res
          .status(400)
          .json({ status: "false", message: "Voucher Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: {
        id: accountId,
        companyId: companyId,
        isActive: true
      },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    const receiptAccountExist = await Account.findOne({
      where: {
        id: receiptAccountId,
        companyId: companyId,
        isActive: true
      },
    });
    if (!receiptAccountExist) {
      return res
          .status(404)
          .json({ status: "false", message: "Receipt Account Not Found" });
    }


    const data = await Receipt.create({
      voucherno,
      receiptAccountId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
      paymentType,
      createdBy: user,
      updatedBy: user,
      companyId: companyId,
    });

    // await customerLedger.create({
    //   companyId: req.user.companyId,
    //   customerId,
    //   debitId: data.id,
    //   date: paymentdate,
    // });
    //
    // await companyBankLedger.create({
    //   companyId: req.user.companyId,
    //   creditId: data.id,
    //   date: paymentdate,
    // });
    //
    // await companySingleBankLedger.create({
    //   companyId: req.user.companyId,
    //   creditId: data.id,
    //   accountId: accountId,
    //   date: paymentdate,
    // });
    const existsingBalance = await companyBalance.findOne({
      where: { companyId: companyId },
    });
    if (existsingBalance) {
      existsingBalance.balance += amount;
      await existsingBalance.save();
    }

    // const balanceExists = await companySingleBank.findOne({
    //   where: { accountId: accountId, companyId: req.user.companyId },
    // });
    // if (balanceExists) {
    //   balanceExists.balance += amount;
    //   await balanceExists.save();
    // }
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
      receiptAccountId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
      paymentType
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
      }
    })
    if (voucherNoExist) {
      return res
          .status(400)
          .json({ status: "false", message: "Voucher Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: {
        id: accountId,
        companyId: companyId,
        isActive: true
      },
    });
    if (!accountExist) {
      return res
          .status(404)
          .json({ status: "false", message: "Account Not Found" });
    }
    const receiptAccountExist = await Account.findOne({
      where: {
        id: receiptAccountId,
        companyId: companyId,
        isActive: true
      },
    });
    if (!receiptAccountExist) {
      return res
          .status(404)
          .json({ status: "false", message: "Receipt Account Not Found" });
    }

    await Receipt.update(
      {
        voucherno,
        receiptAccountId,
        paymentdate,
        mode,
        referance,
        accountId,
        amount,
        paymentType,
        createdBy: receiveBankId.createdBy,
        updatedBy: user,
        companyId: companyId,
      },
      { where: { id } }
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
    const existsingBalance = await companyBalance.findOne({
      where: { companyId: companyId },
    });

    const balanceChange = amount - receiveBankId.amount;
    const newBalance = existsingBalance.balance + balanceChange;

    await companyBalance.update(
      {
        balance: newBalance,
      },
      { where: { companyId: companyId } }
    );
    // const balanceExists = await companySingleBank.findOne({
    //   where: { accountId: accountId, companyId: req.user.companyId },
    // });
    //
    // const changeBalance = amount - receiveBankId.amount;
    // const balanceNew = balanceExists.balance + changeBalance;
    //
    // await companySingleBank.update(
    //   {
    //     balance: balanceNew,
    //   },
    //   { where: { accountId: accountId, companyId: req.user.companyId } }
    // );
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
    const {companyId} = req.user;

    const data = await Receipt.destroy({
      where: { id: id, companyId: companyId },
    });

    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Receipt Delete Successfully" });
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
exports.view_receive_bank = async (req, res) => {
  try {
    const { id } = req.params;
    const {companyId} = req.user;

    const data = await Receipt.findOne({
      where: { id: id, companyId: companyId },
      include: [
        { model: Account, as: "accountReceipt" },
        { model: Account, as: "receiptAccount" },
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
    const {companyId} = req.user;
    const data = await Receipt.findAll({
      where: { companyId: companyId },
      include: [
        { model: Account, as: "accountReceipt" },
        { model: Account, as: "receiptAccount" },
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
