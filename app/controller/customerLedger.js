const { Sequelize, Op } = require("sequelize");
const C_customerLedger = require("../models/C_customerLedger");
const C_receiveCash = require("../models/C_Receipt");
const C_salesinvoice = require("../models/C_salesinvoice");
const C_customer = require("../models/C_customer");
const customerLedger = require("../models/customerLedger");
const salesInvoice = require("../models/salesInvoice");
const customer = require("../models/customer");
const Company = require("../models/company");
const receiveBank = require("../models/Receipt");
const CompanyBankDetails = require("../models/companyBankDetails");
const {renderFile} = require("ejs");
const path = require("node:path");
const htmlToPdf = require("html-pdf-node");
const User = require("../models/user");

/*=============================================================================================================
                                           Type C API
 =========================================================================================================== */

exports.C_get_customerLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;

    const CashCustomerData = await C_customer.findOne({ where: { id, companyId } });
    if(!CashCustomerData){
      return res.status(404).json({
        status: "false",
        message: "Customer Cash Not Found."
      })
    }
    const superAdminUser = await User.findOne({
      where: {
        role: "Super Admin"
      },
      attributes: ['username']
    })

    const queryData = { customerId: id };

    if (companyId) {
      queryData.companyId = companyId;
    }

    if (formDate && toDate) {
      queryData.date = {
        [Op.between]: [formDate, toDate],
      };
    }

    const data = await C_customerLedger.findAll({
      attributes: [
        "customerId",
        "date",
        "id",
        [Sequelize.literal("IFNULL(receiceLedger.amount, 0)"), "creditAmount"],
        [
          Sequelize.literal("IFNULL(invoiceLedger.totalMrp, 0)"),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN 'SALES CASH'
        WHEN receiceLedger.id IS NOT NULL THEN 'CASH'
        ELSE ''
      END`),
          "particulars"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN 'CASH'
        WHEN receiceLedger.id IS NOT NULL THEN 'Payment'
        ELSE ''
      END`),
          "vchType"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN \`invoiceLedger\`.\`saleNo\`
        WHEN receiceLedger.id IS NOT NULL THEN \`receiceLedger\`.\`receiptNo\`
        ELSE ''
      END`),
          "vchNo"
        ],
      ],
      include: [
        {
          model: C_salesinvoice,
          as: "invoiceLedger",
          attributes:[]
        },
        {
          model: C_receiveCash,
          as: "receiceLedger",
          attributes:[]
        },
        {
          model: C_customer,
          as: "customerData",
          attributes:[]
        },
      ],
      where: queryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
      replacements: { companyId },
    });
    const open = await C_customerLedger.findOne({
      where: {
        id: data[0]?.id ?? 0,
        companyId: companyId
      },
      attributes: [
        [
          Sequelize.literal(`
            (
              SELECT
                IFNULL(SUM(IFNULL(receiceLedger.amount, 0) - IFNULL(invoiceLedger.totalMrp, 0)), 0)
              FROM
                \`P_C_customerLedgers\` AS cl2
                LEFT OUTER JOIN \`P_C_salesInvoices\` AS invoiceLedger ON cl2.creditId = invoiceLedger.id
                LEFT OUTER JOIN \`P_C_receiveCashes\` AS receiceLedger ON cl2.debitId = receiceLedger.id
              WHERE
                cl2.customerId = \`P_C_customerLedger\`.\`customerId\`
                AND cl2.companyId = ${companyId}
                AND (cl2.date < \`P_C_customerLedger\`.\`date\` OR (cl2.date = \`P_C_customerLedger\`.\`date\` AND cl2.id < \`P_C_customerLedger\`.\`id\`))
            )
          `),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_salesinvoice,
          as: "invoiceLedger",
          attributes:[]
        },
        {
          model: C_receiveCash,
          as: "receiceLedger",
          attributes:[]
        },
        {
          model: C_customer,
          as: "customerData",
          attributes:[]
        },
      ],
    })

    const cashCustomerLedgerArray = [...data]
    if (+open?.dataValues?.openingBalance ?? 0 !== 0) {
      cashCustomerLedgerArray.unshift({
        "customerId": +id,
        "id": null,
        "date": formDate,
        "creditAmount": open.dataValues.openingBalance > 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "debitAmount": open.dataValues.openingBalance < 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "particulars": "Opening Balance",
        "vchType": "",
        "vchNo": "",
      })
    }
    const totals = cashCustomerLedgerArray.reduce((acc, ledger) => {
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
    const records = cashCustomerLedgerArray.reduce((acc, obj) => {
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
        message: "Customer Ledger Data Fetch Successfully",
        data: {form: superAdminUser,to:CashCustomerData,dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records},
      })

  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
/*=============================================================================================================
                                          without Type C API
=========================================================================================================== */
exports.get_customerLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const customerData = await customer.findOne({ where: { id, companyId } });
    if(!customerData){
      return res.status(404).json({
        status: "false",
        message: "Customer Not Found."
      })
    }
    const company = await Company.findOne({where: {id: companyId}})
    const queryData = { customerId: id };

    if (companyId) {
      queryData.companyId = companyId;
    }

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }

    const data = await customerLedger.findAll({
      attributes: [
        "customerId",
        "date",
        "id",
        [Sequelize.literal("IFNULL(receiveCustomer.amount, 0)"), "creditAmount"],
        [
          Sequelize.literal("IFNULL(invoiceCustomer.mainTotal, 0)"),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceCustomer.id IS NOT NULL THEN 'SALES GST'
        WHEN receiveCustomer.id IS NOT NULL THEN \`receiveCustomer->receiveBank\`.\`bankname\`
        ELSE ''
      END`),
          "particulars"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceCustomer.id IS NOT NULL THEN 'TAX INVOICE'
        WHEN receiveCustomer.id IS NOT NULL THEN 'Receipt'
        ELSE ''
      END`),
          "vchType"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceCustomer.id IS NOT NULL THEN \`invoiceCustomer\`.\`invoiceno\`
        WHEN receiveCustomer.id IS NOT NULL THEN \`receiveCustomer\`.\`voucherno\`
        ELSE ''
      END`),
          "vchNo"
        ],
      ],
      include: [
        {
          model: salesInvoice,
          as: "invoiceCustomer",
          attributes:[]
        },
        {
          model: receiveBank,
          as: "receiveCustomer",
          attributes:[],
          include: [{model: CompanyBankDetails, as: "receiveBank", attributes:[] }]
        },
        {
          model: customer,
          as: "customerData",
          attributes:[]
        },
      ],
      where: queryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const open = await customerLedger.findOne({
      where: {
        id: data[0]?.id ?? 0,
        companyId: companyId
      },
      attributes: [
        [
          Sequelize.literal(`
            (
              SELECT
                IFNULL(SUM(IFNULL(receiveCustomer.amount, 0) - IFNULL(invoiceCustomer.mainTotal, 0)), 0)
              FROM
                \`P_customerLedgers\` AS cl2
                LEFT OUTER JOIN \`P_salesInvoices\` AS invoiceCustomer ON cl2.creditId = invoiceCustomer.id
                LEFT OUTER JOIN \`P_receiveBanks\` AS receiveCustomer ON cl2.debitId = receiveCustomer.id
              WHERE
                cl2.customerId = \`P_customerLedger\`.\`customerId\`
                AND cl2.companyId = ${companyId}
                AND (cl2.date < \`P_customerLedger\`.\`date\` OR (cl2.date = \`P_customerLedger\`.\`date\` AND cl2.id < \`P_customerLedger\`.\`id\`))
            )
          `),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: salesInvoice,
          as: "invoiceCustomer",
          attributes:[]
        },
        {
          model: receiveBank,
          as: "receiveCustomer",
          attributes:[],
          include: [{model: CompanyBankDetails, as: "receiveBank", attributes:[] }]
        },
        {
          model: customer,
          as: "customerData",
          attributes:[]
        },
      ],
    })

    const customerLedgerArray = [...data]
    if (+open?.dataValues?.openingBalance ?? 0 !== 0) {
      customerLedgerArray.unshift({
        "customerId": +id,
        "id": null,
        "date": formDate,
        "creditAmount": open.dataValues.openingBalance > 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "debitAmount": open.dataValues.openingBalance < 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "particulars": "Opening Balance",
        "vchType": "",
        "vchNo": "",
      })
    }

    const totals = customerLedgerArray.reduce((acc, ledger) => {
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
    const records = customerLedgerArray.reduce((acc, obj) => {
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
      message: "Customer Ledger Data Fetch Successfully.",
      data: {form: company,to: customerData ,dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records},
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_customerLedgerPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const customerData = await customer.findOne({ where: { id, companyId } });
    if(!customerData){
      return res.status(404).json({
        status: "false",
        message: "Customer Not Found."
      })
    }
    const company = await Company.findOne({where: {id: companyId}})
    const queryData = { customerId: id };

    if (companyId) {
      queryData.companyId = companyId;
    }

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }

    const data = await customerLedger.findAll({
      attributes: [
        "customerId",
        "date",
        "id",
        [Sequelize.literal("IFNULL(receiveCustomer.amount, 0)"), "creditAmount"],
        [
          Sequelize.literal("IFNULL(invoiceCustomer.mainTotal, 0)"),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceCustomer.id IS NOT NULL THEN 'SALES GST'
        WHEN receiveCustomer.id IS NOT NULL THEN \`receiveCustomer->receiveBank\`.\`bankname\`
        ELSE ''
      END`),
          "particulars"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceCustomer.id IS NOT NULL THEN 'TAX INVOICE'
        WHEN receiveCustomer.id IS NOT NULL THEN 'Receipt'
        ELSE ''
      END`),
          "vchType"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceCustomer.id IS NOT NULL THEN \`invoiceCustomer\`.\`invoiceno\`
        WHEN receiveCustomer.id IS NOT NULL THEN \`receiveCustomer\`.\`voucherno\`
        ELSE ''
      END`),
          "vchNo"
        ],
      ],
      include: [
        {
          model: salesInvoice,
          as: "invoiceCustomer",
          attributes:[]
        },
        {
          model: receiveBank,
          as: "receiveCustomer",
          attributes:[],
          include: [{model: CompanyBankDetails, as: "receiveBank", attributes:[] }]
        },
        {
          model: customer,
          as: "customerData",
          attributes:[]
        },
      ],
      where: queryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const open = await customerLedger.findOne({
      where: {
        id: data[0]?.id ?? 0,
        companyId: companyId
      },
      attributes: [
        [
          Sequelize.literal(`
            (
              SELECT
                IFNULL(SUM(IFNULL(receiveCustomer.amount, 0) - IFNULL(invoiceCustomer.mainTotal, 0)), 0)
              FROM
                \`P_customerLedgers\` AS cl2
                LEFT OUTER JOIN \`P_salesInvoices\` AS invoiceCustomer ON cl2.creditId = invoiceCustomer.id
                LEFT OUTER JOIN \`P_receiveBanks\` AS receiveCustomer ON cl2.debitId = receiveCustomer.id
              WHERE
                cl2.customerId = \`P_customerLedger\`.\`customerId\`
                AND cl2.companyId = ${companyId}
                AND (cl2.date < \`P_customerLedger\`.\`date\` OR (cl2.date = \`P_customerLedger\`.\`date\` AND cl2.id < \`P_customerLedger\`.\`id\`))
            )
          `),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: salesInvoice,
          as: "invoiceCustomer",
          attributes:[]
        },
        {
          model: receiveBank,
          as: "receiveCustomer",
          attributes:[],
          include: [{model: CompanyBankDetails, as: "receiveBank", attributes:[] }]
        },
        {
          model: customer,
          as: "customerData",
          attributes:[]
        },
      ],
    })

    const outputArray = data.map(item => {
      const { dataValues, ...rest } = item;
      return { ...dataValues, ...rest };
    });

    const customerLedgerArray = [...outputArray]
    if (+open?.dataValues?.openingBalance ?? 0 !== 0) {
      customerLedgerArray.unshift({
          "customerId": +id,
          "id": null,
          "date": formDate,
          "creditAmount": open.dataValues.openingBalance > 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
          "debitAmount": open.dataValues.openingBalance < 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
          "particulars": "Opening Balance",
          "vchType": "",
          "vchNo": "",
      })
    }

    const totals = customerLedgerArray.reduce((acc, ledger) => {
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
    const records = customerLedgerArray.reduce((acc, obj) => {
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
    const html = await renderFile(path.join(__dirname, "../views/customerLedger.ejs"),{data:{form: company,to: customerData ,dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records}});
    htmlToPdf.generatePdf({content: html},{printBackground: true, format: 'A4'}).then((pdf) => {
      const base64String = pdf.toString("base64");
      return res.status(200).json({
        status: "Success",
        message: "pdf create successFully",
        data: base64String,
      });
    })
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_get_customerLedgerPdf = async (req, res)=>{
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;

    const CashCustomerData = await C_customer.findOne({ where: { id, companyId } });
    if(!CashCustomerData){
      return res.status(404).json({
        status: "false",
        message: "Customer Cash Not Found."
      })
    }
    const superAdminUser = await User.findOne({
      where: {
        role: "Super Admin"
      },
      attributes: ['username']
    })

    const queryData = { customerId: id };

    if (companyId) {
      queryData.companyId = companyId;
    }

    if (formDate && toDate) {
      queryData.date = {
        [Op.between]: [formDate, toDate],
      };
    }

    const data = await C_customerLedger.findAll({
      attributes: [
        "customerId",
        "date",
        "id",
        [Sequelize.literal("IFNULL(receiceLedger.amount, 0)"), "creditAmount"],
        [
          Sequelize.literal("IFNULL(invoiceLedger.totalMrp, 0)"),
          "debitAmount",
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN 'SALES CASH'
        WHEN receiceLedger.id IS NOT NULL THEN 'CASH'
        ELSE ''
      END`),
          "particulars"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN 'CASH'
        WHEN receiceLedger.id IS NOT NULL THEN 'Payment'
        ELSE ''
      END`),
          "vchType"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN \`invoiceLedger\`.\`saleNo\`
        WHEN receiceLedger.id IS NOT NULL THEN \`receiceLedger\`.\`receiptNo\`
        ELSE ''
      END`),
          "vchNo"
        ],
      ],
      include: [
        {
          model: C_salesinvoice,
          as: "invoiceLedger",
          attributes:[]
        },
        {
          model: C_receiveCash,
          as: "receiceLedger",
          attributes:[]
        },
        {
          model: C_customer,
          as: "customerData",
          attributes:[]
        },
      ],
      where: queryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
      replacements: { companyId },
    });
    const open = await C_customerLedger.findOne({
      where: {
        id: data[0]?.id ?? 0,
        companyId: companyId
      },
      attributes: [
        [
          Sequelize.literal(`
            (
              SELECT
                IFNULL(SUM(IFNULL(receiceLedger.amount, 0) - IFNULL(invoiceLedger.totalMrp, 0)), 0)
              FROM
                \`P_C_customerLedgers\` AS cl2
                LEFT OUTER JOIN \`P_C_salesInvoices\` AS invoiceLedger ON cl2.creditId = invoiceLedger.id
                LEFT OUTER JOIN \`P_C_receiveCashes\` AS receiceLedger ON cl2.debitId = receiceLedger.id
              WHERE
                cl2.customerId = \`P_C_customerLedger\`.\`customerId\`
                AND cl2.companyId = ${companyId}
                AND (cl2.date < \`P_C_customerLedger\`.\`date\` OR (cl2.date = \`P_C_customerLedger\`.\`date\` AND cl2.id < \`P_C_customerLedger\`.\`id\`))
            )
          `),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_salesinvoice,
          as: "invoiceLedger",
          attributes:[]
        },
        {
          model: C_receiveCash,
          as: "receiceLedger",
          attributes:[]
        },
        {
          model: C_customer,
          as: "customerData",
          attributes:[]
        },
      ],
    })

    const outputArray = data.map(item => {
      const { dataValues, ...rest } = item;
      return { ...dataValues, ...rest };
    });

    const cashCustomerLedgerArray = [...outputArray]
    if (+open?.dataValues?.openingBalance ?? 0 !== 0) {
      cashCustomerLedgerArray.unshift({
          "customerId": +id,
          "id": null,
          "date": formDate,
          "creditAmount": open.dataValues.openingBalance > 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
          "debitAmount": open.dataValues.openingBalance < 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
          "particulars": "Opening Balance",
          "vchType": "",
          "vchNo": "",
      })
    }
    const totals = cashCustomerLedgerArray.reduce((acc, ledger) => {
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
    const records = cashCustomerLedgerArray.reduce((acc, obj) => {
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

    const html = await renderFile(path.join(__dirname, "../views/customerCashLedger.ejs"),{data:{form: superAdminUser,to:CashCustomerData,dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records}});
    htmlToPdf.generatePdf({content: html},{printBackground: true, format: 'A4'}).then((pdf) => {
      const base64String = pdf.toString("base64");
      return res.status(200).json({
        status: "Success",
        message: "pdf create successFully",
        data: base64String,
      });
    })

  } catch (error) {
    console.log(error);
    return res
        .status(500)
        .json({ status: "false", message: "Internal Server Error" });
  }
}