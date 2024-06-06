const { Sequelize } = require("sequelize");
const company = require("../models/company");
const companyBankDetails = require("../models/companyBankDetails");
const companyBankLedger = require("../models/companyBankLedger");
const paymentBank = require("../models/paymentBank");
const receiveBank = require("../models/receiveBank");

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

    const data = await companyBankDetails.destroy({ where: { id } });

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

    const data = await companyBankDetails.findOne({ where: { id } });
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
    const data = await companyBankDetails.findAll();
    if (data.length > 0) {
      return res.status(200).json({
        status: "true",
        message: "Bank Details Show successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Bank Details Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
// exports.view_company_bankLedger = async (req, res) => {
//   try {
//     const data = await companyBankLedger.findAll({
//       where: { companyId: req.user.companyId },
//       include: [
//         {
//           model: receiveBank,
//           as: 'receiveData',
//           attributes: []
//         },
//         {
//           model: paymentBank,
//           as: 'paymentdata',
//           attributes: []
//         }
//       ],
//       attributes: {
//         include: [
//           [Sequelize.literal("IFNULL(paymentdata.amount, 0)"), "debitAmount"],
//           [Sequelize.literal("IFNULL(receiveData.amount, 0)"), "creditAmount"],
//          [
//             Sequelize.literal(`(
//               SELECT IFNULL(SUM(r.amount) - SUM(p.amount), 0)
//               FROM P_companyBankLedgers AS cbl
//               LEFT JOIN P_receiveBanks AS r ON cbl.creditId = r.id
//               LEFT JOIN P_paymentBanks AS p ON cbl.debitId = p.id
//               WHERE cbl.companyId = P_companyBankLedger.companyId
//               AND (cbl.date < P_companyBankLedger.date OR (cbl.date = P_companyBankLedger.date AND cbl.id < P_companyBankLedger.id))
//             )`), 
//             "openingBalance"
//           ],
//           [
//             Sequelize.literal(`
//               IFNULL(
//                 (
//                   SELECT IFNULL(MAX(remainingBalance), 0) 
//                   FROM (
//                     SELECT 
//                       IFNULL(SUM(r.amount) - SUM(p.amount), 0) + IFNULL(receiveData.amount, 0) - IFNULL(paymentdata.amount, 0) AS remainingBalance
//                     FROM P_companyBankLedgers AS cbl
//                     LEFT JOIN P_receiveBanks AS r ON cbl.creditId = r.id
//                     LEFT JOIN P_paymentBanks AS p ON cbl.debitId = p.id
//                     WHERE cbl.companyId = P_companyBankLedger.companyId
//                     AND (cbl.date < P_companyBankLedger.date OR (cbl.date = P_companyBankLedger.date AND cbl.id <= P_companyBankLedger.id))
//                   ) AS subquery
//                   WHERE subquery.id < P_companyBankLedger.id
//                 ), 
//                 0
//               )
//             `),
//             "remainingBalance"
//           ],
                             
//         ]
//       },
//       order: [['date', 'ASC'], ['id', 'ASC']]
//     });
//     if (data) {
//       return res.status(200).json({ status: 'true', message: 'Bank Data Show Successfully', data: data });
//     } else {
//       return res.status(404).json({ status: 'false', message: 'Bank Data Not Found' });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ status: 'false', message: 'Internal Server Error' });
//   }
// };

exports.view_company_bankLedger = async (req, res) => {
  try {
    const {fromDate , toDate } = req.query;

    let whereData = {
      companyId: req.user.companyId
    };

    if (fromDate && toDate) {
      whereData.date = {
        [Sequelize.Op.between]: [fromDate, toDate]
      };
    }
    const data = await companyBankLedger.findAll({
      where: whereData,
      include: [
        {
          model: receiveBank,
          as: 'receiveData',
          attributes: []
        },
        {
          model: paymentBank,
          as: 'paymentdata',
          attributes: []
        }
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
            "openingBalance"
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
            "remainingBalance"
          ],
        ]
      },
      order: [['date', 'ASC'], ['id', 'ASC']]
    });
    if (data) {
      return res.status(200).json({ status: 'true', message: 'Bank Data Show Successfully', data: data });
    } else {
      return res.status(404).json({ status: 'false', message: 'Bank Data Not Found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'false', message: 'Internal Server Error' });
  }
};

