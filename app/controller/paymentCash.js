const C_PaymentCash = require("../models/C_paymentCash");
const C_vendor = require("../models/C_vendor");
const C_vendorLedger = require("../models/C_vendorLedger");
const companyBankDetails = require("../models/companyBankDetails");
const paymentBank = require("../models/paymentBank");
const User = require("../models/user");
const vendor = require("../models/vendor");
const vendorLedger = require("../models/vendorLedger");

/*=============================================================================================================
                                         Typc C API
 ============================================================================================================ */

exports.C_create_paymentCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const { vendorId, amount, description, date } = req.body;

    const customerData = await C_vendor.findByPk(vendorId);
    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
    }

    if (description.length > 20) {
      return res.status(400).json({
        status: "false",
        message: "Description Cannot Have More Then 20 Characters",
      });
    }
    const data = await C_PaymentCash.create({
      vendorId,
      amount,
      description,
      date,
      createdBy:user,
      updatedBy:user,
      companyId: req.user.companyId
    });

    await C_vendorLedger.create({
      vendorId,
      debitId: data.id,
      date,
    });
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
    const data = await C_PaymentCash.findAll({
      include: [{ model: C_vendor, as: "PaymentVendor" },{model:User, as:'paymentCreate',attributes:['username']}, {model:User,as:'paymentUpdate',attributes:['username']}],
      order: [["createdAt", "DESC"]],
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

exports.C_view_paymentCash = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await C_PaymentCash.findOne({
      where: { id: id },
      include: [{ model: C_vendor, as: "PaymentVendor" }],
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
    const { id } = req.params;
    const { vendorId, amount, description, date } = req.body;

    const vendorData = await vendor.findByPk(vendorId);
    if(!vendorData) {
      return res.status(404).json({ status:'false', message:'Vendor Not Found'});
    }
    const paymentId = await C_PaymentCash.findByPk(id);
    if (!paymentId) {
      return res
        .status(404)
        .json({ status: "false", message: "Payment Cash Not Found" });
    }

    await C_PaymentCash.update(
      {
        vendorId,
        amount,
        description,
        date,
        createdBy:paymentId.createdBy,
        updatedBy:user,
        companyId: req.user.companyId
      },
      { where: { id: id } }
    );

    await C_vendorLedger.update(
      {
        vendorId,
        date,
      },
      { where: { debitId: id } }
    );

    const data = await C_PaymentCash.findByPk(id);

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

    const data = await C_PaymentCash.destroy({ where: { id } });
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
                                        Without Typc C API
 ============================================================================================================ */

exports.create_payment_bank = async (req, res) => {
  try {
    const user = req.user.userId;
    const {
      voucherno,
      vendorId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
    } = req.body;

    if (!vendorId || vendorId === "" || vendorId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required field: Vendor" });
    }
    const vendordata = await vendor.findByPk(vendorId);
    if (!vendordata) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
    }

    const accountData = await companyBankDetails.findByPk(accountId);
    if (!accountData) {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Account Not Found" });
    }

    const data = await paymentBank.create({
      voucherno,
      vendorId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
      createdBy: user,
      updatedBy: user,
      companyId: req.user.companyId
    });

    await vendorLedger.create({
      vendorId,
      debitId: data.id,
      date: paymentdate,
    });
    return res.status(200).json({
      status: "true",
      message: "Bank Payment Create Successfully",
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
    const { id } = req.params;
    const {
      voucherno,
      vendorId,
      paymentdate,
      mode,
      referance,
      accountId,
      amount,
    } = req.body;

    const paymentdata = await paymentBank.findByPk(id);
    if (!paymentdata) {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Payment Not Found" });
    }

    const vendordata = await vendor.findByPk(vendorId);
    if (!vendordata) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
    }

    const accountData = await companyBankDetails.findByPk(accountId);
    if (!accountData) {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Account Not Found" });
    }
    await paymentBank.update(
      {
        voucherno,
        vendorId,
        paymentdate,
        mode,
        referance,
        accountId,
        amount,
        createdBy: paymentdata.createdBy,
        updatedBy: user,
        companyId: req.user.companyId
      },
      { where: { id } }
    );

    await vendorLedger.update(
      {
        vendorId,
        date: paymentdate,
      },
      { where: { debitId: id } }
    );
    const data = await paymentBank.findByPk(id);

    return res.status(200).json({
      status: "true",
      message: "Bank Payment Updated Successfully",
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

    const data = await paymentBank.destroy({ where: { id } });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Bank Payment Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Payment Not Found" });
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
    const data = await paymentBank.findOne({
      where: { id },
      include: [
        { model: vendor, as: "paymentData" },
        { model: companyBankDetails, as: "paymentBank" },
      ],
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Bank Payment Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Payment Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_all_payment_bank = async (req, res) => {
  try {
    const data = await paymentBank.findAll({
      include: [
        { model: vendor, as: "paymentData" },
        { model: companyBankDetails, as: "paymentBank" },
        { model: User, as: "paymentCreateUser", attributes: ["username"] },
        { model: User, as: "paymentUpdateUser", attributes: ["username"] },
      ],
    });

    if (data.length > 0) {
      return res.status(200).json({
        status: "true",
        message: "Bank Payment Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Payment Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
