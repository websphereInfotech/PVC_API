const C_companyBalance = require("../models/C_companyBalance");
const C_PaymentCash = require("../models/C_paymentCash");
const C_vendor = require("../models/C_vendor");
const C_vendorLedger = require("../models/C_vendorLedger");
const companyBalance = require("../models/companyBalance");
const companyBankDetails = require("../models/companyBankDetails");
const companyBankLedger = require("../models/companyBankLedger");
const companySingleBank = require("../models/companySingleBank");
const companySingleBankLedger = require("../models/companySingleBankLedger");
const paymentBank = require("../models/paymentBank");
const User = require("../models/user");
const vendor = require("../models/vendor");
const vendorLedger = require("../models/vendorLedger");

/*=============================================================================================================
                                         Type C API
 ============================================================================================================ */

exports.C_create_paymentCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const { vendorId, amount, description, date } = req.body;

    if (!vendorId || vendorId === "" || vendorId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Vendor" });
    }
    const vendorData = await C_vendor.findOne({
      where: { id: vendorId, companyId: req.user.companyId },
    });
    if (!vendorData) {
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
      createdBy: user,
      updatedBy: user,
      companyId: req.user.companyId,
    });

    await C_vendorLedger.create({
      vendorId,
      creditId: data.id,
      date,
      companyId: req.user.companyId,
    });

    const existingBalance = await C_companyBalance.findOne({
      where: { companyId: req.user.companyId },
    });
    if (existingBalance) {
      existingBalance.balance -= amount;
      await existingBalance.save();
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
    const data = await C_PaymentCash.findAll({
      where: { companyId: req.user.companyId },
      include: [
        { model: C_vendor, as: "PaymentVendor" },
        { model: User, as: "paymentCreate", attributes: ["username"] },
        { model: User, as: "paymentUpdate", attributes: ["username"] },
      ],
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
      where: { id: id, companyId: req.user.companyId },
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

    if (!vendorId || vendorId === "" || vendorId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Vendor" });
    }
    const vendorData = await C_vendor.findOne({
      where: { id: vendorId, companyId: req.user.companyId },
    });
    if (!vendorData) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
    }
    const paymentId = await C_PaymentCash.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
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
        createdBy: paymentId.createdBy,
        updatedBy: user,
        companyId: req.user.companyId,
      },
      { where: { id: id } }
    );

    await C_vendorLedger.update(
      {
        vendorId,
        date,
      },
      { where: { creditId: id } }
    );

    const existingBalance = await C_companyBalance.findOne({
      where: { companyId: req.user.companyId },
    });

    const balanceChange = amount - paymentId.amount;
    const newBalance = existingBalance.balance - balanceChange;

    await C_companyBalance.update(
      {
        balance: newBalance,
      },
      { where: { companyId: req.user.companyId } }
    );
    const data = await C_PaymentCash.findOne({
      where: { id: id, companyId: req.user.companyId },
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

    const data = await C_PaymentCash.destroy({
      where: { id: id, companyId: req.user.companyId },
    });
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
    const vendordata = await vendor.findOne({
      where: { id: vendorId, companyId: req.user.companyId },
    });
    if (!vendordata) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
    }

    const accountData = await companyBankDetails.findOne({
      where: { id: accountId, companyId: req.user.companyId },
    });

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
      companyId: req.user.companyId,
    });

    await vendorLedger.create({
      vendorId,
      creditId: data.id,
      date: paymentdate,
      companyId: req.user.companyId,
    });

    await companyBankLedger.create({
      companyId: req.user.companyId,
      debitId: data.id,
      date: paymentdate,
    });

    await companySingleBankLedger.create({
      companyId: req.user.companyId,
      debitId: data.id,
      date: paymentdate,
      accountId: accountId,
    });

    const existsingBalance = await companyBalance.findOne({
      where: { companyId: req.user.companyId },
    });

    if (existsingBalance) {
      existsingBalance.balance -= amount;
      await existsingBalance.save();
    }

    const balanceExists = await companySingleBank.findOne({
      where: { companyId: req.user.companyId, accountId: accountId },
    });

    if (balanceExists) {
      balanceExists.balance -= amount;
      await balanceExists.save();
    }

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

    const paymentdata = await paymentBank.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!paymentdata) {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Payment Not Found" });
    }
    if (!vendorId || vendorId === "" || vendorId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Vendor" });
    }
    const vendordata = await vendor.findOne({
      where: { id: vendorId, companyId: req.user.companyId },
    });
    if (!vendordata) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
    }

    const accountData = await companyBankDetails.findOne({
      where: { id: accountId, companyId: req.user.companyId },
    });
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
        companyId: req.user.companyId,
      },
      { where: { id } }
    );

    await vendorLedger.update(
      {
        vendorId,
        date: paymentdate,
      },
      { where: { creditId: id } }
    );

    await companyBankLedger.update(
      {
        companyId: req.user.companyId,
        date: paymentdate,
      },
      { where: { debitId: id } }
    );
    
    await companySingleBankLedger.update(
      {
        companyId: req.user.companyId,
        accountId: accountId,
        date: paymentdate,
        },
        { where: { debitId: id } }
        );
        const existingBalance = await companyBalance.findOne({
          where: { companyId: req.user.companyId },
          });
          
          const balanceChange = amount - paymentdata.amount;
          const newBalance = existingBalance.balance - balanceChange;
          
          await companyBalance.update(
            {
              balance: newBalance,
            },
            { where: { companyId: req.user.companyId } }
          );
    const balanceExists = await companySingleBank.findOne({
      where: { accountId: accountId, companyId: req.user.companyId },
    });

    const changeBalance = amount - paymentdata.amount;
    const balanceNew = balanceExists.balance - changeBalance;

    await companySingleBank.update(
      {
        balance: balanceNew,
      },
      { where: { companyId: req.user.companyId, accountId: accountId } }
    );
    const data = await paymentBank.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

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

    const data = await paymentBank.destroy({
      where: { id: id, companyId: req.user.companyId },
    });
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
      where: { id: id, companyId: req.user.companyId },
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
      where: { companyId: req.user.companyId },
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
