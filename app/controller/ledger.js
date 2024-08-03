const Account = require("../models/Account");
const CompanyBankDetails = require("../models/companyBankDetails");
const Company = require("../models/company");
const {Sequelize} = require("sequelize");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const purchaseInvoice = require("../models/purchaseInvoice");
const C_PurchaseCash = require("../models/C_purchaseCash");
const salesInvoice = require("../models/salesInvoice");
const C_Salesinvoice = require("../models/C_salesinvoice");
const Receipt = require("../models/Receipt");
const C_Receipt = require("../models/C_Receipt");
const Payment = require("../models/Payment");
const C_Payment = require("../models/C_Payment");
exports.normal_ledger = async (req, res) => {
    try {
        const { id } = req.params;
        const { formDate, toDate } = req.query;
        const companyId = req.user.companyId;
        const accountExist = await Account.findOne({ where: { id, companyId, isActive: true } });
        if(!accountExist){
            return res.status(404).json({
                status: "false",
                message: "Account Not Found."
            })
        }

        const company = await Company.findByPk(companyId);


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
        const formattedFromDate = new Date(formDate);
        const formattedToDate = new Date(toDate);

        const formDateFormat = `${formattedFromDate.getDate()}-${formattedFromDate.toLocaleString('default', { month: 'short' })}-${String(formattedFromDate.getFullYear()).slice(-2)}`;
        const toDateFormat = `${formattedToDate.getDate()}-${formattedToDate.toLocaleString('default', { month: 'short' })}-${String(formattedToDate.getFullYear()).slice(-2)}`;
        return res.status(200).json({
            status: "true",
            message: "Ledger Data Fetch Successfully",
            data: {form: company,to: accountExist, dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records},
        });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
}


exports.C_normal_ledger = async (req, res)=>{
    try {
        const { id } = req.params;
        const { formDate, toDate } = req.query;
        const companyId = req.user.companyId;
        const queryData = { accountId: id, companyId: companyId };

        const accountExist = await Account.findOne({ where: { id, companyId, isActive: true } });
        if(!accountExist){
            return res.status(404).json({
                status: "false",
                message: "Account Not Found."
            })
        }

        const company = await Company.findByPk(companyId);


        if (formDate && toDate) {
            queryData.date = {
                [Sequelize.Op.between]: [formDate, toDate],
            };
        }

        const data = await C_Ledger.findAll({
            where: queryData,
            attributes: [
                "date",
                "id",
                "accountId",
                "companyId",
                "purchaseId",
                "saleId",
                "paymentId",
                "receiptId",
                [Sequelize.literal(`CASE
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`amount\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`totalMrp\`
            ELSE 0
        END`), "debitAmount"],
                [Sequelize.literal(`CASE
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`amount\`
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`totalMrp\`
            ELSE 0
        END`), "creditAmount"],
                [Sequelize.literal(`CASE
            WHEN salesLedgerCash.id IS NOT NULL THEN 'SALES CASH'
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'PURCHASE CASH'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'CASH'
            ELSE ''
        END`), "particulars"],
                [Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN salesLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'Receipt'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'Payment'
            ELSE ''
        END`), "vchType"],
        [Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`purchaseNo\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`saleNo\`
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`receiptNo\`
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`paymentNo\`
            ELSE ''
        END`), "vchNo"],
        [Sequelize.literal(`
          (
            SELECT
              IFNULL(SUM(
                IFNULL(CASE
                  WHEN receiptLedgerCash.id IS NOT NULL THEN receiptLedgerCash.amount
                  WHEN purchaseLedgerCash.id IS NOT NULL THEN purchaseLedgerCash.totalMrp
                  ELSE 0
                END, 0) -
                IFNULL(CASE
                  WHEN paymentLedgerCash.id IS NOT NULL THEN paymentLedgerCash.amount
                  WHEN salesLedgerCash.id IS NOT NULL THEN salesLedgerCash.totalMrp
                  ELSE 0
                END, 0)
              ), 0)
            FROM
              \`P_C_Ledgers\` AS cl2
              LEFT OUTER JOIN \`P_C_Payments\` AS paymentLedgerCash ON cl2.paymentId = paymentLedgerCash.id
              LEFT OUTER JOIN \`P_C_purchaseCashes\` AS purchaseLedgerCash ON cl2.purchaseId = purchaseLedgerCash.id
              LEFT OUTER JOIN \`P_C_Receipts\` AS receiptLedgerCash ON cl2.receiptId = receiptLedgerCash.id
              LEFT OUTER JOIN \`P_C_salesInvoices\` AS salesLedgerCash ON cl2.saleId = salesLedgerCash.id
            WHERE
              cl2.accountId = \`P_C_Ledger\`.\`accountId\`
              AND cl2.companyId = ${companyId}
              AND (cl2.date < \`P_C_Ledger\`.\`date\` OR (cl2.date = \`P_C_Ledger\`.\`date\` AND cl2.id < \`P_C_Ledger\`.\`id\`))
          )`), 'openingBalance']
            ],
            include: [
                {
                    model: C_PurchaseCash,
                    as: "purchaseLedgerCash",
                },
                {
                    model: C_Payment,
                    as: "paymentLedgerCash",
                },
                {
                    model: C_Salesinvoice,
                    as: "salesLedgerCash",
                },
                {
                    model: C_Receipt,
                    as: "receiptLedgerCash",
                },
                {
                    model: Account,
                    as: "accountLedgerCash",
                },
            ],
            order: [
                ["date", "ASC"],
                ["id", "ASC"],
            ],
        });

        const openingBalance = data[0]?.dataValues?.openingBalance ?? 0;

        const cashLedgerArray = [...data];
        if(+openingBalance !== 0){
            cashLedgerArray.unshift({
                "date": formDate,
                "debitAmount": openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
                "creditAmount": openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
                "particulars": "Opening Balance",
                "vchType": "",
                "vchNo": "",
                "openingBalance": 0
            })
        }

        const totals = cashLedgerArray.reduce((acc, ledger) => {
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
        const records = cashLedgerArray.reduce((acc, obj) => {
            const dateKey = obj.date;
            const date = new Date(dateKey);
            const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${String(date.getFullYear()).slice(-2)}`;

            if (!acc[formattedDate]) {
                acc[formattedDate] = [];
            }
            acc[formattedDate].push(obj);
            return acc;
        }, {});
        const formattedFromDate = new Date(formDate);
        const formattedToDate = new Date(toDate);

        const formDateFormat = `${formattedFromDate.getDate()}-${formattedFromDate.toLocaleString('default', { month: 'short' })}-${String(formattedFromDate.getFullYear()).slice(-2)}`;
        const toDateFormat = `${formattedToDate.getDate()}-${formattedToDate.toLocaleString('default', { month: 'short' })}-${String(formattedToDate.getFullYear()).slice(-2)}`;


        return res.status(200).json({status: "true", message: "Cash Ledger Dta Fetch Successfully.", data: {form: company,to: accountExist, dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records}})
    }catch (e) {
        console.log(e);
        return res.status(500).json({status: "false", message: "Internal Server Error."})
    }
}