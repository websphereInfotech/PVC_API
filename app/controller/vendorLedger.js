const { Sequelize } = require("sequelize");
const C_PaymentCash = require("../models/C_paymentCash");
const C_purchaseCash = require("../models/C_purchaseCash");
const C_vendorLedger = require("../models/C_vendorLedger");
const C_vendor = require("../models/C_vendor");
const vendorLedger = require("../models/vendorLedger");
const purchaseInvoice = require("../models/purchaseInvoice");
const paymentBank = require("../models/paymentBank");
const vendor = require("../models/vendor");
const { Op, literal } = Sequelize;

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

exports.C_get_vendorLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;

    const quaryData = { vendorId: id };
    const companyId = req.user.companyId;

    if (companyId) {
      quaryData.companyId = companyId;
    }

    if (formDate && toDate) {
      quaryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }
    // const data = await C_vendorLedger.findAll({ where:{vendorId: id}, include:[{ model:C_PaymentCash, as:'paymentLedger'} ,{model: C_purchaseCash, as:'invoiceLedger'}]})
    const data = await C_vendorLedger.findAll({
      attributes: [
        "vendorId",
        "date",
        "id",
        // [Sequelize.literal("IFNULL(invoiceLedger.totalMrp, 0)"), "debitAmount"],
        // [
        //   Sequelize.literal("IFNULL(paymentLedger.amount, 0)"),
        //   "creditAmount",
        // ],
        // [
        //   Sequelize.literal(`
        //           (
        //             SELECT
        //               IFNULL(SUM(IFNULL(paymentLedger.amount, 0) - IFNULL(invoiceLedger.totalMrp, 0)), 0)
        //             FROM
        //               \`P_C_vendorLedgers\` AS cl2
        //               LEFT OUTER JOIN \`P_C_purchaseCashes\` AS invoiceLedger ON cl2.debitId = invoiceLedger.id
        //               LEFT OUTER JOIN \`P_C_paymentCashes\` AS paymentLedger ON cl2.creditId = paymentLedger.id
        //             WHERE
        //               cl2.vendorId = \`P_C_vendorLedger\`.\`vendorId\`
        //               AND cl2.companyId = :companyId
        //               AND (cl2.date < \`P_C_vendorLedger\`.\`date\` OR (cl2.date = \`P_C_vendorLedger\`.\`date\` AND cl2.id < \`P_C_vendorLedger\`.\`id\`))
        //           )
        //         `),
        //   "openingBalance",
        // ],
        // [
        //   Sequelize.literal(`
        //     (
        //       SELECT
        //         IFNULL(SUM(IFNULL(paymentLedger.amount, 0) - IFNULL(invoiceLedger.totalMrp, 0)), 0)
        //       FROM
        //         \`P_C_vendorLedgers\` AS cl2
        //         LEFT OUTER JOIN \`P_C_purchaseCashes\` AS invoiceLedger ON cl2.debitId = invoiceLedger.id
        //         LEFT OUTER JOIN \`P_C_paymentCashes\` AS paymentLedger ON cl2.creditId = paymentLedger.id
        //       WHERE
        //         cl2.vendorId = \`P_C_vendorLedger\`.\`vendorId\`
        //         AND cl2.companyId = :companyId
        //         AND (cl2.date < \`P_C_vendorLedger\`.\`date\` OR (cl2.date = \`P_C_vendorLedger\`.\`date\` AND cl2.id < \`P_C_vendorLedger\`.\`id\`))
        //     ) + IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(paymentLedger.amount, 0)
        //   `),
        //   "remainingBalance",
        // ],
          [Sequelize.literal("IFNULL(invoiceLedger.totalMrp, 0)"), "creditAmount"],
        [
          Sequelize.literal("IFNULL(paymentLedger.amount, 0)"),
          "debitAmount",
        ],
        [
          Sequelize.literal(`
                (
                  SELECT
                    IFNULL(SUM(IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(paymentLedger.amount, 0)), 0)
                  FROM
                    \`P_C_vendorLedgers\` AS cl2
                    LEFT OUTER JOIN \`P_C_purchaseCashes\` AS invoiceLedger ON cl2.debitId = invoiceLedger.id
                    LEFT OUTER JOIN \`P_C_paymentCashes\` AS paymentLedger ON cl2.creditId = paymentLedger.id
                  WHERE
                    cl2.companyId = :companyId
                    AND (cl2.date < \`P_C_vendorLedger\`.\`date\` OR (cl2.date = \`P_C_vendorLedger\`.\`date\` AND cl2.id < \`P_C_vendorLedger\`.\`id\`))
                )
              `),
          "openingBalance",
        ],
        [
          Sequelize.literal(`
              (
                SELECT
                  IFNULL(SUM(IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(paymentLedger.amount, 0)), 0)
                FROM
                  \`P_C_vendorLedgers\` AS cl2
                  LEFT OUTER JOIN \`P_C_purchaseCashes\` AS invoiceLedger ON cl2.debitId = invoiceLedger.id
                  LEFT OUTER JOIN \`P_C_paymentCashes\` AS paymentLedger ON cl2.creditId = paymentLedger.id
                WHERE
                  cl2.companyId = :companyId
                  AND (cl2.date < \`P_C_vendorLedger\`.\`date\` OR (cl2.date = \`P_C_vendorLedger\`.\`date\` AND cl2.id < \`P_C_vendorLedger\`.\`id\`))
              ) + IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(paymentLedger.amount, 0)
            `),
          "remainingBalance",
        ],
      ],
      include: [
        {
          model: C_purchaseCash,
          as: "invoiceLedger",
          attributes:[],
        },
        {
          model: C_PaymentCash,
          as: "paymentLedger",
          attributes:[],
        },
        {
          model: C_vendor,
          as: "vendorData",
        },
      ],
      where: quaryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
      replacements: { companyId },
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Vendor Ledger Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Ledger Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
/*=============================================================================================================
                                          without Typc C API
 ============================================================================================================ */
exports.get_vendorLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;

    const queryData = { vendorId: id };
    const companyId = req.user.companyId;

    if (companyId) {
      queryData.companyId = companyId;
    }

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }
// const data = await vendorLedger.findAll({
//   where: {vendorId:id},include: [
//         {
//           model: purchaseInvoice,
//           as: "paymentVendor",
//         },
//         {
//           model: paymentBank,
//           as: "invoiceVendor",
//         },
//         {
//           model: vendor,
//           as: "vendorData",
//         },
//       ]
// })
    const data = await vendorLedger.findAll({
      attributes: [
        "vendorId",
        "date",
        "id",
        [Sequelize.literal("IFNULL(invoiceVendor.mainTotal, 0)"), "creditAmount"],
        [
          Sequelize.literal("IFNULL(paymentVendor.amount, 0)"),
          "debitAmount",
        ],
        [
          Sequelize.literal(`
                (
                  SELECT
                    IFNULL(SUM(IFNULL(invoiceVendor.mainTotal, 0) - IFNULL(paymentVendor.amount, 0)), 0)
                  FROM
                    \`P_vendorLedgers\` AS cl2
                    LEFT OUTER JOIN \`P_purchaseInvoices\` AS invoiceVendor ON cl2.debitId = invoiceVendor.id
                    LEFT OUTER JOIN \`P_paymentBanks\` AS paymentVendor ON cl2.creditId = paymentVendor.id
                  WHERE
                    cl2.companyId = :companyId
                    AND (cl2.date < \`P_vendorLedger\`.\`date\` OR (cl2.date = \`P_vendorLedger\`.\`date\` AND cl2.id < \`P_vendorLedger\`.\`id\`))
                )
              `),
          "openingBalance",
        ],
        [
          Sequelize.literal(`
              (
                SELECT
                  IFNULL(SUM(IFNULL(invoiceVendor.mainTotal, 0) - IFNULL(paymentVendor.amount, 0)), 0)
                FROM
                  \`P_vendorLedgers\` AS cl2
                  LEFT OUTER JOIN \`P_purchaseInvoices\` AS invoiceVendor ON cl2.debitId = invoiceVendor.id
                  LEFT OUTER JOIN \`P_paymentBanks\` AS paymentVendor ON cl2.creditId = paymentVendor.id
                WHERE
                  cl2.companyId = :companyId
                  AND (cl2.date < \`P_vendorLedger\`.\`date\` OR (cl2.date = \`P_vendorLedger\`.\`date\` AND cl2.id < \`P_vendorLedger\`.\`id\`))
              ) + IFNULL(invoiceVendor.mainTotal, 0) - IFNULL(paymentVendor.amount, 0)
            `),
          "remainingBalance",
        ],
      ],
      include: [
        {
          model: purchaseInvoice,
          as: "invoiceVendor",
          attributes:[]
        },
        {
          model: paymentBank,
          as: "paymentVendor",
          attributes:[]
        },
        {
          model: vendor,
          as: "vendorData",
        },
      ],
      where: queryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
      replacements: { companyId },
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Vendor Ledger Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Ledger Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

// exports.get_vendorLedger = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { formDate, toDate } = req.query;

//     const quaryData = { vendorId: id };
//     const companyId = req.user.companyId;

//     if (companyId) {
//       quaryData.companyId = companyId;
//     }

//     if (formDate && toDate) {
//       quaryData.date = {
//         [Sequelize.Op.between]: [formDate, toDate],
//       };
//     }

//     const data = await vendorLedger.findAll({
//       attributes: [
//         "vendorId",
//         "date",
//         "id",
//         [Sequelize.literal("IFNULL(paymentVendor.amount, 0)"), "debitAmount"],
//         [
//           Sequelize.literal("IFNULL(invoiceVendor.totalMrp, 0)"),
//           "creditAmount",
//         ],
//         [
//           Sequelize.literal(`
//                 (
//                   SELECT
//                     IFNULL(SUM(IFNULL(invoiceVendor.totalMrp, 0) - IFNULL(paymentVendor.amount, 0)), 0)
//                   FROM
//                     \`P_vendorLedgers\` AS cl2
//                     LEFT OUTER JOIN \`P_purchaseInvoices\` AS invoiceVendor ON cl2.creditId = invoiceVendor.id
//                     LEFT OUTER JOIN \`P_paymentBanks\` AS paymentVendor ON cl2.debitId = paymentVendor.id
//                   WHERE
//                     cl2.vendorId = \`P_vendorLedger\`.\`vendorId\`
//                     AND (cl2.date < \`P_vendorLedger\`.\`date\` OR (cl2.date = \`P_vendorLedger\`.\`date\` AND cl2.id < \`P_vendorLedger\`.\`id\`))
//                 )
//               `),
//           "openingBalance",
//         ],
//         [
//           Sequelize.literal(`
//           (
//             SELECT
//               IFNULL(SUM(IFNULL(invoiceVendor.totalMrp, 0) - IFNULL(paymentVendor.amount, 0)), 0)
//             FROM
//               \`P_vendorLedgers\` AS cl2
//               LEFT OUTER JOIN \`P_purchaseInvoices\` AS invoiceVendor ON cl2.creditId = invoiceVendor.id
//               LEFT OUTER JOIN \`P_paymentBanks\` AS paymentVendor ON cl2.debitId = paymentVendor.id
//             WHERE
//               cl2.vendorId = \`P_vendorLedger\`.\`vendorId\`
//               AND (cl2.date < \`P_vendorLedger\`.\`date\` OR (cl2.date = \`P_vendorLedger\`.\`date\` AND cl2.id < \`P_vendorLedger\`.\`id\`))
//           ) + IFNULL(invoiceVendor.totalMrp, 0) - IFNULL(paymentVendor.amount, 0)
//         `),
//           "remainingBalance",
//         ],
//       ],
//       include: [
//         {
//           model: purchaseInvoice,
//           as: "invoiceVendor",
//         },
//         {
//           model: paymentBank,
//           as: "paymentVendor",
//         },
//         {
//           model: vendor,
//           as: "vendorData",
//         },
//       ],
//       where: quaryData,
//       order: [
//         ["date", "ASC"],
//         ["id", "ASC"],
//       ],
//     });

//     if (data) {
//       return res.status(200).json({
//         status: "true",
//         message: "Vendor Ledger Data Fetch Successfully",
//         data: data,
//       });
//     } else {
//       return res
//         .status(404)
//         .json({ status: "false", message: "Vendor Ledger Not Found" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: "false", message: "Internal Server Error" });
//   }
// };
