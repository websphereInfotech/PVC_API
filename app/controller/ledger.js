const Account = require("../models/Account");
const Company = require("../models/company");
const {Sequelize} = require("sequelize");
const Ledger = require("../models/Ledger");
const purchaseInvoice = require("../models/purchaseInvoice");
const salesInvoice = require("../models/salesInvoice");
const receiveBank = require("../models/receiveBank");
const paymentBank = require("../models/paymentBank");
exports.normal_ledger = async (req, res) => {
    try {
        const { id } = req.params;
        const { formDate, toDate } = req.query;
        console.log(req.query,"query")
        const companyId = req.user.companyId;
        const accountExist = await Account.findOne({ where: { id, companyId } });
        if(!accountExist){
            return res.status(404).json({
                status: "false",
                message: "Account Not Found."
            })
        }

        const queryData = { accountId: id };

        if (companyId) {
            queryData.companyId = companyId;
        }

        if (formDate && toDate) {
            queryData.date = {
                [Sequelize.Op.between]: [formDate, toDate],
            };
        }
        const data = await Ledger.findAll({
            attributes: [
                "accountId",
                "date",
                "id",
                "purchaseInvId",
                "saleInvId",
                "paymentId",
                "receiptId",
                "companyId",
                [Sequelize.literal(`CASE
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`amount\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`mainTotal\`
                    ELSE 0
                END`), "debitAmount"],
                [Sequelize.literal(`CASE
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`amount\`
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`mainTotal\`
                    ELSE 0
                END`), "creditAmount"],
                [
                    Sequelize.literal(`CASE
                    WHEN salesLedger.id IS NOT NULL THEN 'SALES GST'
                    ELSE ''
                  END`), "particulars"],
                [Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN salesLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN receiptLedger.id IS NOT NULL THEN 'Receipt'
                    WHEN paymentLedger.id IS NOT NULL THEN 'Payment'
                    ELSE ''
                  END`), "vchType"
                ],
                [Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`voucherno\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`invoiceno\`
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`voucherno\`
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`voucherno\`
                    ELSE ''
                  END`),
                    "vchNo"
                ],
                [Sequelize.literal(`
                  (
                    SELECT
                      IFNULL(SUM(
                        IFNULL(CASE
                          WHEN receiptLedger.id IS NOT NULL THEN receiptLedger.amount
                          WHEN purchaseLedger.id IS NOT NULL THEN purchaseLedger.mainTotal
                          ELSE 0
                        END, 0) -
                        IFNULL(CASE
                          WHEN paymentLedger.id IS NOT NULL THEN paymentLedger.amount
                          WHEN salesLedger.id IS NOT NULL THEN salesLedger.mainTotal
                          ELSE 0
                        END, 0)
                      ), 0)
                    FROM
                      \`P_Ledgers\` AS cl2
                      LEFT OUTER JOIN \`P_paymentBanks\` AS paymentLedger ON cl2.paymentId = paymentLedger.id
                      LEFT OUTER JOIN \`P_purchaseInvoices\` AS purchaseLedger ON cl2.purchaseInvId = purchaseLedger.id
                      LEFT OUTER JOIN \`P_receiveBanks\` AS receiptLedger ON cl2.receiptId = receiptLedger.id
                      LEFT OUTER JOIN \`P_salesInvoices\` AS salesLedger ON cl2.saleInvId = salesLedger.id
                    WHERE
                      cl2.accountId = \`P_Ledger\`.\`accountId\`
                      AND cl2.companyId = ${companyId}
                      AND (cl2.date < \`P_Ledger\`.\`date\` OR (cl2.date = \`P_Ledger\`.\`date\` AND cl2.id < \`P_Ledger\`.\`id\`))
                  )`), 'openingBalance']
            ],
            include: [
                {
                    model: purchaseInvoice,
                    as: "purchaseLedger",
                },
                {
                    model: paymentBank,
                    as: "paymentLedger",
                },
                {
                    model: salesInvoice,
                    as: "salesLedger",
                },
                {
                    model: receiveBank,
                    as: "receiptLedger",
                },
                {
                    model: Account,
                    as: "accountLedger",
                },
            ],
            where: queryData,
            order: [
                ["date", "ASC"],
                ["id", "ASC"],
            ],
        });
        return res.status(200).json({
            status: "true",
            message: "Vendor Ledger Data Fetch Successfully",
            data: data,
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}