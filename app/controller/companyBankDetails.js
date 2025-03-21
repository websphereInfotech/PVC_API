const { Sequelize, Op } = require("sequelize");
const company = require("../models/company");
const companyBankDetails = require("../models/companyBankDetails");
const BankBalance = require('../models/BankBalance')
const BankLedger = require('../models/BankLedger')
exports.create_company_bankDetails = async (req, res) => {
  try {
    const {
      companyId,
      accountname,
      bankname,
      accountnumber,
      ifsccode,
      branch,
      nickname,
    } = req.body;

    if (companyId === "" || companyId === undefined || companyId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Feild:Comapny" });
    }
    const companyData = await company.findByPk(companyId);
    if (!companyData) {
      return res
        .status(404)
        .json({ status: "false", message: "Company Not Found" });
    }
    const existingAccount = await companyBankDetails.findOne({
      where: { accountnumber: accountnumber },
    });
    if (existingAccount) {
      return res
        .status(400)
        .json({ status: "false", message: "Account Number already Exists" });
    }
    const existingIfsc = await companyBankDetails.findOne({
      where: { ifsccode: ifsccode },
    });
    if (existingIfsc) {
      return res
        .status(400)
        .json({ status: "false", message: "IFSC Code already Exists" });
    }
    const data = await companyBankDetails.create({
      companyId,
      accountname,
      bankname,
      accountnumber,
      ifsccode,
      branch,
      nickname,
    });

    await BankBalance.create({
      companyId,
      bankId: data.id
    })
    return res.status(200).json({
      status: "true",
      message: "Bank Details Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_company_bankDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      companyId,
      accountname,
      bankname,
      accountnumber,
      ifsccode,
      branch,
      nickname,
    } = req.body;
    const bankData = await companyBankDetails.findByPk(id);
    if (!bankData) {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Details Not Found" });
    }
    const companyData = await company.findByPk(companyId);
    if (!companyData) {
      return res
        .status(404)
        .json({ status: "false", message: "Comapany Not Found" });
    }
    await companyBankDetails.update(
      {
        companyId,
        accountname,
        bankname,
        accountnumber,
        ifsccode,
        branch,
        nickname,
      },
      { where: { id } }
    );

    const data = await companyBankDetails.findByPk(id);
    return res.status(200).json({
      status: "true",
      message: "Bank Details Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_company_bankDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await companyBankDetails.destroy({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Details Not Found" });
    } else {
      return res
        .status(200)
        .json({ status: "true", message: "Bank Details Deleted Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_company_bankDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await companyBankDetails.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Details Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Bank Details Show Successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_all_company_bankDetails = async (req, res) => {
  try {
    const data = await companyBankDetails.findAll({
      where: { companyId: req.user.companyId },
    });
      return res.status(200).json({
        status: "true",
        message: "Bank Details Show successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};