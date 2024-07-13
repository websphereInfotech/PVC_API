const { Sequelize, Op } = require("sequelize");
const company = require("../models/company");
const companyBankDetails = require("../models/companyBankDetails");
const companyBankLedger = require("../models/companyBankLedger");
const paymentBank = require("../models/paymentBank");
const receiveBank = require("../models/receiveBank");
const companySingleBank = require("../models/companySingleBank");
const companySingleBankLedger = require("../models/companySingleBankLedger");

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

    await companySingleBank.create({
      companyId: companyId,
      accountId: data.id,
      balance: 0,
    });
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
exports.view_company_bankLedger = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    let whereData = {
      companyId: req.user.companyId,
    };

    if (fromDate && toDate) {
      whereData.date = {
        [Sequelize.Op.between]: [fromDate, toDate],
      };
    }
    const data = await companyBankLedger.findAll({
      where: whereData,
      include: [
        {
          model: receiveBank,
          as: "receiveData",
          attributes: [],
        },
        {
          model: paymentBank,
          as: "paymentdata",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [Sequelize.literal("IFNULL(paymentdata.amount, 0)"), "debitAmount"],
          [Sequelize.literal("IFNULL(receiveData.amount, 0)"), "creditAmount"],
          [
            Sequelize.literal(`(
              SELECT IFNULL(SUM(IFNULL(r.amount, 0) - IFNULL(p.amount, 0)), 0)
              FROM P_companyBankLedgers AS cbl
              LEFT JOIN P_receiveBanks AS r ON cbl.creditId = r.id
              LEFT JOIN P_paymentBanks AS p ON cbl.debitId = p.id
              WHERE cbl.companyId = P_companyBankLedger.companyId
              AND (cbl.date < P_companyBankLedger.date OR (cbl.date = P_companyBankLedger.date AND cbl.id < P_companyBankLedger.id))
            )`),
            "openingBalance",
          ],
          [
            Sequelize.literal(`(
              SELECT SUM(IFNULL(r.amount, 0) - IFNULL(p.amount, 0))
              FROM P_companyBankLedgers AS cbl
              LEFT JOIN P_receiveBanks AS r ON cbl.creditId = r.id
              LEFT JOIN P_paymentBanks AS p ON cbl.debitId = p.id
              WHERE cbl.companyId = P_companyBankLedger.companyId
              AND (cbl.date < P_companyBankLedger.date OR (cbl.date = P_companyBankLedger.date AND cbl.id <= P_companyBankLedger.id))
            )`),
            "remainingBalance",
          ],
        ],
      },
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Bank Data Show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Data Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_single_bankLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { fromDate, toDate } = req.query;
    let dateFilter = {};
    if (fromDate && toDate) {
      dateFilter = {
        date: {
          [Op.between]: [new Date(fromDate), new Date(toDate)],
        },
      };
    }
    const data = await companySingleBankLedger.findAll({
      where: {
          companyId: req.user.companyId,
          accountId: id,
          ...dateFilter,
      },
      include: [
          {
              model: receiveBank,
              as: "ReceiveData",
              attributes: [],
          },
          {
              model: paymentBank,
              as: "PaymentData",
              attributes: [],
          },
      ],
      attributes: [
          "companyId",
          "accountId",
          "date",
          [Sequelize.literal("IFNULL(PaymentData.amount, 0)"), "debitAmount"],
          [Sequelize.literal("IFNULL(ReceiveData.amount, 0)"), "creditAmount"],
          [
            Sequelize.literal(`
              (
                (
                  SELECT
                    IFNULL(SUM(IFNULL(ReceiveData.amount, 0) - IFNULL(PaymentData.amount, 0)), 0)
                  FROM
                    \`P_companySingleBankLedgers\` AS cl2
                    LEFT OUTER JOIN \`P_receiveBanks\` AS ReceiveData ON cl2.creditId = ReceiveData.id
                    LEFT OUTER JOIN \`P_paymentBanks\` AS PaymentData ON cl2.debitId = PaymentData.id
                  WHERE
                    cl2.companyId = :companyId
                    AND cl2.accountId = \`P_companySingleBankLedger\`.\`accountId\`
                    AND (cl2.date < \`P_companySingleBankLedger\`.\`date\` OR (cl2.date = \`P_companySingleBankLedger\`.\`date\` AND cl2.id < \`P_companySingleBankLedger\`.\`id\`))
                ) + IFNULL(ReceiveData.amount, 0) - IFNULL(PaymentData.amount, 0)
              )
            `),
            "remainingBalance",
          ],
      ],
      order: [
          ["date", "ASC"],
          ["id", "ASC"],
      ],
      replacements: { companyId:req.user.companyId }
  });


    if (data && data.length > 0) {
      return res.status(200).json({
        status: "true",
        message: "Bank Data Show Successfully",
        data: data,
      });
    } else {
      return res.status(404).json({ status: "false", message: "Bank Data Not Found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
};
