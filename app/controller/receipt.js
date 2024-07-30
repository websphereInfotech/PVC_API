const C_claimLedger = require("../models/C_claimLedger");
const C_companyBalance = require("../models/C_companyBalance");
const C_customer = require("../models/C_customer");
const C_customerLedger = require("../models/C_customerLedger");
const C_receiveCash = require("../models/C_receiveCash");
const C_userBalance = require("../models/C_userBalance");
const companyBalance = require("../models/companyBalance");
const companyBankDetails = require("../models/companyBankDetails");
const companyBankLedger = require("../models/companyBankLedger");
const companySingleBank = require("../models/companySingleBank");
const companySingleBankLedger = require("../models/companySingleBankLedger");
const customer = require("../models/customer");
const Account = require("../models/Account");
const AccountDetail = require("../models/AccountDetail");
const customerLedger = require("../models/customerLedger");
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
    const { customerId, receiptNo, amount, description, date } = req.body;

    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    const receiptNoExist = await C_receiveCash.findOne({
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
    const customerData = await C_customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });
    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
    }

    if (description.length > 20) {
      return res.status(400).json({
        status: "false",
        message: "Description Cannot Have More Then 20 Characters",
      });
    }
    const data = await C_receiveCash.create({
      customerId,
      amount,
      description,
      date,
      receiptNo,
      createdBy: user,
      updatedBy: user,
      companyId: req.user.companyId,
    });

    await C_customerLedger.create({
      companyId: req.user.companyId,
      debitId: data.id,
      customerId,
      date,
    });

    await C_claimLedger.create({
      companyId: req.user.companyId,
      receiveId: data.id,
      userId: user,
      date,
    });

    let userBalance = await C_userBalance.findOne({
      where: { userId: user, companyId: req.user.companyId },
    });

    if (userBalance) {
      userBalance.balance += amount;
      await userBalance.save();
    }

    const existingBalance = await C_companyBalance.findOne({
      where: { companyId: req.user.companyId },
    });
    if (existingBalance) {
      existingBalance.balance += amount;
      await existingBalance.save();
    }

    return res.status(200).json({
      status: "true",
      message: "Receive Cash Create Successfully",
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
    const data = await C_receiveCash.findAll({
      where: { companyId: req.user.companyId },
      include: [
        { model: C_customer, as: "ReceiveCustomer" },
        { model: User, as: "receiveCreate", attributes: ["username"] },
        { model: User, as: "receiveUpdate", attributes: ["username"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Receive Cash Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Receive Cash not found" });
    }
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
    const data = await C_receiveCash.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [{ model: C_customer, as: "ReceiveCustomer" }],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Receive Cash Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Receive Cash not found" });
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
    const { customerId, receiptNo,  amount, description, date } = req.body;

    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    const receiptNoExist = await C_receiveCash.findOne({
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
    const receiveId = await C_receiveCash.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!receiveId) {
      return res
        .status(404)
        .json({ status: "false", message: "Receive Cash Not Found" });
    }

    await C_receiveCash.update(
      {
        customerId,
        amount,
        description,
        date,
        receiptNo,
        createdBy: receiveId.createdBy,
        updatedBy: user,
        companyId: req.user.companyId,
      },
      { where: { id: id } }
    );

    await C_customerLedger.update(
      {
        companyId: req.user.companyId,
        customerId,
        date,
      },
      { where: { debitId: id } }
    );
    await C_claimLedger.update(
      {
        companyId: req.user.companyId,
        date,
      },
      { where: { receiveId: id } }
    );

    const existsingBalance = await C_userBalance.findOne({
      where: { userId: user, companyId: req.user.companyId },
    });

    const balanceChange = amount - receiveId.amount;
    const newBalance = existsingBalance.balance + balanceChange;

    await C_userBalance.update(
      {
        balance: newBalance,
      },
      { where: { userId: user, companyId: req.user.companyId } }
    );

    const balanceExists = await C_companyBalance.findOne({
      where: { companyId: req.user.companyId },
    });

    const changeBalance = amount - receiveId.amount;
    const balanceNew = balanceExists.balance + changeBalance;

    await C_companyBalance.update(
      {
        balance: balanceNew,
      },
      { where: { companyId: req.user.companyId } }
    );
    const data = await C_receiveCash.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    return res.status(200).json({
      status: "true",
      message: "Receive Cash Updated Successfully",
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

    const data = await C_receiveCash.destroy({
      where: { id: id, companyId: req.user.companyId },
    });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Receive Cash Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Receive Cash Not Found" });
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
      where: { companyId: req.user.companyId },
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
        companyId: req.user.companyId,
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
      where: { companyId: req.user.companyId },
    });

    const balanceChange = amount - receiveBankId.amount;
    const newBalance = existsingBalance.balance + balanceChange;

    await companyBalance.update(
      {
        balance: newBalance,
      },
      { where: { companyId: req.user.companyId } }
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
