const Account = require("../models/Account");
const Company = require("../models/company");
const CompanyBankDetails = require("../models/companyBankDetails");
const {Sequelize} = require("sequelize");
const Ledger = require("../models/Ledger");
const purchaseInvoice = require("../models/purchaseInvoice");
const salesInvoice = require("../models/salesInvoice");
const Receipt = require("../models/Receipt");
const Payment = require("../models/Payment");
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
                "date",
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
                    WHEN purchaseLedger.id IS NOT NULL THEN 'PURCHASE GST'
                    WHEN paymentLedger.id IS NOT NULL THEN
                        CASE
                            WHEN paymentLedger.bankAccountId IS NOT NULL THEN \`paymentLedger->paymentBankAccount\`.\`bankname\`
                            ELSE \`paymentLedger\`.\`transactionType\`
                        END
                    WHEN receiptLedger.id IS NOT NULL THEN
                        CASE
                            WHEN receiptLedger.bankAccountId IS NOT NULL THEN \`receiptLedger->receiptBankAccount\`.\`bankname\`
                            ELSE \`receiptLedger\`.\`transactionType\`
                        END
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
                      LEFT OUTER JOIN \`P_Payments\` AS paymentLedger ON cl2.paymentId = paymentLedger.id
                      LEFT OUTER JOIN \`P_purchaseInvoices\` AS purchaseLedger ON cl2.purchaseInvId = purchaseLedger.id
                      LEFT OUTER JOIN \`P_Receipts\` AS receiptLedger ON cl2.receiptId = receiptLedger.id
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
                    attributes: []
                },
                {
                    model: Payment,
                    as: "paymentLedger",
                    include: {model: CompanyBankDetails, as: "paymentBankAccount", attributes: []},
                    attributes: []
                },
                {
                    model: salesInvoice,
                    as: "salesLedger",
                    attributes: []
                },
                {
                    model: Receipt,
                    as: "receiptLedger",
                    include: {model: CompanyBankDetails, as: "receiptBankAccount", attributes: []},
                    attributes: []
                },
                {
                    model: Account,
                    as: "accountLedger",
                    attributes: []
                },
            ],
            where: queryData,
            order: [
                ["date", "ASC"],
                ["id", "ASC"],
            ],
        });
        const openingBalance = data[0]?.dataValues?.openingBalance ?? 0;
        const ledgerArray = [...data];
        console.log(+openingBalance !== 0, "Open")
        if(+openingBalance !== 0){
            ledgerArray.unshift({
                "date": formDate,
                "debitAmount": openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
                "creditAmount": openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
                "particulars": "Opening Balance",
                "vchType": "",
                "vchNo": "",
                "openingBalance": 0
            })
        }
        console.log(openingBalance, "Opeing balance")
        const totals = ledgerArray.reduce((acc, ledger) => {
            if (ledger.dataValues) {
                acc.totalCredit += ledger.dataValues.creditAmount || 0;
                acc.totalDebit += ledger.dataValues.debitAmount || 0;
            } else {
                acc.totalCredit += ledger.creditAmount || 0;
                acc.totalDebit += ledger.debitAmount || 0;
            }
            return acc;
        }, { totalCredit: 0, totalDebit: 0 });

        const totalCredit = totals.totalCredit;
        const totalDebit = totals.totalDebit;

        const closingBalanceAmount = totalDebit -totalCredit;
        const closingBalance = {
            type: closingBalanceAmount < 0 ? "debit": 'credit',
            amount: +Math.abs(closingBalanceAmount).toFixed(2),
        }

        const records = ledgerArray.reduce((acc, obj) => {
            const dateKey = obj.date;
            const date = new Date(dateKey);
            const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${String(date.getFullYear()).slice(-2)}`;

            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(obj);
            return acc;
        }, {});
        return res.status(200).json({
            status: "true",
            message: "Vendor Ledger Data Fetch Successfully",
            data: {ledgerArray, total: {totalCredit, totalDebit}, closingBalance, records},
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}