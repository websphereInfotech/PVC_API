const { Sequelize } = require("sequelize");
const C_customerLedger = require("../models/C_customerLedger");
const C_receiveCash = require("../models/C_receiveCash");
const C_salesinvoice = require("../models/C_salesinvoice");
const C_customer = require("../models/C_customer");

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

exports.C_get_customerLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;

    const quaryData = { customerId: id };

    if (formDate && toDate) {
      quaryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }
    const data = await C_customerLedger.findAll({
      attributes: [
        "customerId",
        "date",
        "id",
        [Sequelize.literal("IFNULL(receiceLedger.amount, 0)"), "debitAmount"],
        [
          Sequelize.literal("IFNULL(invoiceLedger.totalMrp, 0)"),
          "creditAmount",
        ],
        // [
        //   Sequelize.literal(`
        //       SUM(IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(receiceLedger.amount, 0)) OVER (
        //         PARTITION BY \`P_C_customerLedger\`.\`customerId\`
        //         ORDER BY \`P_C_customerLedger\`.\`date\`, \`P_C_customerLedger\`.\`id\`
        //         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
        //       )
        //     `),
        //   "runningBalance",
        // ],
        [
          Sequelize.literal(`
              (
                SELECT
                  IFNULL(SUM(IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(receiceLedger.amount, 0)), 0)
                FROM
                  \`P_C_customerLedgers\` AS cl2
                  LEFT OUTER JOIN \`P_C_salesInvoices\` AS invoiceLedger ON cl2.creditId = invoiceLedger.id
                  LEFT OUTER JOIN \`P_C_receiveCashes\` AS receiceLedger ON cl2.debitId = receiceLedger.id
                WHERE
                  cl2.customerId = \`P_C_customerLedger\`.\`customerId\`
                  AND (cl2.date < \`P_C_customerLedger\`.\`date\` OR (cl2.date = \`P_C_customerLedger\`.\`date\` AND cl2.id < \`P_C_customerLedger\`.\`id\`))
              )
            `),
          "openingBalance",
        ],
    [
      Sequelize.literal(`
      (
        SELECT
          IFNULL(SUM(IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(receiceLedger.amount, 0)), 0)
        FROM
          \`P_C_customerLedgers\` AS cl2
          LEFT OUTER JOIN \`P_C_salesInvoices\` AS invoiceLedger ON cl2.creditId = invoiceLedger.id
          LEFT OUTER JOIN \`P_C_receiveCashes\` AS receiceLedger ON cl2.debitId = receiceLedger.id
        WHERE
          cl2.customerId = \`P_C_customerLedger\`.\`customerId\`
          AND (cl2.date < \`P_C_customerLedger\`.\`date\` OR (cl2.date = \`P_C_customerLedger\`.\`date\` AND cl2.id < \`P_C_customerLedger\`.\`id\`))
      ) + IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(receiceLedger.amount, 0)
    `),
    'remainingBalance'
  ],
      ],
      include: [
        {
          model: C_salesinvoice,
          as: "invoiceLedger",
        },
        {
          model: C_receiveCash,
          as: "receiceLedger",
        },
        {
          model: C_customer,
          as:'customerData'
        }
      ],
      where: quaryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Customer Ledger Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Ledger Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
