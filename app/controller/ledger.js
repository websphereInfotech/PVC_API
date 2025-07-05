const Account = require("../models/Account");
const CompanyBankDetails = require("../models/companyBankDetails");
const Company = require("../models/company");
const { Sequelize, Op } = require("sequelize");
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
const User = require("../models/user");
const C_WalletLedger = require("../models/C_WalletLedger");
const C_Claim = require("../models/C_claim");
const C_Cashbook = require("../models/C_Cashbook");
const CreditNote = require("../models/creditNote");
const DebitNote = require("../models/debitNote");
const C_CreditNote = require("../models/C_CreditNote");
const C_DebitNote = require("../models/C_DebitNote");
const htmlToPdf = require("html-pdf-node");
const { renderFile } = require("ejs");
const path = require("node:path");
const AccountDetails = require("../models/AccountDetail");
const { ROLE } = require("../constant/constant");
const BankLedger = require("../models/BankLedger");
const { Workbook } = require("exceljs");
const C_salesinvoice = require("../models/C_salesinvoice");
const puppeteer = require("puppeteer");

exports.account_ledger = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const accountExist = await Account.findOne({
      where: { id, companyId, isActive: true },
      include: [{model: AccountDetails, as: "accountDetail"}]
    });
    if (!accountExist) {
      return res.status(404).json({
        status: "false",
        message: "Account Not Found.",
      });
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
        [
          Sequelize.literal(`CASE
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`amount\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`mainTotal\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`amount\`
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`mainTotal\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN salesLedger.id IS NOT NULL THEN 'SALES GST'
                    WHEN purchaseLedger.id IS NOT NULL THEN 'PURCHASE GST'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'SALES'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'PURCHASE'
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
                  END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN salesLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN receiptLedger.id IS NOT NULL THEN 'Receipt'
                    WHEN paymentLedger.id IS NOT NULL THEN 'Payment'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'DEBIT NOTE'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'CREDIT NOTE'
                    ELSE ''
                  END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`voucherno\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`invoiceno\`
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`voucherno\`
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`voucherno\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`creditnoteNo\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`debitnoteno\`
                    ELSE ''
                  END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
                  (
                    SELECT
                      IFNULL(SUM(
                        IFNULL(CASE
                          WHEN receiptLedger.id IS NOT NULL THEN receiptLedger.amount
                          WHEN purchaseLedger.id IS NOT NULL THEN purchaseLedger.mainTotal
                          WHEN creditNoLedger.id IS NOT NULL THEN creditNoLedger.mainTotal
                          ELSE 0
                        END, 0) -
                        IFNULL(CASE
                          WHEN paymentLedger.id IS NOT NULL THEN paymentLedger.amount
                          WHEN salesLedger.id IS NOT NULL THEN salesLedger.mainTotal
                          WHEN debitNoLedger.id IS NOT NULL THEN debitNoLedger.mainTotal
                          ELSE 0
                        END, 0)
                      ), 0)
                    FROM
                      \`P_Ledgers\` AS cl2
                      LEFT OUTER JOIN \`P_Payments\` AS paymentLedger ON cl2.paymentId = paymentLedger.id
                      LEFT OUTER JOIN \`P_purchaseInvoices\` AS purchaseLedger ON cl2.purchaseInvId = purchaseLedger.id
                      LEFT OUTER JOIN \`P_Receipts\` AS receiptLedger ON cl2.receiptId = receiptLedger.id
                      LEFT OUTER JOIN \`P_salesInvoices\` AS salesLedger ON cl2.saleInvId = salesLedger.id
                      LEFT OUTER JOIN \`P_creditNotes\` AS creditNoLedger ON cl2.creditNoId = creditNoLedger.id
                      LEFT OUTER JOIN \`P_debitNotes\` AS debitNoLedger ON cl2.debitNoId = debitNoLedger.id
                    WHERE
                      cl2.accountId = \`P_Ledger\`.\`accountId\`
                      AND cl2.companyId = ${companyId}
                      AND (cl2.date < \`P_Ledger\`.\`date\` OR (cl2.date = \`P_Ledger\`.\`date\` AND cl2.id < \`P_Ledger\`.\`id\`))
                  )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: purchaseInvoice,
          as: "purchaseLedger",
          attributes: [],
        },
        {
          model: Payment,
          as: "paymentLedger",
          include: {
            model: CompanyBankDetails,
            as: "paymentBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: salesInvoice,
          as: "salesLedger",
          attributes: [],
        },
        {
          model: Receipt,
          as: "receiptLedger",
          include: {
            model: CompanyBankDetails,
            as: "receiptBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedger",
          attributes: [],
        },
        {
          model: CreditNote,
          as: "creditNoLedger",
          attributes: [],
        },
        {
          model: DebitNote,
          as: "debitNoLedger",
          attributes: [],
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
    if (+openingBalance !== 0) {
      ledgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }
    const groupedRecords = {};
    const fromFinancialYear = getFinancialYear(formDate);
    const toFinancialYear = getFinancialYear(toDate);

    let currentFinancialYear = fromFinancialYear;

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    while (currentFinancialYear <= toFinancialYear) {
      const [startYear, endYear] = currentFinancialYear.split("-").map(Number);
      const filteredRecords = filterRecordsByFinancialYear(
        ledgerArray,
        startYear,
        endYear
      );
      const newOpeningBalance = previousClosingBalance.amount;

      if (newOpeningBalance > 0) {
        filteredRecords.unshift({
          date: `${startYear}-04-01`,
          debitAmount:
            previousClosingBalance.type === "credit" ? newOpeningBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? newOpeningBalance : 0,
          particulars: "Opening Balance",
          vchType: "",
          vchNo: "",
        });
      }

      const totals = filteredRecords.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;

      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const records = filteredRecords.reduce((acc, obj) => {
        const dateKey = obj.date;
        const date = new Date(dateKey);
        const formattedDate = `${date.getDate()}-${date.toLocaleString(
          "default",
          {
            month: "short",
          }
        )}-${String(date.getFullYear()).slice(-2)}`;

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(obj);
        return acc;
      }, {});

      const daterang = getFinancialYearDates(
        startYear,
        endYear,
        formDate,
        toDate
      );
      groupedRecords[currentFinancialYear] = {
        dateRange: daterang,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records,
      };
      currentFinancialYear = `${startYear + 1}-${endYear + 1}`;
    }
    return res.status(200).json({
      status: "true",
      message: "Ledger Data Fetch Successfully",
      data: { form: company, to: accountExist, years: groupedRecords },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_account_ledger = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const queryData = { accountId: id, companyId: companyId };

    const accountExist = await Account.findOne({
      where: { id, companyId, isActive: true },
    });
    if (!accountExist) {
      return res.status(404).json({
        status: "false",
        message: "Account Not Found.",
      });
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
        [
          Sequelize.literal(`CASE
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`amount\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`totalMrp\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`amount\`
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`totalMrp\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN salesLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN creditNoLedgerCash.id IS NOT NULL THEN 'SALES'
            WHEN debitNoLedgerCash.id IS NOT NULL THEN 'PURCHASE'
            ELSE ''
        END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'PURCHASE'
            WHEN salesLedgerCash.id IS NOT NULL THEN 'SALES'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'Receipt'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'Payment'
             WHEN creditNoLedgerCash.id IS NOT NULL THEN 'CREDIT NOTE'
            WHEN debitNoLedgerCash.id IS NOT NULL THEN 'DEBIT NOTE'
            ELSE ''
        END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`purchaseNo\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`saleNo\`
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`receiptNo\`
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`paymentNo\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`creditnoteNo\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`debitnoteno\`
            ELSE ''
        END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
          (
            SELECT
              IFNULL(SUM(
                IFNULL(CASE
                  WHEN receiptLedgerCash.id IS NOT NULL THEN receiptLedgerCash.amount
                  WHEN purchaseLedgerCash.id IS NOT NULL THEN purchaseLedgerCash.totalMrp
                  WHEN creditNoLedgerCash.id IS NOT NULL THEN creditNoLedgerCash.mainTotal
                  ELSE 0
                END, 0) -
                IFNULL(CASE
                  WHEN paymentLedgerCash.id IS NOT NULL THEN paymentLedgerCash.amount
                  WHEN salesLedgerCash.id IS NOT NULL THEN salesLedgerCash.totalMrp
                  WHEN debitNoLedgerCash.id IS NOT NULL THEN debitNoLedgerCash.mainTotal
                  ELSE 0
                END, 0)
              ), 0)
            FROM
              \`P_C_Ledgers\` AS cl2
              LEFT OUTER JOIN \`P_C_Payments\` AS paymentLedgerCash ON cl2.paymentId = paymentLedgerCash.id
              LEFT OUTER JOIN \`P_C_purchaseCashes\` AS purchaseLedgerCash ON cl2.purchaseId = purchaseLedgerCash.id
              LEFT OUTER JOIN \`P_C_Receipts\` AS receiptLedgerCash ON cl2.receiptId = receiptLedgerCash.id
              LEFT OUTER JOIN \`P_C_salesInvoices\` AS salesLedgerCash ON cl2.saleId = salesLedgerCash.id
              LEFT OUTER JOIN \`P_C_DebitNotes\` AS debitNoLedgerCash ON cl2.debitNoId = debitNoLedgerCash.id
              LEFT OUTER JOIN \`P_C_CreditNotes\` AS creditNoLedgerCash ON cl2.creditNoId = creditNoLedgerCash.id
            WHERE
              cl2.accountId = \`P_C_Ledger\`.\`accountId\`
              AND cl2.companyId = ${companyId}
              AND (cl2.date < \`P_C_Ledger\`.\`date\` OR (cl2.date = \`P_C_Ledger\`.\`date\` AND cl2.id < \`P_C_Ledger\`.\`id\`))
          )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_PurchaseCash,
          as: "purchaseLedgerCash",
          attributes: [],
        },
        {
          model: C_Payment,
          as: "paymentLedgerCash",
          attributes: [],
        },
        {
          model: C_Salesinvoice,
          as: "salesLedgerCash",
          attributes: [],
        },
        {
          model: C_Receipt,
          as: "receiptLedgerCash",
          where: { isActive: true },
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedgerCash",
          attributes: [],
        },
        {
          model: C_CreditNote,
          as: "creditNoLedgerCash",
          attributes: [],
        },
        {
          model: C_DebitNote,
          as: "debitNoLedgerCash",
          attributes: [],
        },
      ],
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const openingBalance = data[0]?.dataValues?.openingBalance ?? 0;
    const ledgerArray = [...data];
    if (+openingBalance !== 0) {
      ledgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }
    const groupedRecords = {};
    const fromFinancialYear = getFinancialYear(formDate);
    const toFinancialYear = getFinancialYear(toDate);

    let currentFinancialYear = fromFinancialYear;

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    while (currentFinancialYear <= toFinancialYear) {
      const [startYear, endYear] = currentFinancialYear.split("-").map(Number);
      const filteredRecords = filterRecordsByFinancialYear(
        ledgerArray,
        startYear,
        endYear
      );
      const newOpeningBalance = previousClosingBalance.amount;

      if (newOpeningBalance > 0) {
        filteredRecords.unshift({
          date: `${startYear}-04-01`,
          debitAmount:
            previousClosingBalance.type === "credit" ? newOpeningBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? newOpeningBalance : 0,
          particulars: "Opening Balance",
          vchType: "",
          vchNo: "",
        });
      }

      const totals = filteredRecords.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;

      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const records = filteredRecords.reduce((acc, obj) => {
        const dateKey = obj.date;
        const date = new Date(dateKey);
        const formattedDate = `${date.getDate()}-${date.toLocaleString(
          "default",
          {
            month: "short",
          }
        )}-${String(date.getFullYear()).slice(-2)}`;

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(obj);
        return acc;
      }, {});

      const daterang = getFinancialYearDates(
        startYear,
        endYear,
        formDate,
        toDate
      );
      groupedRecords[currentFinancialYear] = {
        dateRange: daterang,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records,
      };
      currentFinancialYear = `${startYear + 1}-${endYear + 1}`;
    }
    return res.status(200).json({
      status: "true",
      message: "Cash Ledger Dta Fetch Successfully.",
      data: { form: company, to: accountExist, years: groupedRecords },
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.daybook = async (req, res) => {
  try {
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;

    const company = await Company.findByPk(companyId);

    const queryData = { companyId: companyId };

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }
    const data = await Ledger.findAll({
      attributes: [
        "accountId",
        "date",
        [
          Sequelize.literal(`CASE
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`amount\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`mainTotal\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`amount\`
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`mainTotal\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN accountLedger.id IS NOT NULL THEN  \`accountLedger\`.\`accountName\`
                    ELSE ''
                  END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN 'TAX INVOICE/PURCHASE'
                    WHEN salesLedger.id IS NOT NULL THEN 'TAX INVOICE/SALES'
                    WHEN receiptLedger.id IS NOT NULL THEN 'Receipt'
                    WHEN paymentLedger.id IS NOT NULL THEN 'Payment'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'DEBIT NOTE'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'CREDIT NOTE'
                    ELSE ''
                  END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`voucherno\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`invoiceno\`
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`voucherno\`
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`voucherno\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`creditnoteNo\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`debitnoteno\`
                    ELSE ''
                  END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
                  (
                    SELECT
                      IFNULL(SUM(
                        IFNULL(CASE
                          WHEN receiptLedger.id IS NOT NULL THEN receiptLedger.amount
                          WHEN purchaseLedger.id IS NOT NULL THEN purchaseLedger.mainTotal
                          WHEN creditNoLedger.id IS NOT NULL THEN creditNoLedger.mainTotal
                          ELSE 0
                        END, 0) -
                        IFNULL(CASE
                          WHEN paymentLedger.id IS NOT NULL THEN paymentLedger.amount
                          WHEN salesLedger.id IS NOT NULL THEN salesLedger.mainTotal
                          WHEN debitNoLedger.id IS NOT NULL THEN debitNoLedger.mainTotal
                          ELSE 0
                        END, 0)
                      ), 0)
                    FROM
                      \`P_Ledgers\` AS cl2
                      LEFT OUTER JOIN \`P_Payments\` AS paymentLedger ON cl2.paymentId = paymentLedger.id
                      LEFT OUTER JOIN \`P_purchaseInvoices\` AS purchaseLedger ON cl2.purchaseInvId = purchaseLedger.id
                      LEFT OUTER JOIN \`P_Receipts\` AS receiptLedger ON cl2.receiptId = receiptLedger.id
                      LEFT OUTER JOIN \`P_salesInvoices\` AS salesLedger ON cl2.saleInvId = salesLedger.id
                      LEFT OUTER JOIN \`P_creditNotes\` AS creditNoLedger ON cl2.creditNoId = creditNoLedger.id
                      LEFT OUTER JOIN \`P_debitNotes\` AS debitNoLedger ON cl2.debitNoId = debitNoLedger.id
                    WHERE
                      cl2.accountId = \`P_Ledger\`.\`accountId\`
                      AND cl2.companyId = ${companyId}
                      AND (cl2.date < \`P_Ledger\`.\`date\` OR (cl2.date = \`P_Ledger\`.\`date\` AND cl2.id < \`P_Ledger\`.\`id\`))
                  )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: purchaseInvoice,
          as: "purchaseLedger",
          attributes: [],
        },
        {
          model: Payment,
          as: "paymentLedger",
          include: {
            model: CompanyBankDetails,
            as: "paymentBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: salesInvoice,
          as: "salesLedger",
          attributes: [],
        },
        {
          model: Receipt,
          as: "receiptLedger",
          include: {
            model: CompanyBankDetails,
            as: "receiptBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedger",
          attributes: [],
        },
        {
          model: CreditNote,
          as: "creditNoLedger",
          attributes: [],
        },
        {
          model: DebitNote,
          as: "debitNoLedger",
          attributes: [],
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
    if (+openingBalance !== 0) {
      ledgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }
    const totals = ledgerArray.reduce(
      (acc, ledger) => {
        if (ledger.dataValues) {
          acc.totalCredit += ledger.dataValues.creditAmount || 0;
          acc.totalDebit += ledger.dataValues.debitAmount || 0;
        } else {
          acc.totalCredit += ledger.creditAmount || 0;
          acc.totalDebit += ledger.debitAmount || 0;
        }
        return acc;
      },
      { totalCredit: 0, totalDebit: 0 }
    );

    const totalCredit = totals.totalCredit;
    const totalDebit = totals.totalDebit;
    const closingBalanceAmount = totalDebit - totalCredit;
    const closingBalance = {
      type: closingBalanceAmount < 0 ? "debit" : "credit",
      amount: +Math.abs(closingBalanceAmount).toFixed(2),
    };

    const records = ledgerArray.reduce((acc, obj) => {
      const dateKey = obj.date;
      const date = new Date(dateKey);
      const formattedDate = `${date.getDate()}-${date.toLocaleString(
        "default",
        { month: "short" }
      )}-${String(date.getFullYear()).slice(-2)}`;

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(obj);
      return acc;
    }, {});
    const formattedFromDate = new Date(formDate);
    const formattedToDate = new Date(toDate);

    const formDateFormat = `${formattedFromDate.getDate()}-${formattedFromDate.toLocaleString(
      "default",
      { month: "short" }
    )}-${String(formattedFromDate.getFullYear()).slice(-2)}`;
    const toDateFormat = `${formattedToDate.getDate()}-${formattedToDate.toLocaleString(
      "default",
      { month: "short" }
    )}-${String(formattedToDate.getFullYear()).slice(-2)}`;
    return res.status(200).json({
      status: "true",
      message: "Ledger Data Fetch Successfully",
      data: {
        form: company,
        dateRange: `${formDateFormat} - ${toDateFormat}`,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records: records,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_daybook = async (req, res) => {
  try {
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const queryData = { companyId: companyId };

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
        [
          Sequelize.literal(`CASE
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`amount\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`totalMrp\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`amount\`
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`totalMrp\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN accountLedgerCash.id IS NOT NULL THEN  \`accountLedgerCash\`.\`contactPersonName\`
                    ELSE ''
                  END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'PURCHASE CASH'
            WHEN salesLedgerCash.id IS NOT NULL THEN 'SALES CASH'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'Receipt'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'Payment'
             WHEN creditNoLedgerCash.id IS NOT NULL THEN 'CREDIT NOTE'
            WHEN debitNoLedgerCash.id IS NOT NULL THEN 'DEBIT NOTE'
            ELSE ''
        END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`purchaseNo\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`saleNo\`
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`receiptNo\`
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`paymentNo\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`creditnoteNo\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`debitnoteno\`
            ELSE ''
        END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
          (
            SELECT
              IFNULL(SUM(
                IFNULL(CASE
                  WHEN receiptLedgerCash.id IS NOT NULL THEN receiptLedgerCash.amount
                  WHEN purchaseLedgerCash.id IS NOT NULL THEN purchaseLedgerCash.totalMrp
                  WHEN creditNoLedgerCash.id IS NOT NULL THEN creditNoLedgerCash.mainTotal
                  ELSE 0
                END, 0) -
                IFNULL(CASE
                  WHEN paymentLedgerCash.id IS NOT NULL THEN paymentLedgerCash.amount
                  WHEN salesLedgerCash.id IS NOT NULL THEN salesLedgerCash.totalMrp
                  WHEN debitNoLedgerCash.id IS NOT NULL THEN debitNoLedgerCash.mainTotal
                  ELSE 0
                END, 0)
              ), 0)
            FROM
              \`P_C_Ledgers\` AS cl2
              LEFT OUTER JOIN \`P_C_Payments\` AS paymentLedgerCash ON cl2.paymentId = paymentLedgerCash.id
              LEFT OUTER JOIN \`P_C_purchaseCashes\` AS purchaseLedgerCash ON cl2.purchaseId = purchaseLedgerCash.id
              LEFT OUTER JOIN \`P_C_Receipts\` AS receiptLedgerCash ON cl2.receiptId = receiptLedgerCash.id
              LEFT OUTER JOIN \`P_C_salesInvoices\` AS salesLedgerCash ON cl2.saleId = salesLedgerCash.id
              LEFT OUTER JOIN \`P_C_DebitNotes\` AS debitNoLedgerCash ON cl2.debitNoId = debitNoLedgerCash.id
              LEFT OUTER JOIN \`P_C_CreditNotes\` AS creditNoLedgerCash ON cl2.creditNoId = creditNoLedgerCash.id
            WHERE
              cl2.accountId = \`P_C_Ledger\`.\`accountId\`
              AND cl2.companyId = ${companyId}
              AND (cl2.date < \`P_C_Ledger\`.\`date\` OR (cl2.date = \`P_C_Ledger\`.\`date\` AND cl2.id < \`P_C_Ledger\`.\`id\`))
          )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_PurchaseCash,
          as: "purchaseLedgerCash",
          attributes: [],
        },
        {
          model: C_Payment,
          as: "paymentLedgerCash",
          attributes: [],
        },
        {
          model: C_Salesinvoice,
          as: "salesLedgerCash",
          attributes: [],
        },
        {
          model: C_Receipt,
          as: "receiptLedgerCash",
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedgerCash",
          attributes: [],
        },
        {
          model: C_CreditNote,
          as: "creditNoLedgerCash",
          attributes: [],
        },
        {
          model: C_DebitNote,
          as: "debitNoLedgerCash",
          attributes: [],
        },
      ],
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const openingBalance = data[0]?.dataValues?.openingBalance ?? 0;

    const cashLedgerArray = [...data];
    if (+openingBalance !== 0) {
      cashLedgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }

    const totals = cashLedgerArray.reduce(
      (acc, ledger) => {
        if (ledger.dataValues) {
          acc.totalCredit += ledger.dataValues.creditAmount || 0;
          acc.totalDebit += ledger.dataValues.debitAmount || 0;
        } else {
          acc.totalCredit += ledger.creditAmount || 0;
          acc.totalDebit += ledger.debitAmount || 0;
        }
        return acc;
      },
      { totalCredit: 0, totalDebit: 0 }
    );

    const totalCredit = totals.totalCredit;
    const totalDebit = totals.totalDebit;
    const closingBalanceAmount = totalDebit - totalCredit;
    const closingBalance = {
      type: closingBalanceAmount < 0 ? "debit" : "credit",
      amount: +Math.abs(closingBalanceAmount).toFixed(2),
    };
    const records = cashLedgerArray.reduce((acc, obj) => {
      const dateKey = obj.date;
      const date = new Date(dateKey);
      const formattedDate = `${date.getDate()}-${date.toLocaleString(
        "default",
        { month: "short" }
      )}-${String(date.getFullYear()).slice(-2)}`;

      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(obj);
      return acc;
    }, {});
    const formattedFromDate = new Date(formDate);
    const formattedToDate = new Date(toDate);

    const formDateFormat = `${formattedFromDate.getDate()}-${formattedFromDate.toLocaleString(
      "default",
      { month: "short" }
    )}-${String(formattedFromDate.getFullYear()).slice(-2)}`;
    const toDateFormat = `${formattedToDate.getDate()}-${formattedToDate.toLocaleString(
      "default",
      { month: "short" }
    )}-${String(formattedToDate.getFullYear()).slice(-2)}`;

    return res.status(200).json({
      status: "true",
      message: "Cash Ledger Data Fetch Successfully.",
      data: {
        form: company,
        dateRange: `${formDateFormat} - ${toDateFormat}`,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records: records,
      },
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.C_wallet_ledger = async (req, res) => {
  try {
    const { formDate, toDate } = req.query;
    const { companyId, userId } = req.user;
    const queryData = { userId: userId, companyId: companyId };

    const userExist = await User.findOne({ where: { id: userId } });
    if (!userExist) {
      return res.status(404).json({
        status: "false",
        message: "User Not Found.",
      });
    }

    const company = await Company.findByPk(companyId);

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }

    const data = await C_WalletLedger.findAll({
      where: queryData,
      attributes: [
        "date",
        "id",
        "isApprove",
        [
          Sequelize.literal(`CASE
            WHEN walletPayment.id IS NOT NULL THEN \`walletPayment\`.\`amount\`
            WHEN \`walletClaim\`.\`toUserId\` = ${userId} THEN \`walletClaim\`.\`amount\`
            ELSE 0
        END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN walletReceipt.id IS NOT NULL THEN \`walletReceipt\`.\`amount\`
            WHEN \`walletClaim\`.\`fromUserId\` = ${userId} THEN \`walletClaim\`.\`amount\`
            ELSE 0
        END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN walletPayment.id IS NOT NULL THEN \`walletPayment\`.\`description\`
            WHEN walletReceipt.id IS NOT NULL THEN \`walletReceipt\`.\`description\`
            WHEN walletClaim.id IS NOT NULL THEN \`walletClaim\`.\`description\`
            ELSE ''
        END`),
          "details",
        ],
        [
          Sequelize.literal(`CASE
            WHEN walletPayment.id IS NOT NULL THEN \`walletPayment->accountPaymentCash\`.\`contactPersonName\`
            WHEN walletReceipt.id IS NOT NULL THEN \`walletReceipt->accountReceiptCash\`.\`contactPersonName\`
            WHEN \`walletClaim\`.\`fromUserId\` = ${userId} THEN \`walletClaim->toUser\`.\`username\`
          WHEN \`walletClaim\`.\`toUserId\` = ${userId} THEN \`walletClaim->fromUser\`.\`username\`
            ELSE ''
        END`),
          "personName",
        ],
        [
          Sequelize.literal(`
    (
        SELECT
            IFNULL(SUM(
                IFNULL(CASE
                    WHEN walletReceipt.id IS NOT NULL THEN walletReceipt.amount
                    WHEN walletClaim.fromUserId = ${userId} THEN walletClaim.amount
                    ELSE 0
                END, 0) -
                IFNULL(CASE
                    WHEN walletPayment.id IS NOT NULL THEN walletPayment.amount
                    WHEN walletClaim.toUserId = ${userId} THEN walletClaim.amount
                    ELSE 0
                END, 0)
            ), 0)
        FROM
            \`P_C_WalletLedgers\` AS wl2
            LEFT OUTER JOIN \`P_C_Payments\` AS walletPayment ON wl2.paymentId = walletPayment.id
            LEFT OUTER JOIN \`P_C_Receipts\` AS walletReceipt ON wl2.receiptId = walletReceipt.id
            LEFT OUTER JOIN \`P_C_claims\` AS walletClaim ON wl2.claimId = walletClaim.id
        WHERE
            wl2.userId = \`P_C_WalletLedger\`.\`userId\`
            AND wl2.companyId = ${companyId}
            AND (wl2.date < \`P_C_WalletLedger\`.\`date\` OR (wl2.date = \`P_C_WalletLedger\`.\`date\` AND wl2.id < \`P_C_WalletLedger\`.\`id\`))
    )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_Payment,
          as: "walletPayment",
          include: [
            {
              model: Account,
              as: "accountPaymentCash",
            },
          ],
          attributes: [],
        },
        {
          model: C_Receipt,
          as: "walletReceipt",
          include: [
            {
              model: Account,
              as: "accountReceiptCash",
            },
          ],
          attributes: [],
        },
        {
          model: C_Claim,
          as: "walletClaim",
          include: [
            { model: User, as: "toUser" },
            { model: User, as: "fromUser" },
          ],
          attributes: [],
        },
      ],
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const openingBalance = data[0]?.dataValues?.openingBalance ?? 0;
    const walletLedgerArray = [...data];
    if (+openingBalance !== 0) {
      walletLedgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        details: "Opening Balance",
        openingBalance: 0,
        personName: "",
        id: null,
      });
    }

    const totals = walletLedgerArray.reduce(
      (acc, ledger) => {
        if (ledger.dataValues) {
          acc.totalCredit += ledger.dataValues.creditAmount || 0;
          acc.totalDebit += ledger.dataValues.debitAmount || 0;
        } else {
          acc.totalCredit += ledger.creditAmount || 0;
          acc.totalDebit += ledger.debitAmount || 0;
        }
        return acc;
      },
      { totalCredit: 0, totalDebit: 0 }
    );

    const totalCredit = totals.totalCredit;
    const totalDebit = totals.totalDebit;
    const closingBalanceAmount = totalDebit - totalCredit;
    const closingBalance = {
      type: closingBalanceAmount < 0 ? "debit" : "credit",
      amount: +Math.abs(closingBalanceAmount).toFixed(2),
    };

    return res.status(200).json({
      status: "true",
      message: "Wallet Ledger Data Fetch Successfully.",
      data: {
        records: walletLedgerArray,
        totals,
        closingBalance,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
      },
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.C_cashbook = async (req, res) => {
  try {
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const queryData = {
      companyId: companyId,
    };

    const company = await Company.findByPk(companyId);

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }

    const data = await C_Cashbook.findAll({
      where: queryData,
      attributes: [
        "date",
        "id",
        [
          Sequelize.literal(`CASE
            WHEN cashCashbookPayment.id IS NOT NULL THEN \`cashCashbookPayment\`.\`amount\`
            WHEN cashbookPayment.id IS NOT NULL THEN \`cashbookPayment\`.\`amount\`
            ELSE 0
        END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN cashCashbookReceipt.id IS NOT NULL THEN \`cashCashbookReceipt\`.\`amount\`
            WHEN cashbookReceipt.id IS NOT NULL THEN \`cashbookReceipt\`.\`amount\`
            ELSE 0
        END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN cashCashbookReceipt.id IS NOT NULL THEN \`cashCashbookReceipt\`.\`description\`
            WHEN cashCashbookPayment.id IS NOT NULL THEN \`cashCashbookPayment\`.\`description\`
            WHEN cashbookPayment.id IS NOT NULL THEN
                        CASE
                            WHEN cashbookPayment.bankAccountId IS NOT NULL THEN \`cashbookPayment->paymentBankAccount\`.\`bankname\`
                            ELSE \`cashbookPayment\`.\`transactionType\`
                        END
            WHEN cashbookReceipt.id IS NOT NULL THEN
                CASE
                    WHEN cashbookReceipt.bankAccountId IS NOT NULL THEN \`cashbookReceipt->receiptBankAccount\`.\`bankname\`
                    ELSE \`cashbookReceipt\`.\`transactionType\`
                END
            ELSE ''
        END`),
          "details",
        ],
        [
          Sequelize.literal(`CASE
            WHEN cashCashbookPayment.id IS NOT NULL THEN \`cashCashbookPayment->accountPaymentCash\`.\`contactPersonName\`
            WHEN cashCashbookReceipt.id IS NOT NULL THEN \`cashCashbookReceipt->accountReceiptCash\`.\`contactPersonName\`
            WHEN cashbookReceipt.id IS NOT NULL THEN \`cashbookReceipt->accountReceipt\`.\`accountName\`
            WHEN cashbookPayment.id IS NOT NULL THEN \`cashbookPayment->accountPayment\`.\`accountName\`
            ELSE ''
        END`),
          "personName",
        ],
        [
          Sequelize.literal(`CASE
            WHEN cashCashbookPayment.id IS NOT NULL THEN \`cashCashbookPayment->paymentUpdate\`.\`username\`
            WHEN cashCashbookReceipt.id IS NOT NULL THEN \`cashCashbookReceipt->receiveUpdate\`.\`username\`
            WHEN cashbookReceipt.id IS NOT NULL THEN \`cashbookReceipt->bankUpdateUser\`.\`username\`
            WHEN cashbookPayment.id IS NOT NULL THEN \`cashbookPayment->paymentUpdateUser\`.\`username\`
            ELSE ''
        END`),
          "username",
        ],
      ],
      include: [
        {
          model: C_Payment,
          as: "cashCashbookPayment",
          include: [
            {
              model: Account,
              as: "accountPaymentCash",
            },
            {
              model: User,
              as: "paymentUpdate",
            },
          ],
          attributes: [],
        },
        {
          model: C_Receipt,
          as: "cashCashbookReceipt",
          include: [
            {
              model: Account,
              as: "accountReceiptCash",
            },
            {
              model: User,
              as: "receiveUpdate",
            },
          ],
          attributes: [],
        },
        {
          model: Receipt,
          as: "cashbookReceipt",
          include: [
            {
              model: Account,
              as: "accountReceipt",
            },
            {
              model: CompanyBankDetails,
              as: "receiptBankAccount",
              attributes: [],
            },
            {
              model: User,
              as: "bankUpdateUser",
            },
          ],
          attributes: [],
        },
        {
          model: Payment,
          as: "cashbookPayment",
          include: [
            {
              model: Account,
              as: "accountPayment",
            },
            {
              model: CompanyBankDetails,
              as: "paymentBankAccount",
              attributes: [],
            },
            {
              model: User,
              as: "paymentUpdateUser",
            },
          ],
          attributes: [],
        },
      ],
      order: [["date", "ASC"]],
    });

    const fromDateObj = new Date(formDate);
    const toDateObj = new Date(toDate);

    function generateDateRange(from, to) {
      const dates = [];
      let currentDate = new Date(from);

      while (currentDate <= to) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    }

    const openingBalanceData = await C_Cashbook.findOne({
      where: {
        companyId: companyId,
        date: {
          [Sequelize.Op.lt]: formDate,
        },
      },
      attributes: [
        "id",
        "date",
        [
          Sequelize.literal(`
          (
        SELECT
            IFNULL(SUM(
                IFNULL(CASE
                  WHEN cashCashbookReceipt.id IS NOT NULL THEN cashCashbookReceipt.amount
                  WHEN cashbookReceipt.id IS NOT NULL THEN cashbookReceipt.amount
                  ELSE 0
                END, 0) -
                IFNULL(CASE
                  WHEN cashCashbookPayment.id IS NOT NULL THEN cashCashbookPayment.amount
                  WHEN cashbookPayment.id IS NOT NULL THEN cashbookPayment.amount
                  ELSE 0
                END, 0)
              ), 0
            )
        FROM
            P_C_Cashbooks AS cb2
        LEFT OUTER JOIN P_Receipts AS cashbookReceipt ON cb2.receiptId = cashbookReceipt.id
        LEFT OUTER JOIN P_Payments AS cashbookPayment ON cb2.paymentId = cashbookPayment.id
        LEFT OUTER JOIN P_C_Receipts AS cashCashbookReceipt ON cb2.C_receiptId = cashCashbookReceipt.id
        LEFT OUTER JOIN P_C_Payments AS cashCashbookPayment ON cb2.C_paymentId = cashCashbookPayment.id
        WHERE
            cb2.companyId = ${companyId}
            AND (
                cb2.date <= P_C_Cashbook.date
                OR (
                    cb2.date = P_C_Cashbook.date
                    AND cb2.id <= P_C_Cashbook.id
                )
            )
    )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_Payment,
          as: "cashCashbookPayment",
          include: [
            {
              model: Account,
              as: "accountPaymentCash",
            },
            {
              model: User,
              as: "paymentUpdate",
            },
          ],
          attributes: [],
        },
        {
          model: C_Receipt,
          as: "cashCashbookReceipt",
          include: [
            {
              model: Account,
              as: "accountReceiptCash",
            },
            {
              model: User,
              as: "receiveUpdate",
            },
          ],
          attributes: [],
        },
        {
          model: Receipt,
          as: "cashbookReceipt",
          include: [
            {
              model: Account,
              as: "accountReceipt",
            },
            {
              model: User,
              as: "bankUpdateUser",
            },
          ],
          attributes: [],
        },
        {
          model: Payment,
          as: "cashbookPayment",
          include: [
            {
              model: Account,
              as: "accountPayment",
            },
            {
              model: User,
              as: "paymentUpdateUser",
            },
          ],
          attributes: [],
        },
      ],
      order: [["date", "DESC"]],
    });

    const mainOpeningBalance =
      openingBalanceData?.dataValues?.openingBalance ?? 0;

    const allDates = generateDateRange(fromDateObj, toDateObj);

    const existingDataGrouped = data.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {});

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    const result = allDates.reduce((acc, date, index) => {
      const groupDateData = existingDataGrouped[date] || [];
      const ledgerArray = [...groupDateData];

      if (index === 0) {
        ledgerArray.unshift({
          date: date,
          debitAmount:
            mainOpeningBalance < 0
              ? +Math.abs(mainOpeningBalance).toFixed(2)
              : 0,
          creditAmount:
            mainOpeningBalance > 0
              ? +Math.abs(mainOpeningBalance).toFixed(2)
              : 0,
          details: "Opening Balance",
          openingBalance: 0,
          personName: "",
          id: null,
          username: "",
        });
      }

      const openingBalance = previousClosingBalance.amount;

      if (openingBalance > 0) {
        ledgerArray.unshift({
          date: date,
          debitAmount:
            previousClosingBalance.type === "credit" ? openingBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? openingBalance : 0,
          details: "Opening Balance",
          openingBalance: 0,
          personName: "",
          id: null,
          username: "",
        });
      }

      const totals = ledgerArray.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;
      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const totalAmount =
        totals.totalCredit < totals.totalDebit
          ? totals.totalDebit
          : totals.totalCredit;

      acc[date] = {
        totalAmount,
        totals,
        closingBalance,
        records: ledgerArray,
      };

      return acc;
    }, {});

    return res.status(200).json({
      status: "true",
      message: "Cashbook Data Fetch Successfully.",
      data: {
        form: company,
        records: result,
      },
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.account_ledger_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const accountExist = await Account.findOne({
      where: { id, companyId, isActive: true },
      include: [{model: AccountDetails, as: "accountDetail"}]
    });
    if (!accountExist) {
      return res.status(404).json({
        status: "false",
        message: "Account Not Found.",
      });
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
        [
          Sequelize.literal(`CASE
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`amount\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`mainTotal\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`amount\`
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`mainTotal\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN salesLedger.id IS NOT NULL THEN 'SALES GST'
                    WHEN purchaseLedger.id IS NOT NULL THEN 'PURCHASE GST'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'SALES'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'PURCHASE'
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
                  END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN salesLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN receiptLedger.id IS NOT NULL THEN 'Receipt'
                    WHEN paymentLedger.id IS NOT NULL THEN 'Payment'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'DEBIT NOTE'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'CREDIT NOTE'
                    ELSE ''
                  END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`voucherno\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`invoiceno\`
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`voucherno\`
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`voucherno\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`creditnoteNo\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`debitnoteno\`
                    ELSE ''
                  END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
                  (
                    SELECT
                      IFNULL(SUM(
                        IFNULL(CASE
                          WHEN receiptLedger.id IS NOT NULL THEN receiptLedger.amount
                          WHEN purchaseLedger.id IS NOT NULL THEN purchaseLedger.mainTotal
                          WHEN creditNoLedger.id IS NOT NULL THEN creditNoLedger.mainTotal
                          ELSE 0
                        END, 0) -
                        IFNULL(CASE
                          WHEN paymentLedger.id IS NOT NULL THEN paymentLedger.amount
                          WHEN salesLedger.id IS NOT NULL THEN salesLedger.mainTotal
                          WHEN debitNoLedger.id IS NOT NULL THEN debitNoLedger.mainTotal
                          ELSE 0
                        END, 0)
                      ), 0)
                    FROM
                      \`P_Ledgers\` AS cl2
                      LEFT OUTER JOIN \`P_Payments\` AS paymentLedger ON cl2.paymentId = paymentLedger.id
                      LEFT OUTER JOIN \`P_purchaseInvoices\` AS purchaseLedger ON cl2.purchaseInvId = purchaseLedger.id
                      LEFT OUTER JOIN \`P_Receipts\` AS receiptLedger ON cl2.receiptId = receiptLedger.id
                      LEFT OUTER JOIN \`P_salesInvoices\` AS salesLedger ON cl2.saleInvId = salesLedger.id
                      LEFT OUTER JOIN \`P_creditNotes\` AS creditNoLedger ON cl2.creditNoId = creditNoLedger.id
                      LEFT OUTER JOIN \`P_debitNotes\` AS debitNoLedger ON cl2.debitNoId = debitNoLedger.id
                    WHERE
                      cl2.accountId = \`P_Ledger\`.\`accountId\`
                      AND cl2.companyId = ${companyId}
                      AND (cl2.date < \`P_Ledger\`.\`date\` OR (cl2.date = \`P_Ledger\`.\`date\` AND cl2.id < \`P_Ledger\`.\`id\`))
                  )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: purchaseInvoice,
          as: "purchaseLedger",
          attributes: [],
        },
        {
          model: Payment,
          as: "paymentLedger",
          include: {
            model: CompanyBankDetails,
            as: "paymentBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: salesInvoice,
          as: "salesLedger",
          attributes: [],
        },
        {
          model: Receipt,
          as: "receiptLedger",
          include: {
            model: CompanyBankDetails,
            as: "receiptBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedger",
          attributes: [],
        },
        {
          model: CreditNote,
          as: "creditNoLedger",
          attributes: [],
        },
        {
          model: DebitNote,
          as: "debitNoLedger",
          attributes: [],
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
    if (+openingBalance !== 0) {
      ledgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }
    const groupedRecords = {};
    const fromFinancialYear = getFinancialYear(formDate);
    const toFinancialYear = getFinancialYear(toDate);

    let currentFinancialYear = fromFinancialYear;

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    while (currentFinancialYear <= toFinancialYear) {
      const [startYear, endYear] = currentFinancialYear.split("-").map(Number);
      const filteredRecords = filterRecordsByFinancialYear(
        ledgerArray,
        startYear,
        endYear
      );
      const newOpeningBalance = previousClosingBalance.amount;

      if (newOpeningBalance > 0) {
        filteredRecords.unshift({
          date: `${startYear}-04-01`,
          debitAmount:
            previousClosingBalance.type === "credit" ? newOpeningBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? newOpeningBalance : 0,
          particulars: "Opening Balance",
          vchType: "",
          vchNo: "",
        });
      }

      const totals = filteredRecords.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;

      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const records = filteredRecords.reduce((acc, obj) => {
        const dateKey = obj.date;
        const date = new Date(dateKey);
        const formattedDate = `${date.getDate()}-${date.toLocaleString(
          "default",
          {
            month: "short",
          }
        )}-${String(date.getFullYear()).slice(-2)}`;

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(obj);
        return acc;
      }, {});

      const daterang = getFinancialYearDates(
        startYear,
        endYear,
        formDate,
        toDate
      );
      Object.keys(records).forEach((date) => {
        records[date] = records[date].map((entry) => {
          if (entry.dataValues) {
            return { ...entry.dataValues, date: entry.date };
          }
          return entry;
        });
      });
      groupedRecords[currentFinancialYear] = {
        dateRange: daterang,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records,
      };
      currentFinancialYear = `${startYear + 1}-${endYear + 1}`;
    }

    const html = await renderFile(
      path.join(__dirname, "../views/accountLedger.ejs"),
      { data: { form: company, to: accountExist, years: groupedRecords } }
    );
    htmlToPdf
      .generatePdf({ content: html }, { printBackground: true, format: "A4" })
      .then((pdf) => {
        const base64String = pdf.toString("base64");
        return res.status(200).json({
          status: "Success",
          message: "pdf create successFully",
          data: base64String,
        });
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.account_ledger_jpg = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const accountExist = await Account.findOne({
      where: { id, companyId, isActive: true },
      include: [{model: AccountDetails, as: "accountDetail"}]
    });
    if (!accountExist) {
      return res.status(404).json({
        status: "false",
        message: "Account Not Found.",
      });
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
        [
          Sequelize.literal(`CASE
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`amount\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`mainTotal\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`amount\`
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`mainTotal\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN salesLedger.id IS NOT NULL THEN 'SALES GST'
                    WHEN purchaseLedger.id IS NOT NULL THEN 'PURCHASE GST'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'SALES'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'PURCHASE'
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
                  END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN salesLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN receiptLedger.id IS NOT NULL THEN 'Receipt'
                    WHEN paymentLedger.id IS NOT NULL THEN 'Payment'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'DEBIT NOTE'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'CREDIT NOTE'
                    ELSE ''
                  END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`voucherno\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`invoiceno\`
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`voucherno\`
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`voucherno\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`creditnoteNo\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`debitnoteno\`
                    ELSE ''
                  END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
                  (
                    SELECT
                      IFNULL(SUM(
                        IFNULL(CASE
                          WHEN receiptLedger.id IS NOT NULL THEN receiptLedger.amount
                          WHEN purchaseLedger.id IS NOT NULL THEN purchaseLedger.mainTotal
                          WHEN creditNoLedger.id IS NOT NULL THEN creditNoLedger.mainTotal
                          ELSE 0
                        END, 0) -
                        IFNULL(CASE
                          WHEN paymentLedger.id IS NOT NULL THEN paymentLedger.amount
                          WHEN salesLedger.id IS NOT NULL THEN salesLedger.mainTotal
                          WHEN debitNoLedger.id IS NOT NULL THEN debitNoLedger.mainTotal
                          ELSE 0
                        END, 0)
                      ), 0)
                    FROM
                      \`P_Ledgers\` AS cl2
                      LEFT OUTER JOIN \`P_Payments\` AS paymentLedger ON cl2.paymentId = paymentLedger.id
                      LEFT OUTER JOIN \`P_purchaseInvoices\` AS purchaseLedger ON cl2.purchaseInvId = purchaseLedger.id
                      LEFT OUTER JOIN \`P_Receipts\` AS receiptLedger ON cl2.receiptId = receiptLedger.id
                      LEFT OUTER JOIN \`P_salesInvoices\` AS salesLedger ON cl2.saleInvId = salesLedger.id
                      LEFT OUTER JOIN \`P_creditNotes\` AS creditNoLedger ON cl2.creditNoId = creditNoLedger.id
                      LEFT OUTER JOIN \`P_debitNotes\` AS debitNoLedger ON cl2.debitNoId = debitNoLedger.id
                    WHERE
                      cl2.accountId = \`P_Ledger\`.\`accountId\`
                      AND cl2.companyId = ${companyId}
                      AND (cl2.date < \`P_Ledger\`.\`date\` OR (cl2.date = \`P_Ledger\`.\`date\` AND cl2.id < \`P_Ledger\`.\`id\`))
                  )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: purchaseInvoice,
          as: "purchaseLedger",
          attributes: [],
        },
        {
          model: Payment,
          as: "paymentLedger",
          include: {
            model: CompanyBankDetails,
            as: "paymentBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: salesInvoice,
          as: "salesLedger",
          attributes: [],
        },
        {
          model: Receipt,
          as: "receiptLedger",
          include: {
            model: CompanyBankDetails,
            as: "receiptBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedger",
          attributes: [],
        },
        {
          model: CreditNote,
          as: "creditNoLedger",
          attributes: [],
        },
        {
          model: DebitNote,
          as: "debitNoLedger",
          attributes: [],
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
    if (+openingBalance !== 0) {
      ledgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }
    const groupedRecords = {};
    const fromFinancialYear = getFinancialYear(formDate);
    const toFinancialYear = getFinancialYear(toDate);

    let currentFinancialYear = fromFinancialYear;

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    while (currentFinancialYear <= toFinancialYear) {
      const [startYear, endYear] = currentFinancialYear.split("-").map(Number);
      const filteredRecords = filterRecordsByFinancialYear(
        ledgerArray,
        startYear,
        endYear
      );
      const newOpeningBalance = previousClosingBalance.amount;

      if (newOpeningBalance > 0) {
        filteredRecords.unshift({
          date: `${startYear}-04-01`,
          debitAmount:
            previousClosingBalance.type === "credit" ? newOpeningBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? newOpeningBalance : 0,
          particulars: "Opening Balance",
          vchType: "",
          vchNo: "",
        });
      }

      const totals = filteredRecords.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;

      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const records = filteredRecords.reduce((acc, obj) => {
        const dateKey = obj.date;
        const date = new Date(dateKey);
        const formattedDate = `${date.getDate()}-${date.toLocaleString(
          "default",
          {
            month: "short",
          }
        )}-${String(date.getFullYear()).slice(-2)}`;

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(obj);
        return acc;
      }, {});

      const daterang = getFinancialYearDates(
        startYear,
        endYear,
        formDate,
        toDate
      );
      Object.keys(records).forEach((date) => {
        records[date] = records[date].map((entry) => {
          if (entry.dataValues) {
            return { ...entry.dataValues, date: entry.date };
          }
          return entry;
        });
      });
      groupedRecords[currentFinancialYear] = {
        dateRange: daterang,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records,
      };
      currentFinancialYear = `${startYear + 1}-${endYear + 1}`;
    }

    const html = await renderFile(
      path.join(__dirname, "../views/accountLedger.ejs"),
      { data: { form: company, to: accountExist, years: groupedRecords } }
    );
    
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const base64String = await page.screenshot({
      type: "jpeg",
      fullPage: true,
      encoding: "base64",
    });

    await browser.close();
    return res.status(200).json({
      status: "Success",
      message: "JPG created successfully",
      data: base64String,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
};

exports.account_ledger_html = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const accountExist = await Account.findOne({
      where: { id, companyId, isActive: true },
      include: [{model: AccountDetails, as: "accountDetail"}]
    });
    if (!accountExist) {
      return res.status(404).json({
        status: "false",
        message: "Account Not Found.",
      });
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
        [
          Sequelize.literal(`CASE
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`amount\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`mainTotal\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`amount\`
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`mainTotal\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN salesLedger.id IS NOT NULL THEN 'SALES GST'
                    WHEN purchaseLedger.id IS NOT NULL THEN 'PURCHASE GST'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'SALES'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'PURCHASE'
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
                  END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN salesLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN receiptLedger.id IS NOT NULL THEN 'Receipt'
                    WHEN paymentLedger.id IS NOT NULL THEN 'Payment'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'DEBIT NOTE'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'CREDIT NOTE'
                    ELSE ''
                  END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`voucherno\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`invoiceno\`
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`voucherno\`
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`voucherno\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`creditnoteNo\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`debitnoteno\`
                    ELSE ''
                  END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
                  (
                    SELECT
                      IFNULL(SUM(
                        IFNULL(CASE
                          WHEN receiptLedger.id IS NOT NULL THEN receiptLedger.amount
                          WHEN purchaseLedger.id IS NOT NULL THEN purchaseLedger.mainTotal
                          WHEN creditNoLedger.id IS NOT NULL THEN creditNoLedger.mainTotal
                          ELSE 0
                        END, 0) -
                        IFNULL(CASE
                          WHEN paymentLedger.id IS NOT NULL THEN paymentLedger.amount
                          WHEN salesLedger.id IS NOT NULL THEN salesLedger.mainTotal
                          WHEN debitNoLedger.id IS NOT NULL THEN debitNoLedger.mainTotal
                          ELSE 0
                        END, 0)
                      ), 0)
                    FROM
                      \`P_Ledgers\` AS cl2
                      LEFT OUTER JOIN \`P_Payments\` AS paymentLedger ON cl2.paymentId = paymentLedger.id
                      LEFT OUTER JOIN \`P_purchaseInvoices\` AS purchaseLedger ON cl2.purchaseInvId = purchaseLedger.id
                      LEFT OUTER JOIN \`P_Receipts\` AS receiptLedger ON cl2.receiptId = receiptLedger.id
                      LEFT OUTER JOIN \`P_salesInvoices\` AS salesLedger ON cl2.saleInvId = salesLedger.id
                      LEFT OUTER JOIN \`P_creditNotes\` AS creditNoLedger ON cl2.creditNoId = creditNoLedger.id
                      LEFT OUTER JOIN \`P_debitNotes\` AS debitNoLedger ON cl2.debitNoId = debitNoLedger.id
                    WHERE
                      cl2.accountId = \`P_Ledger\`.\`accountId\`
                      AND cl2.companyId = ${companyId}
                      AND (cl2.date < \`P_Ledger\`.\`date\` OR (cl2.date = \`P_Ledger\`.\`date\` AND cl2.id < \`P_Ledger\`.\`id\`))
                  )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: purchaseInvoice,
          as: "purchaseLedger",
          attributes: [],
        },
        {
          model: Payment,
          as: "paymentLedger",
          include: {
            model: CompanyBankDetails,
            as: "paymentBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: salesInvoice,
          as: "salesLedger",
          attributes: [],
        },
        {
          model: Receipt,
          as: "receiptLedger",
          include: {
            model: CompanyBankDetails,
            as: "receiptBankAccount",
            attributes: [],
          },
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedger",
          attributes: [],
        },
        {
          model: CreditNote,
          as: "creditNoLedger",
          attributes: [],
        },
        {
          model: DebitNote,
          as: "debitNoLedger",
          attributes: [],
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
    if (+openingBalance !== 0) {
      ledgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }
    const groupedRecords = {};
    const fromFinancialYear = getFinancialYear(formDate);
    const toFinancialYear = getFinancialYear(toDate);

    let currentFinancialYear = fromFinancialYear;

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    while (currentFinancialYear <= toFinancialYear) {
      const [startYear, endYear] = currentFinancialYear.split("-").map(Number);
      const filteredRecords = filterRecordsByFinancialYear(
        ledgerArray,
        startYear,
        endYear
      );
      const newOpeningBalance = previousClosingBalance.amount;

      if (newOpeningBalance > 0) {
        filteredRecords.unshift({
          date: `${startYear}-04-01`,
          debitAmount:
            previousClosingBalance.type === "credit" ? newOpeningBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? newOpeningBalance : 0,
          particulars: "Opening Balance",
          vchType: "",
          vchNo: "",
        });
      }

      const totals = filteredRecords.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;

      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const records = filteredRecords.reduce((acc, obj) => {
        const dateKey = obj.date;
        const date = new Date(dateKey);
        const formattedDate = `${date.getDate()}-${date.toLocaleString(
          "default",
          {
            month: "short",
          }
        )}-${String(date.getFullYear()).slice(-2)}`;

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(obj);
        return acc;
      }, {});

      const daterang = getFinancialYearDates(
        startYear,
        endYear,
        formDate,
        toDate
      );
      Object.keys(records).forEach((date) => {
        records[date] = records[date].map((entry) => {
          if (entry.dataValues) {
            return { ...entry.dataValues, date: entry.date };
          }
          return entry;
        });
      });
      groupedRecords[currentFinancialYear] = {
        dateRange: daterang,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records,
      };
      currentFinancialYear = `${startYear + 1}-${endYear + 1}`;
    }

    const html = await renderFile(
      path.join(__dirname, "../views/accountLedger.ejs"),
      { data: { form: company, to: accountExist, years: groupedRecords } }
    );
    const base64HTML = Buffer.from(html).toString("base64");

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: "Success",
      message: "Html Document Created Successfully",
      data: base64HTML,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
};

exports.account_ledger_excel = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId; 
    const companyData = await Company.findByPk(companyId);

    let accounts;

    if (id) {
      accounts = await Account.findOne({
        where: { id, companyId, isActive: true },
        include: [{ model: AccountDetails, as: "accountDetail" }]
      });

      if (!accounts) {
        return res.status(404).json({
          status: "false",
          message: "Account Not Found.",
        });
      }
    } else {
      accounts = await Account.findAll({
        where: { companyId, isActive: true },
        include: [{ model: AccountDetails, as: "accountDetail" }]
      });

      if (!accounts || accounts.length === 0) {
        return res.status(404).json({
          status: "false",
          message: "No Active Accounts Found.",
        });
      }
    }

    const allLedgerData = [];

    // If a single account was found, handle it separately for ledger data
    if (accounts) {
      const accountIds = Array.isArray(accounts) ? accounts.map(a => a.id) : [accounts.id];

      for (const accountId of accountIds) {
        const queryData = { accountId, companyId };

        if (formDate && toDate) {
          queryData.date = {
            [Sequelize.Op.between]: [formDate, toDate],
          };
        }

        const data = await Ledger.findAll({
          attributes: [
            "date",
            [
              Sequelize.literal(`CASE
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`amount\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`mainTotal\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
              "debitAmount",
            ],
            [
              Sequelize.literal(`CASE
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`amount\`
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`mainTotal\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`mainTotal\`
                    ELSE 0
                END`),
              "creditAmount",
            ],
            [
              Sequelize.literal(`CASE
                    WHEN salesLedger.id IS NOT NULL THEN 'SALES GST'
                    WHEN purchaseLedger.id IS NOT NULL THEN 'PURCHASE GST'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'SALES'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'PURCHASE'
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
                  END`),
              "particulars",
            ],
            [
              Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN salesLedger.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN receiptLedger.id IS NOT NULL THEN 'Receipt'
                    WHEN paymentLedger.id IS NOT NULL THEN 'Payment'
                    WHEN debitNoLedger.id IS NOT NULL THEN 'DEBIT NOTE'
                    WHEN creditNoLedger.id IS NOT NULL THEN 'CREDIT NOTE'
                    ELSE ''
                  END`),
              "vchType",
            ],
            [
              Sequelize.literal(`CASE
                    WHEN purchaseLedger.id IS NOT NULL THEN \`purchaseLedger\`.\`voucherno\`
                    WHEN salesLedger.id IS NOT NULL THEN \`salesLedger\`.\`invoiceno\`
                    WHEN receiptLedger.id IS NOT NULL THEN \`receiptLedger\`.\`voucherno\`
                    WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`voucherno\`
                    WHEN creditNoLedger.id IS NOT NULL THEN \`creditNoLedger\`.\`creditnoteNo\`
                    WHEN debitNoLedger.id IS NOT NULL THEN \`debitNoLedger\`.\`debitnoteno\`
                    ELSE ''
                  END`),
              "vchNo",
            ]
          ],
          include: [
            {
              model: purchaseInvoice,
              as: "purchaseLedger",
              attributes: [],
            },
            {
              model: Payment,
              as: "paymentLedger",
              include: {
                model: CompanyBankDetails,
                as: "paymentBankAccount",
                attributes: [],
              },
              attributes: [],
            },
            {
              model: salesInvoice,
              as: "salesLedger",
              attributes: [],
            },
            {
              model: Receipt,
              as: "receiptLedger",
              include: {
                model: CompanyBankDetails,
                as: "receiptBankAccount",
                attributes: [],
              },
              attributes: [],
            },
            {
              model: Account,
              as: "accountLedger",
              attributes: [],
            },
            {
              model: CreditNote,
              as: "creditNoLedger",
              attributes: [],
            },
            {
              model: DebitNote,
              as: "debitNoLedger",
              attributes: [],
            },
          ],
          where: queryData,
          order: [
            ["date", "ASC"],
            ["id", "ASC"],
          ],
        });

        if (data && data.length > 0) {
          data.forEach(ledger => {
            const ledgerEntry = {
              date: ledger.dataValues.date,
              debitAmount: ledger.dataValues.debitAmount,
              creditAmount: ledger.dataValues.creditAmount,
              particulars: ledger.dataValues.particulars,
              vchType: ledger.dataValues.vchType,
              vchNo: ledger.dataValues.vchNo,
            };
            allLedgerData.push(ledgerEntry);
          });
        }
      }
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Account Ledger');

    worksheet.getColumn("A").width = 20;
    worksheet.getColumn("B").width = 20;
    worksheet.getColumn("C").width = 20;
    worksheet.getColumn("D").width = 20;
    worksheet.getColumn("E").width = 20;
    worksheet.getColumn("F").width = 20;

    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "Account Ledger";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.mergeCells("A2:C2");
    worksheet.getCell("A2").value = companyData.companyname;
    worksheet.getCell("A2").font = { bold: true };

    worksheet.mergeCells("A3:C3");
    worksheet.getCell("A3").value = companyData.address1;
    worksheet.mergeCells("A4:C4");
    worksheet.getCell("A4").value = `${companyData.city}, ${companyData.state} - ${companyData.pincode}`;
    worksheet.mergeCells("A5:C5");
    worksheet.getCell("A5").value = `GSTIN/UIN: ${companyData.gstnumber}`;

    // If an account was found, include its details
    if (accounts) {
      worksheet.mergeCells("D2:F2");
      worksheet.getCell("D2").value = accounts.accountName;
      worksheet.getCell("D2").font = { bold: true };
      worksheet.getCell("D2").alignment = { horizontal: "right" };

      worksheet.mergeCells("D3:F3");
      worksheet.getCell("D3").value = accounts.accountDetail?.address1 ?? "N/A";
      worksheet.getCell("D3").alignment = { horizontal: "right" };

      worksheet.mergeCells("D4:F4");
      worksheet.getCell("D4").value =
        `${accounts.accountDetail?.city}, ${accounts.accountDetail?.state} - ${accounts.accountDetail?.pincode}` ??
        "N/A";
      worksheet.getCell("D4").alignment = { horizontal: "right" };

      worksheet.mergeCells("D5:F5");
      worksheet.getCell("D5").value = `GSTIN/UIN: ${
        accounts.accountDetail?.gstNumber ?? "Unregistered"
      }`;
      worksheet.getCell("D5").alignment = { horizontal: "right" };
    }
    worksheet.addRow([
      "Date",
      "Particulars",
      "Vch Type",
      "Vch No",
      "Debit Amount",
      "Credit Amount"
    ]).font = { bold: true };

    let totalDebit = 0
    let totalCredit = 0

    allLedgerData.forEach(ledger => {
      const date = ledger.date
      const Particulars = ledger.particulars
      const voucharetype = ledger.vchType
      const vouchareno = ledger.vchNo
      const DebitAmount = ledger.debitAmount
      const CreditAmount = ledger.creditAmount
      totalDebit += DebitAmount;
      totalCredit += CreditAmount;
      worksheet.addRow([date,Particulars,voucharetype,vouchareno, DebitAmount, CreditAmount]);

    });
    worksheet.addRow(["", "", "", "", totalDebit, totalCredit]);
    const closingBalance = totalCredit - totalDebit;
    worksheet.addRow(["", "", "", "Closing Balance", closingBalance >= 0 ? closingBalance : "", closingBalance < 0 ? Math.abs(closingBalance) : ""]);
    if (closingBalance >= 0) {
      totalDebit += closingBalance;
  } else {
      totalCredit += Math.abs(closingBalance);
  }
    worksheet.addRow(["", "", "", "", totalDebit, totalCredit]);

    const buffer = await workbook.xlsx.writeBuffer();
    const base64Data = buffer.toString('base64');

    res.json({
      status: "true",
      message: "Account Ledger generated successfully.",
      data: base64Data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_account_ledger_excel = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId; 
    const companyData = await Company.findByPk(companyId);

    let accounts;

    if (id) {
      accounts = await Account.findOne({
        where: { id, companyId, isActive: true },
        include: [{ model: AccountDetails, as: "accountDetail" }]
      });

      if (!accounts) {
        return res.status(404).json({
          status: "false",
          message: "Account Not Found.",
        });
      }
    } else {
      accounts = await Account.findAll({
        where: { companyId, isActive: true },
        include: [{ model: AccountDetails, as: "accountDetail" }]
      });

      if (!accounts || accounts.length === 0) {
        return res.status(404).json({
          status: "false",
          message: "No Active Accounts Found.",
        });
      }
    }

    const allLedgerData = [];

    if (accounts) {
      const accountIds = Array.isArray(accounts) ? accounts.map(a => a.id) : [accounts.id];

      for (const accountId of accountIds) {
        const queryData = { accountId, companyId };

        if (formDate && toDate) {
          queryData.date = {
            [Sequelize.Op.between]: [formDate, toDate],
          };
        }

        const data = await C_Ledger.findAll({
          where: queryData,
          attributes: [
            "date",
            [
              Sequelize.literal(`CASE
                WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`amount\`
                WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`totalMrp\`
                WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`mainTotal\`
                ELSE 0
              END`),
              "debitAmount",
            ],
            [
              Sequelize.literal(`CASE
                WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`amount\`
                WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`totalMrp\`
                WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`mainTotal\`
                ELSE 0
              END`),
              "creditAmount",
            ],
            [
              Sequelize.literal(`CASE
                WHEN salesLedgerCash.id IS NOT NULL THEN 'CASH'
                WHEN purchaseLedgerCash.id IS NOT NULL THEN 'CASH'
                WHEN receiptLedgerCash.id IS NOT NULL THEN 'CASH'
                WHEN paymentLedgerCash.id IS NOT NULL THEN 'CASH'
                WHEN creditNoLedgerCash.id IS NOT NULL THEN 'SALES'
                WHEN debitNoLedgerCash.id IS NOT NULL THEN 'PURCHASE'
                ELSE ''
              END`),
              "particulars",
            ],
            [
              Sequelize.literal(`CASE
                WHEN purchaseLedgerCash.id IS NOT NULL THEN 'PURCHASE'
                WHEN salesLedgerCash.id IS NOT NULL THEN 'SALES'
                WHEN receiptLedgerCash.id IS NOT NULL THEN 'Receipt'
                WHEN paymentLedgerCash.id IS NOT NULL THEN 'Payment'
                WHEN creditNoLedgerCash.id IS NOT NULL THEN 'CREDIT NOTE'
                WHEN debitNoLedgerCash.id IS NOT NULL THEN 'DEBIT NOTE'
                ELSE ''
              END`),
              "vchType",
            ],
            [
              Sequelize.literal(`CASE
                WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`purchaseNo\`
                WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`saleNo\`
                WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`receiptNo\`
                WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`paymentNo\`
                WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`creditnoteNo\`
                WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`debitnoteno\`
                ELSE ''
              END`),
              "vchNo",
            ],
            [
              Sequelize.literal(`CASE
                    WHEN purchaseLedgerCash.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN salesLedgerCash.id IS NOT NULL THEN 'TAX INVOICE'
                    WHEN receiptLedgerCash.id IS NOT NULL THEN 'Receipt'
                    WHEN paymentLedgerCash.id IS NOT NULL THEN 'Payment'
                    WHEN debitNoLedgerCash.id IS NOT NULL THEN 'DEBIT NOTE'
                    WHEN creditNoLedgerCash.id IS NOT NULL THEN 'CREDIT NOTE'
                    ELSE ''
                  END`),
              "vchType",
            ],
            [
              Sequelize.literal(`CASE
                    WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`purchaseNo\`
                    WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`saleNo\`
                    WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`receiptNo\`
                    WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`paymentNo\`
                    WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`creditnoteNo\`
                    WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`debitnoteno\`
                    ELSE ''
                  END`),
              "vchNo",
            ]
          ],
          include: [
            {
              model: C_PurchaseCash,
              as: "purchaseLedgerCash",
              attributes: [],
            },
            {
              model: C_Payment,
              as: "paymentLedgerCash",
              attributes: [],
            },
            {
              model: C_salesinvoice,
              as: "salesLedgerCash",
              attributes: [],
            },
            {
              model: C_Receipt,
              as: "receiptLedgerCash",
              attributes: [],
            },
            {
              model: Account,
              as: "accountLedgerCash",
              attributes: [],
            },
            {
              model: C_CreditNote,
              as: "creditNoLedgerCash",
              attributes: [],
            },
            {
              model: C_DebitNote,
              as: "debitNoLedgerCash",
              attributes: [],
            },
          ],
          where: queryData,
          order: [
            ["date", "ASC"],
            ["id", "ASC"],
          ],
        });

        if (data && data.length > 0) {
          data.forEach(ledger => {
            const ledgerEntry = {
              date: ledger.dataValues.date,
              debitAmount: ledger.dataValues.debitAmount,
              creditAmount: ledger.dataValues.creditAmount,
              particulars: ledger.dataValues.particulars,
              vchType: ledger.dataValues.vchType,
              vchNo: ledger.dataValues.vchNo,
            };
            allLedgerData.push(ledgerEntry);
          });
        }
      }
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Account Ledger Cash');

    worksheet.getColumn("A").width = 20;
    worksheet.getColumn("B").width = 20;
    worksheet.getColumn("C").width = 20;
    worksheet.getColumn("D").width = 20;
    worksheet.getColumn("E").width = 20;
    worksheet.getColumn("F").width = 20;

    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "Account Ledger Cash";
    worksheet.getCell("A1").font = { size: 16, bold: true };
    worksheet.getCell("A1").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    worksheet.mergeCells("A2:C2");
    worksheet.getCell("A2").value = companyData.companyname;
    worksheet.getCell("A2").font = { bold: true };

    worksheet.mergeCells("A3:C3");
    worksheet.getCell("A3").value = companyData.address1;
    worksheet.mergeCells("A4:C4");
    worksheet.getCell("A4").value = `${companyData.city}, ${companyData.state} - ${companyData.pincode}`;
    worksheet.mergeCells("A5:C5");
    worksheet.getCell("A5").value = `GSTIN/UIN: ${companyData.gstnumber}`;

    if (accounts) {
      worksheet.mergeCells("D2:F2");
      worksheet.getCell("D2").value = accounts.contactPersonName;
      worksheet.getCell("D2").font = { bold: true };
      worksheet.getCell("D2").alignment = { horizontal: "right" };

      worksheet.mergeCells("D3:F3");
      worksheet.getCell("D3").value = accounts.accountDetail?.address1 ?? "N/A";
      worksheet.getCell("D3").alignment = { horizontal: "right" };

      worksheet.mergeCells("D4:F4");
      worksheet.getCell("D4").value =
        `${accounts.accountDetail?.city}, ${accounts.accountDetail?.state} - ${accounts.accountDetail?.pincode}` ??
        "N/A";
      worksheet.getCell("D4").alignment = { horizontal: "right" };

      worksheet.mergeCells("D5:F5");
      worksheet.getCell("D5").value = `GSTIN/UIN: ${
        accounts.accountDetail?.gstNumber ?? "Unregistered"
      }`;
      worksheet.getCell("D5").alignment = { horizontal: "right" };
    }
    worksheet.addRow([
      "Date",
      "Particulars",
      "Vch Type",
      "Vch No",
      "Debit Amount",
      "Credit Amount"
    ]).font = { bold: true };
    let totalDebit = 0
    let totalCredit = 0

    allLedgerData.forEach(ledger => {
      const date = ledger.date
      const Particulars = ledger.particulars
      const voucharetype = ledger.vchType
      const vouchareno = ledger.vchNo
      const DebitAmount = ledger.debitAmount
      const CreditAmount = ledger.creditAmount
      totalDebit += DebitAmount;
      totalCredit += CreditAmount;
      worksheet.addRow([date,Particulars,voucharetype,vouchareno, DebitAmount, CreditAmount]);

    });
    worksheet.addRow(["", "", "", "", totalDebit, totalCredit]);
    const closingBalance = totalCredit - totalDebit;
    worksheet.addRow(["", "", "", "Closing Balance", closingBalance >= 0 ? closingBalance : "", closingBalance < 0 ? Math.abs(closingBalance) : ""]);
    if (closingBalance >= 0) {
      totalDebit += closingBalance;
    } else {
      totalCredit += Math.abs(closingBalance);
    }
    worksheet.addRow(["", "", "", "", totalDebit, totalCredit]);

    const buffer = await workbook.xlsx.writeBuffer();
    const base64Data = buffer.toString('base64');

    res.json({
      status: "true",
      message: "Account Ledger generated successfully.",
      data: base64Data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_account_ledger_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const queryData = { accountId: id, companyId: companyId };

    const accountExist = await Account.findOne({
      where: { id, companyId, isActive: true },
    });
    if (!accountExist) {
      return res.status(404).json({
        status: "false",
        message: "Account Not Found.",
      });
    }

    const user = await User.findOne({where: {
      role: ROLE.SUPER_ADMIN
    }});

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }

    const data = await C_Ledger.findAll({
      where: queryData,
      attributes: [
        "date",
        [
          Sequelize.literal(`CASE
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`amount\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`totalMrp\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`amount\`
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`totalMrp\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN salesLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN creditNoLedgerCash.id IS NOT NULL THEN 'SALES'
            WHEN debitNoLedgerCash.id IS NOT NULL THEN 'PURCHASE'
            ELSE ''
        END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'PURCHASE'
            WHEN salesLedgerCash.id IS NOT NULL THEN 'SALES'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'Receipt'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'Payment'
             WHEN creditNoLedgerCash.id IS NOT NULL THEN 'CREDIT NOTE'
            WHEN debitNoLedgerCash.id IS NOT NULL THEN 'DEBIT NOTE'
            ELSE ''
        END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`purchaseNo\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`saleNo\`
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`receiptNo\`
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`paymentNo\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`creditnoteNo\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`debitnoteno\`
            ELSE ''
        END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
          (
            SELECT
              IFNULL(SUM(
                IFNULL(CASE
                  WHEN receiptLedgerCash.id IS NOT NULL THEN receiptLedgerCash.amount
                  WHEN purchaseLedgerCash.id IS NOT NULL THEN purchaseLedgerCash.totalMrp
                  WHEN creditNoLedgerCash.id IS NOT NULL THEN creditNoLedgerCash.mainTotal
                  ELSE 0
                END, 0) -
                IFNULL(CASE
                  WHEN paymentLedgerCash.id IS NOT NULL THEN paymentLedgerCash.amount
                  WHEN salesLedgerCash.id IS NOT NULL THEN salesLedgerCash.totalMrp
                  WHEN debitNoLedgerCash.id IS NOT NULL THEN debitNoLedgerCash.mainTotal
                  ELSE 0
                END, 0)
              ), 0)
            FROM
              \`P_C_Ledgers\` AS cl2
              LEFT OUTER JOIN \`P_C_Payments\` AS paymentLedgerCash ON cl2.paymentId = paymentLedgerCash.id
              LEFT OUTER JOIN \`P_C_purchaseCashes\` AS purchaseLedgerCash ON cl2.purchaseId = purchaseLedgerCash.id
              LEFT OUTER JOIN \`P_C_Receipts\` AS receiptLedgerCash ON cl2.receiptId = receiptLedgerCash.id
              LEFT OUTER JOIN \`P_C_salesInvoices\` AS salesLedgerCash ON cl2.saleId = salesLedgerCash.id
              LEFT OUTER JOIN \`P_C_DebitNotes\` AS debitNoLedgerCash ON cl2.debitNoId = debitNoLedgerCash.id
              LEFT OUTER JOIN \`P_C_CreditNotes\` AS creditNoLedgerCash ON cl2.creditNoId = creditNoLedgerCash.id
            WHERE
              cl2.accountId = \`P_C_Ledger\`.\`accountId\`
              AND cl2.companyId = ${companyId}
              AND (cl2.date < \`P_C_Ledger\`.\`date\` OR (cl2.date = \`P_C_Ledger\`.\`date\` AND cl2.id < \`P_C_Ledger\`.\`id\`))
          )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_PurchaseCash,
          as: "purchaseLedgerCash",
          attributes: [],
        },
        {
          model: C_Payment,
          as: "paymentLedgerCash",
          attributes: [],
        },
        {
          model: C_Salesinvoice,
          as: "salesLedgerCash",
          attributes: [],
        },
        {
          model: C_Receipt,
          as: "receiptLedgerCash",
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedgerCash",
          attributes: [],
        },
        {
          model: C_CreditNote,
          as: "creditNoLedgerCash",
          attributes: [],
        },
        {
          model: C_DebitNote,
          as: "debitNoLedgerCash",
          attributes: [],
        },
      ],
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const openingBalance = data[0]?.dataValues?.openingBalance ?? 0;
    const ledgerArray = [...data];
    if (+openingBalance !== 0) {
      ledgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }
    const groupedRecords = {};
    const fromFinancialYear = getFinancialYear(formDate);
    const toFinancialYear = getFinancialYear(toDate);

    let currentFinancialYear = fromFinancialYear;

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    while (currentFinancialYear <= toFinancialYear) {
      const [startYear, endYear] = currentFinancialYear.split("-").map(Number);
      const filteredRecords = filterRecordsByFinancialYear(
        ledgerArray,
        startYear,
        endYear
      );
      const newOpeningBalance = previousClosingBalance.amount;

      if (newOpeningBalance > 0) {
        filteredRecords.unshift({
          date: `${startYear}-04-01`,
          debitAmount:
            previousClosingBalance.type === "credit" ? newOpeningBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? newOpeningBalance : 0,
          particulars: "Opening Balance",
          vchType: "",
          vchNo: "",
        });
      }

      const totals = filteredRecords.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;

      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const records = filteredRecords.reduce((acc, obj) => {
        const dateKey = obj.date;
        const date = new Date(dateKey);
        const formattedDate = `${date.getDate()}-${date.toLocaleString(
          "default",
          {
            month: "short",
          }
        )}-${String(date.getFullYear()).slice(-2)}`;

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(obj);
        return acc;
      }, {});

      const daterang = getFinancialYearDates(
        startYear,
        endYear,
        formDate,
        toDate
      );
      Object.keys(records).forEach((date) => {
        records[date] = records[date].map((entry) => {
          if (entry.dataValues) {
            return { ...entry.dataValues, date: entry.date };
          }
          return entry;
        });
      });
      groupedRecords[currentFinancialYear] = {
        dateRange: daterang,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records,
      };
      currentFinancialYear = `${startYear + 1}-${endYear + 1}`;
    }
    const html = await renderFile(
      path.join(__dirname, "../views/accountCashLedger.ejs"),
      { data: { form: user, to: accountExist, years: groupedRecords } }
    );
    htmlToPdf
      .generatePdf({ content: html }, { printBackground: true, format: "A4" })
      .then((pdf) => {
        const base64String = pdf.toString("base64");
        return res.status(200).json({
          status: "Success",
          message: "pdf create successFully",
          data: base64String,
        });
      });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.C_account_ledger_jpg = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const queryData = { accountId: id, companyId: companyId };

    const accountExist = await Account.findOne({
      where: { id, companyId, isActive: true },
    });
    if (!accountExist) {
      return res.status(404).json({
        status: "false",
        message: "Account Not Found.",
      });
    }

    const user = await User.findOne({where: {
      role: ROLE.SUPER_ADMIN
    }});

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }

    const data = await C_Ledger.findAll({
      where: queryData,
      attributes: [
        "date",
        [
          Sequelize.literal(`CASE
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`amount\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`totalMrp\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`amount\`
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`totalMrp\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN salesLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN creditNoLedgerCash.id IS NOT NULL THEN 'SALES'
            WHEN debitNoLedgerCash.id IS NOT NULL THEN 'PURCHASE'
            ELSE ''
        END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'PURCHASE'
            WHEN salesLedgerCash.id IS NOT NULL THEN 'SALES'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'Receipt'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'Payment'
             WHEN creditNoLedgerCash.id IS NOT NULL THEN 'CREDIT NOTE'
            WHEN debitNoLedgerCash.id IS NOT NULL THEN 'DEBIT NOTE'
            ELSE ''
        END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`purchaseNo\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`saleNo\`
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`receiptNo\`
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`paymentNo\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`creditnoteNo\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`debitnoteno\`
            ELSE ''
        END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
          (
            SELECT
              IFNULL(SUM(
                IFNULL(CASE
                  WHEN receiptLedgerCash.id IS NOT NULL THEN receiptLedgerCash.amount
                  WHEN purchaseLedgerCash.id IS NOT NULL THEN purchaseLedgerCash.totalMrp
                  WHEN creditNoLedgerCash.id IS NOT NULL THEN creditNoLedgerCash.mainTotal
                  ELSE 0
                END, 0) -
                IFNULL(CASE
                  WHEN paymentLedgerCash.id IS NOT NULL THEN paymentLedgerCash.amount
                  WHEN salesLedgerCash.id IS NOT NULL THEN salesLedgerCash.totalMrp
                  WHEN debitNoLedgerCash.id IS NOT NULL THEN debitNoLedgerCash.mainTotal
                  ELSE 0
                END, 0)
              ), 0)
            FROM
              \`P_C_Ledgers\` AS cl2
              LEFT OUTER JOIN \`P_C_Payments\` AS paymentLedgerCash ON cl2.paymentId = paymentLedgerCash.id
              LEFT OUTER JOIN \`P_C_purchaseCashes\` AS purchaseLedgerCash ON cl2.purchaseId = purchaseLedgerCash.id
              LEFT OUTER JOIN \`P_C_Receipts\` AS receiptLedgerCash ON cl2.receiptId = receiptLedgerCash.id
              LEFT OUTER JOIN \`P_C_salesInvoices\` AS salesLedgerCash ON cl2.saleId = salesLedgerCash.id
              LEFT OUTER JOIN \`P_C_DebitNotes\` AS debitNoLedgerCash ON cl2.debitNoId = debitNoLedgerCash.id
              LEFT OUTER JOIN \`P_C_CreditNotes\` AS creditNoLedgerCash ON cl2.creditNoId = creditNoLedgerCash.id
            WHERE
              cl2.accountId = \`P_C_Ledger\`.\`accountId\`
              AND cl2.companyId = ${companyId}
              AND (cl2.date < \`P_C_Ledger\`.\`date\` OR (cl2.date = \`P_C_Ledger\`.\`date\` AND cl2.id < \`P_C_Ledger\`.\`id\`))
          )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_PurchaseCash,
          as: "purchaseLedgerCash",
          attributes: [],
        },
        {
          model: C_Payment,
          as: "paymentLedgerCash",
          attributes: [],
        },
        {
          model: C_Salesinvoice,
          as: "salesLedgerCash",
          attributes: [],
        },
        {
          model: C_Receipt,
          as: "receiptLedgerCash",
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedgerCash",
          attributes: [],
        },
        {
          model: C_CreditNote,
          as: "creditNoLedgerCash",
          attributes: [],
        },
        {
          model: C_DebitNote,
          as: "debitNoLedgerCash",
          attributes: [],
        },
      ],
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const openingBalance = data[0]?.dataValues?.openingBalance ?? 0;
    const ledgerArray = [...data];
    if (+openingBalance !== 0) {
      ledgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }
    const groupedRecords = {};
    const fromFinancialYear = getFinancialYear(formDate);
    const toFinancialYear = getFinancialYear(toDate);

    let currentFinancialYear = fromFinancialYear;

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    while (currentFinancialYear <= toFinancialYear) {
      const [startYear, endYear] = currentFinancialYear.split("-").map(Number);
      const filteredRecords = filterRecordsByFinancialYear(
        ledgerArray,
        startYear,
        endYear
      );
      const newOpeningBalance = previousClosingBalance.amount;

      if (newOpeningBalance > 0) {
        filteredRecords.unshift({
          date: `${startYear}-04-01`,
          debitAmount:
            previousClosingBalance.type === "credit" ? newOpeningBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? newOpeningBalance : 0,
          particulars: "Opening Balance",
          vchType: "",
          vchNo: "",
        });
      }

      const totals = filteredRecords.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;

      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const records = filteredRecords.reduce((acc, obj) => {
        const dateKey = obj.date;
        const date = new Date(dateKey);
        const formattedDate = `${date.getDate()}-${date.toLocaleString(
          "default",
          {
            month: "short",
          }
        )}-${String(date.getFullYear()).slice(-2)}`;

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(obj);
        return acc;
      }, {});

      const daterang = getFinancialYearDates(
        startYear,
        endYear,
        formDate,
        toDate
      );
      Object.keys(records).forEach((date) => {
        records[date] = records[date].map((entry) => {
          if (entry.dataValues) {
            return { ...entry.dataValues, date: entry.date };
          }
          return entry;
        });
      });
      groupedRecords[currentFinancialYear] = {
        dateRange: daterang,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records,
      };
      currentFinancialYear = `${startYear + 1}-${endYear + 1}`;
    }
    const html = await renderFile(
      path.join(__dirname, "../views/accountCashLedger.ejs"),
      { data: { form: user, to: accountExist, years: groupedRecords } }
    );
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const base64String = await page.screenshot({
      type: "jpeg",
      fullPage: true,
      encoding: "base64",
    });

    await browser.close();
    return res.status(200).json({
      status: "Success",
      message: "JPG created successfully",
      data: base64String,
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.C_account_ledger_html = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const queryData = { accountId: id, companyId: companyId };

    const accountExist = await Account.findOne({
      where: { id, companyId, isActive: true },
    });
    if (!accountExist) {
      return res.status(404).json({
        status: "false",
        message: "Account Not Found.",
      });
    }

    const user = await User.findOne({where: {
      role: ROLE.SUPER_ADMIN
    }});

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }

    const data = await C_Ledger.findAll({
      where: queryData,
      attributes: [
        "date",
        [
          Sequelize.literal(`CASE
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`amount\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`totalMrp\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`amount\`
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`totalMrp\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`mainTotal\`
            ELSE 0
        END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN salesLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'CASH'
            WHEN creditNoLedgerCash.id IS NOT NULL THEN 'SALES'
            WHEN debitNoLedgerCash.id IS NOT NULL THEN 'PURCHASE'
            ELSE ''
        END`),
          "particulars",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN 'PURCHASE'
            WHEN salesLedgerCash.id IS NOT NULL THEN 'SALES'
            WHEN receiptLedgerCash.id IS NOT NULL THEN 'Receipt'
            WHEN paymentLedgerCash.id IS NOT NULL THEN 'Payment'
             WHEN creditNoLedgerCash.id IS NOT NULL THEN 'CREDIT NOTE'
            WHEN debitNoLedgerCash.id IS NOT NULL THEN 'DEBIT NOTE'
            ELSE ''
        END`),
          "vchType",
        ],
        [
          Sequelize.literal(`CASE
            WHEN purchaseLedgerCash.id IS NOT NULL THEN \`purchaseLedgerCash\`.\`purchaseNo\`
            WHEN salesLedgerCash.id IS NOT NULL THEN \`salesLedgerCash\`.\`saleNo\`
            WHEN receiptLedgerCash.id IS NOT NULL THEN \`receiptLedgerCash\`.\`receiptNo\`
            WHEN paymentLedgerCash.id IS NOT NULL THEN \`paymentLedgerCash\`.\`paymentNo\`
            WHEN creditNoLedgerCash.id IS NOT NULL THEN \`creditNoLedgerCash\`.\`creditnoteNo\`
            WHEN debitNoLedgerCash.id IS NOT NULL THEN \`debitNoLedgerCash\`.\`debitnoteno\`
            ELSE ''
        END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`
          (
            SELECT
              IFNULL(SUM(
                IFNULL(CASE
                  WHEN receiptLedgerCash.id IS NOT NULL THEN receiptLedgerCash.amount
                  WHEN purchaseLedgerCash.id IS NOT NULL THEN purchaseLedgerCash.totalMrp
                  WHEN creditNoLedgerCash.id IS NOT NULL THEN creditNoLedgerCash.mainTotal
                  ELSE 0
                END, 0) -
                IFNULL(CASE
                  WHEN paymentLedgerCash.id IS NOT NULL THEN paymentLedgerCash.amount
                  WHEN salesLedgerCash.id IS NOT NULL THEN salesLedgerCash.totalMrp
                  WHEN debitNoLedgerCash.id IS NOT NULL THEN debitNoLedgerCash.mainTotal
                  ELSE 0
                END, 0)
              ), 0)
            FROM
              \`P_C_Ledgers\` AS cl2
              LEFT OUTER JOIN \`P_C_Payments\` AS paymentLedgerCash ON cl2.paymentId = paymentLedgerCash.id
              LEFT OUTER JOIN \`P_C_purchaseCashes\` AS purchaseLedgerCash ON cl2.purchaseId = purchaseLedgerCash.id
              LEFT OUTER JOIN \`P_C_Receipts\` AS receiptLedgerCash ON cl2.receiptId = receiptLedgerCash.id
              LEFT OUTER JOIN \`P_C_salesInvoices\` AS salesLedgerCash ON cl2.saleId = salesLedgerCash.id
              LEFT OUTER JOIN \`P_C_DebitNotes\` AS debitNoLedgerCash ON cl2.debitNoId = debitNoLedgerCash.id
              LEFT OUTER JOIN \`P_C_CreditNotes\` AS creditNoLedgerCash ON cl2.creditNoId = creditNoLedgerCash.id
            WHERE
              cl2.accountId = \`P_C_Ledger\`.\`accountId\`
              AND cl2.companyId = ${companyId}
              AND (cl2.date < \`P_C_Ledger\`.\`date\` OR (cl2.date = \`P_C_Ledger\`.\`date\` AND cl2.id < \`P_C_Ledger\`.\`id\`))
          )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_PurchaseCash,
          as: "purchaseLedgerCash",
          attributes: [],
        },
        {
          model: C_Payment,
          as: "paymentLedgerCash",
          attributes: [],
        },
        {
          model: C_Salesinvoice,
          as: "salesLedgerCash",
          attributes: [],
        },
        {
          model: C_Receipt,
          as: "receiptLedgerCash",
          attributes: [],
        },
        {
          model: Account,
          as: "accountLedgerCash",
          attributes: [],
        },
        {
          model: C_CreditNote,
          as: "creditNoLedgerCash",
          attributes: [],
        },
        {
          model: C_DebitNote,
          as: "debitNoLedgerCash",
          attributes: [],
        },
      ],
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const openingBalance = data[0]?.dataValues?.openingBalance ?? 0;
    const ledgerArray = [...data];
    if (+openingBalance !== 0) {
      ledgerArray.unshift({
        date: formDate,
        debitAmount:
          openingBalance < 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        creditAmount:
          openingBalance > 0 ? +Math.abs(openingBalance).toFixed(2) : 0,
        particulars: "Opening Balance",
        vchType: "",
        vchNo: "",
        openingBalance: 0,
      });
    }
    const groupedRecords = {};
    const fromFinancialYear = getFinancialYear(formDate);
    const toFinancialYear = getFinancialYear(toDate);

    let currentFinancialYear = fromFinancialYear;

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    while (currentFinancialYear <= toFinancialYear) {
      const [startYear, endYear] = currentFinancialYear.split("-").map(Number);
      const filteredRecords = filterRecordsByFinancialYear(
        ledgerArray,
        startYear,
        endYear
      );
      const newOpeningBalance = previousClosingBalance.amount;

      if (newOpeningBalance > 0) {
        filteredRecords.unshift({
          date: `${startYear}-04-01`,
          debitAmount:
            previousClosingBalance.type === "credit" ? newOpeningBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? newOpeningBalance : 0,
          particulars: "Opening Balance",
          vchType: "",
          vchNo: "",
        });
      }

      const totals = filteredRecords.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;

      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const records = filteredRecords.reduce((acc, obj) => {
        const dateKey = obj.date;
        const date = new Date(dateKey);
        const formattedDate = `${date.getDate()}-${date.toLocaleString(
          "default",
          {
            month: "short",
          }
        )}-${String(date.getFullYear()).slice(-2)}`;

        if (!acc[formattedDate]) {
          acc[formattedDate] = [];
        }
        acc[formattedDate].push(obj);
        return acc;
      }, {});

      const daterang = getFinancialYearDates(
        startYear,
        endYear,
        formDate,
        toDate
      );
      Object.keys(records).forEach((date) => {
        records[date] = records[date].map((entry) => {
          if (entry.dataValues) {
            return { ...entry.dataValues, date: entry.date };
          }
          return entry;
        });
      });
      groupedRecords[currentFinancialYear] = {
        dateRange: daterang,
        totals,
        totalAmount:
          totals.totalCredit < totals.totalDebit
            ? totals.totalDebit
            : totals.totalCredit,
        closingBalance,
        records,
      };
      currentFinancialYear = `${startYear + 1}-${endYear + 1}`;
    }
    const html = await renderFile(
      path.join(__dirname, "../views/accountCashLedger.ejs"),
      { data: { form: user, to: accountExist, years: groupedRecords } }
    );
    const base64HTML = Buffer.from(html).toString("base64");

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: "Success",
      message: "Html Document Created Successfully",
      data: base64HTML,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ status: "false", message: "Internal Server Error." });
  }
};

exports.C_passbook = async (req, res) => {
  try {
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const queryData = {
      companyId: companyId,
    };

    const company = await Company.findByPk(companyId);

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }

    const data = await BankLedger.findAll({
      where: queryData,
      attributes: [
        "date",
        "id",
        [
          Sequelize.literal(`CASE
            WHEN bankPayment.id IS NOT NULL THEN \`bankPayment\`.\`amount\`
            ELSE 0
        END`),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN bankReceipt.id IS NOT NULL THEN \`bankReceipt\`.\`amount\`
            ELSE 0
        END`),
          "creditAmount",
        ],
        [
          Sequelize.literal(`CASE
            WHEN bankReceipt.id IS NOT NULL THEN \`bankReceipt\`.\`paymentType\`
            WHEN bankPayment.id IS NOT NULL THEN \`bankPayment\`.\`paymentType\`
            ELSE ''
        END`),
          "details",
        ],
        [
          Sequelize.literal(`CASE
            WHEN bankPayment.id IS NOT NULL THEN \`bankPayment->accountPayment\`.\`accountName\`
            WHEN bankReceipt.id IS NOT NULL THEN \`bankReceipt->accountReceipt\`.\`accountName\`
            ELSE ''
        END`),
          "party",
        ],
        [
          Sequelize.literal(`CASE
            WHEN bankPayment.id IS NOT NULL THEN \`bankPayment\`.\`voucherno\`
            WHEN bankReceipt.id IS NOT NULL THEN \`bankReceipt\`.\`voucherno\`
            ELSE ''
        END`),
          "vchNo",
        ],
        [
          Sequelize.literal(`CASE
            WHEN bankReceipt.id IS NOT NULL THEN \`bankReceipt->bankUpdateUser\`.\`username\`
            WHEN bankPayment.id IS NOT NULL THEN \`bankPayment->paymentUpdateUser\`.\`username\`
            ELSE ''
        END`),
          "username",
        ],
      ],
      include: [
        {
          model: Receipt,
          as: "bankReceipt",
          include: [
            {
              model: Account,
              as: "accountReceipt",
            },
            {
              model: CompanyBankDetails,
              as: "receiptBankAccount",
              attributes: [],
            },
            {
              model: User,
              as: "bankUpdateUser",
            },
          ],
          attributes: [],
        },
        {
          model: Payment,
          as: "bankPayment",
          include: [
            {
              model: Account,
              as: "accountPayment",
            },
            {
              model: CompanyBankDetails,
              as: "paymentBankAccount",
              attributes: [],
            },
            {
              model: User,
              as: "paymentUpdateUser",
            },
          ],
          attributes: [],
        },
      ],
      order: [["date", "ASC"]],
    });

    const fromDateObj = new Date(formDate);
    const toDateObj = new Date(toDate);

    function generateDateRange(from, to) {
      const dates = [];
      let currentDate = new Date(from);

      while (currentDate <= to) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    }

    const openingBalanceData = await BankLedger.findOne({
      where: {
        companyId: companyId,
        date: {
          [Sequelize.Op.lt]: formDate,
        },
      },
      attributes: [
        "id",
        "date",
        [
          Sequelize.literal(`
          (
        SELECT
            IFNULL(SUM(
                IFNULL(CASE
                  WHEN bankReceipt.id IS NOT NULL THEN \`bankReceipt\`.\`amount\`
            ELSE 0
                END, 0) -
                IFNULL(CASE
                  WHEN bankPayment.id IS NOT NULL THEN \`bankPayment\`.\`amount\`
                  ELSE 0
                END, 0)
              ), 0
            )
        FROM
            P_BankLedgers AS cb2
        LEFT OUTER JOIN P_Receipts AS bankReceipt ON cb2.receiptId = bankReceipt.id
        LEFT OUTER JOIN P_Payments AS bankPayment ON cb2.paymentId = bankPayment.id
        WHERE
            cb2.companyId = ${companyId}
            AND (
                cb2.date <= P_BankLedger.date
                OR (
                    cb2.date = P_BankLedger.date
                    AND cb2.id <= P_BankLedger.id
                )
            )
    )`),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: Receipt,
          as: "bankReceipt",
          include: [
            {
              model: Account,
              as: "accountReceipt",
            },
            {
              model: CompanyBankDetails,
              as: "receiptBankAccount",
              attributes: [],
            },
            {
              model: User,
              as: "bankUpdateUser",
            },
          ],
          attributes: [],
        },
        {
          model: Payment,
          as: "bankPayment",
          include: [
            {
              model: Account,
              as: "accountPayment",
            },
            {
              model: CompanyBankDetails,
              as: "paymentBankAccount",
              attributes: [],
            },
            {
              model: User,
              as: "paymentUpdateUser",
            },
          ],
          attributes: [],
        },
      ],
      order: [["date", "DESC"]],
    });

    const mainOpeningBalance =
      openingBalanceData?.dataValues?.openingBalance ?? 0;

      console.log(mainOpeningBalance, "Main Balance")

    const allDates = generateDateRange(fromDateObj, toDateObj);

    const existingDataGrouped = data.reduce((acc, record) => {
      const date = record.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(record);
      return acc;
    }, {});

    let previousClosingBalance = {
      type: "credit",
      amount: 0,
    };

    const result = allDates.reduce((acc, date, index) => {
      const groupDateData = existingDataGrouped[date] || [];
      const ledgerArray = [...groupDateData];

      if (index === 0 && mainOpeningBalance > 0) {
        ledgerArray.unshift({
          date: date,
          debitAmount:
            mainOpeningBalance < 0
              ? +Math.abs(mainOpeningBalance).toFixed(2)
              : 0,
          creditAmount:
            mainOpeningBalance > 0
              ? +Math.abs(mainOpeningBalance).toFixed(2)
              : 0,
          details: "Opening Balance",
          party: "",
          id: null,
          username: "",
          vchNo: "",
        });
      }

      const openingBalance = previousClosingBalance.amount;

      if (openingBalance > 0) {
        ledgerArray.unshift({
          date: date,
          debitAmount:
            previousClosingBalance.type === "credit" ? openingBalance : 0,
          creditAmount:
            previousClosingBalance.type === "debit" ? openingBalance : 0,
          details: "Opening Balance",
          party: "",
          id: null,
          username: "",
          vchNo: "",
        });
      }

      const totals = ledgerArray.reduce(
        (acc, ledger) => {
          if (ledger.dataValues) {
            acc.totalCredit += ledger.dataValues.creditAmount || 0;
            acc.totalDebit += ledger.dataValues.debitAmount || 0;
          } else {
            acc.totalCredit += ledger.creditAmount || 0;
            acc.totalDebit += ledger.debitAmount || 0;
          }
          return acc;
        },
        { totalCredit: 0, totalDebit: 0 }
      );

      const totalCredit = totals.totalCredit;
      const totalDebit = totals.totalDebit;
      const closingBalanceAmount = totalDebit - totalCredit;
      const closingBalance = {
        type: closingBalanceAmount < 0 ? "debit" : "credit",
        amount: +Math.abs(closingBalanceAmount).toFixed(2),
      };

      previousClosingBalance = closingBalance;

      const totalAmount =
        totals.totalCredit < totals.totalDebit
          ? totals.totalDebit
          : totals.totalCredit;

      acc[date] = {
        totalAmount,
        totals,
        closingBalance,
        records: ledgerArray,
      };

      return acc;
    }, {});

    return res.status(200).json({
      status: "true",
      message: "Passbook Data Fetch Successfully.",
      data: {
        form: company,
        records: result,
      },
    });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

function getFinancialYear(date) {
  const givenDate = new Date(date);
  const year = givenDate.getFullYear();
  const month = givenDate.getMonth() + 1;
  if (month >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
}

function filterRecordsByFinancialYear(records, startYear, endYear) {
  const startDate = new Date(`${startYear}-04-01`);
  const endDate = new Date(`${endYear}-03-31`);

  return records.filter((record) => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
}

function getFinancialYearDates(startYear, endYear, fromDate, toDate) {
  const financialYearStart = new Date(`${startYear}-04-01`);
  const financialYearEnd = new Date(`${endYear}-03-31`);

  const from = new Date(fromDate);
  const to = new Date(toDate);

  const validFromDate =
    from >= financialYearStart && from <= financialYearEnd
      ? from
      : new Date(`${startYear}-04-01`);

  const validToDate =
    to >= financialYearStart && to <= financialYearEnd
      ? to
      : new Date(`${endYear}-03-31`);

  const formDateFormat = `${validFromDate.getDate()}-${validFromDate.toLocaleString(
    "default",
    { month: "short" }
  )}-${String(validFromDate.getFullYear()).slice(-2)}`;
  const toDateFormat = `${validToDate.getDate()}-${validToDate.toLocaleString(
    "default",
    { month: "short" }
  )}-${String(validToDate.getFullYear()).slice(-2)}`;

  return `${formDateFormat} to ${toDateFormat}`;
}
