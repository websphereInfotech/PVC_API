
const C_claimLedger = require("../models/C_claimLedger");
const C_customer = require("../models/C_customer");
const C_customerLedger = require("../models/C_customerLedger");
const C_receiveCash = require("../models/C_receiveCash");
const C_userBalance = require("../models/C_userBalance");
const companyBankDetails = require("../models/companyBankDetails");
const customer = require("../models/customer");
const customerLedger = require("../models/customerLedger");
const receiveBank = require("../models/receiveBank");
const User = require("../models/user");

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

exports.C_create_receiveCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const { customerId, amount, description, date } = req.body;

    const customerData = await C_customer.findByPk(customerId);
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
      createdBy: user,
      updatedBy: user,
    });

    await C_customerLedger.create({
      customerId,
      debitId: data.id,
      date,
    });

    await C_claimLedger.create({
      companyId: req.user.companyId,
      receiveId:data.id,
      userId:user,
      date
    });

    let userBalance = await C_userBalance.findOne({
      where: { userId: user, companyId: req.user.companyId },
    });

    if (userBalance) {
      userBalance.balance += amount;
      await userBalance.save();
    } else {
    
      userBalance = await C_userBalance.create({
        userId: user,
        companyId: req.user.companyId,
        balance: amount,
      });
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
      where: { id: id },
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
    const { id } = req.params;
    const { customerId, amount, description, date } = req.body;

    const receiveId = await C_receiveCash.findByPk(id);
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
        createdBy:receiveId.createdBy,
        updatedBy:user
      },
      { where: { id: id } }
    );

    await C_customerLedger.update(
      {
        customerId,
        date,
      },
      { where: { debitId: id } }
    );
    await C_claimLedger.update({
      date
    },{where:{receiveId:id}});

    await C_userBalance.update({
      userId:user,
      companyId:req.user.companyId,
      balance: amount,
    })
    const data = await C_receiveCash.findByPk(id);

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

    const data = await C_receiveCash.destroy({ where: { id } });
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
                                         Without  Typc C API
 ============================================================================================================ */
exports.create_receive_bank = async (req, res) => {
  try {
    const user = req.user.userId;

    const {
      voucherno,
      customerId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
    } = req.body;

    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required field : Customer" });
    }
    const customerData = await customer.findByPk(customerId);
    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
    }
    const accountData = await companyBankDetails.findByPk(accountId);
    if (!accountData) {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Acccount Not Found" });
    }
    const data = await receiveBank.create({
      voucherno,
      customerId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
      createdBy: user,
      updatedBy: user,
      companyId:req.user.companyId
    });

    await customerLedger.create({
      customerId,
      debitId: data.id,
      date: paymentdate,
    });

    return res.status(200).json({
      status: "true",
      message: "Receive Bank Create Successfully",
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
    const { id } = req.params;

    const {
      voucherno,
      customerId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
    } = req.body;

    const receiveBankId = await receiveBank.findByPk(id);
    if (!receiveBankId) {
      return res
        .status(404)
        .json({ status: "false", message: "Receive Bank Not Found" });
    }
    const customerData = await customer.findByPk(customerId);
    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
    }
    const accountData = await companyBankDetails.findByPk(accountId);
    if (!accountData) {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Acccount Not Found" });
    }

    await receiveBank.update(
      {
        voucherno,
        customerId,
        paymentdate,
        mode,
        referance,
        accountId,
        amount,
        createdBy: receiveBankId.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );

    await customerLedger.update(
      {
        customerId,
        date: paymentdate,
      },
      { where: { debitId: id } }
    );
    const data = await receiveBank.findByPk(id);

    return res.status(200).json({
      status: "true",
      message: "Recive Bank Updated Successfully",
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

    const data = await receiveBank.destroy({ where: { id } });

    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Recive Bank Delete Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Recive Bank Not Found" });
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

    const data = await receiveBank.findOne({
      where: { id },
      include: [
        { model: customer, as: "customerBank" },
        { model: companyBankDetails, as: "receiveBank" },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Receive Bank Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Receive Bank Not Found" });
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
    const data = await receiveBank.findAll({
      include: [
        { model: customer, as: "customerBank" },
        { model: companyBankDetails, as: "receiveBank" },
        { model: User, as: "bankCreateUser", attributes: ["username"] },
        { model: User, as: "bankUpdateUser", attributes: ["username"] },
      ],
    });

    if (data.length > 0) {
      return res.status(200).json({
        status: "true",
        message: "Receive Bank Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Receive Bank Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
