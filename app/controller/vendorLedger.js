const { Sequelize } = require("sequelize");
const C_PaymentCash = require("../models/C_paymentCash");
const C_purchaseCash = require("../models/C_purchaseCash");
const C_vendorLedger = require("../models/C_vendorLedger");
const { Op, literal } = Sequelize;

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

 exports.C_get_vendorLedger = async (req,res) => {
    try {
        
        const {id} = req.params;
        const { formDate, toDate } = req.query;

        const quaryData = { vendorId: id };
    
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
              [Sequelize.literal("IFNULL(paymentLedger.amount, 0)"), "debitAmount"],
              [Sequelize.literal("IFNULL(invoiceLedger.totalMrp, 0)"), "creditAmount"],
              [
                Sequelize.literal(`
                  (
                    SELECT
                      IFNULL(SUM(IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(paymentLedger.amount, 0)), 0)
                    FROM
                      \`P_C_vendorLedgers\` AS cl2
                      LEFT OUTER JOIN \`P_C_purchaseCashes\` AS invoiceLedger ON cl2.creditId = invoiceLedger.id
                      LEFT OUTER JOIN \`P_C_paymentCashes\` AS paymentLedger ON cl2.debitId = paymentLedger.id
                    WHERE
                      cl2.vendorId = \`P_C_vendorLedger\`.\`vendorId\`
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
                LEFT OUTER JOIN \`P_C_purchaseCashes\` AS invoiceLedger ON cl2.creditId = invoiceLedger.id
                LEFT OUTER JOIN \`P_C_paymentCashes\` AS paymentLedger ON cl2.debitId = paymentLedger.id
              WHERE
                cl2.vendorId = \`P_C_vendorLedger\`.\`vendorId\`
                AND (cl2.date < \`P_C_vendorLedger\`.\`date\` OR (cl2.date = \`P_C_vendorLedger\`.\`date\` AND cl2.id < \`P_C_vendorLedger\`.\`id\`))
            ) + IFNULL(invoiceLedger.totalMrp, 0) - IFNULL(paymentLedger.amount, 0)
          `),
          'remainingBalance'
        ],
            ],
            include: [
              {
                model: C_purchaseCash,
                as: "invoiceLedger",
              },
              {
                model: C_PaymentCash,
                as: "paymentLedger",
              },
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
 }