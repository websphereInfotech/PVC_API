const { Sequelize } = require("sequelize");
const { renderFile } = require("ejs");
const htmlToPdf = require("html-pdf-node");
const path = require("node:path");
const C_PaymentCash = require("../models/C_paymentCash");
const C_purchaseCash = require("../models/C_purchaseCash");
const C_vendorLedger = require("../models/C_vendorLedger");
const C_vendor = require("../models/C_vendor");
const vendorLedger = require("../models/vendorLedger");
const purchaseInvoice = require("../models/purchaseInvoice");
const paymentBank = require("../models/paymentBank");
const vendor = require("../models/vendor");
const companyBankDetails = require("../models/companyBankDetails");
const Company = require("../models/company");

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */

exports.C_get_vendorLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const cashVendorData = await C_vendor.findOne({ where: { id, companyId } });
    if(!cashVendorData){
      return res.status(404).json({
        status: "false",
        message: "Cash Vendor Not Found."
      })
    }
    const company = await Company.findOne({where: {id: companyId}})

    const quaryData = { vendorId: id };

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
        [
          Sequelize.literal("IFNULL(paymentLedger.amount, 0)"),
          "debitAmount",
        ],
        [Sequelize.literal("IFNULL(invoiceLedger.totalMrp, 0)"), "creditAmount"],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN 'PURCHASE CASH'
        WHEN paymentLedger.id IS NOT NULL THEN 'CASH'
        ELSE ''
      END`),
          "particulars"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN 'CASH'
        WHEN paymentLedger.id IS NOT NULL THEN 'Payment'
        ELSE ''
      END`),
          "vchType"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN \`invoiceLedger\`.\`purchaseNo\`
        WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`paymentNo\`
        ELSE ''
      END`),
          "vchNo"
        ],

      ],
      include: [
        {
          model: C_purchaseCash,
          as: "invoiceLedger",
          attributes:[]
        },
        {
          model: C_PaymentCash,
          as: "paymentLedger",
          attributes:[]
        },
        {
          model: C_vendor,
          as: "vendorData",
          attributes:[]
        },
      ],
      where: quaryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const open = await C_vendorLedger.findOne({
      where: {
        id: data[0]?.id ?? 0,
        companyId: companyId
      },
      attributes: [
        [
          Sequelize.literal(`
        (
          SELECT
            IFNULL(SUM(IFNULL(invoiceLedger.totalMrp, 0)- IFNULL(paymentLedger.amount, 0)), 0)
          FROM
            \`P_C_vendorLedgers\` AS cl2
            LEFT OUTER JOIN \`P_C_paymentCashes\` AS paymentLedger ON cl2.creditId = paymentLedger.id
            LEFT OUTER JOIN \`P_C_purchaseCashes\` AS invoiceLedger ON cl2.debitId = invoiceLedger.id
          WHERE
            cl2.vendorId = \`P_C_vendorLedger\`.\`vendorId\`
            AND cl2.companyId = ${companyId}
            AND (cl2.date < \`P_C_vendorLedger\`.\`date\` OR (cl2.date = \`P_C_vendorLedger\`.\`date\` AND cl2.id < \`P_C_vendorLedger\`.\`id\`))
        )
      `),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_purchaseCash,
          as: "invoiceLedger",
          attributes:[]
        },
        {
          model: C_PaymentCash,
          as: "paymentLedger",
          attributes:[]
        },
        {
          model: C_vendor,
          as: "vendorData",
          attributes:[]
        },
      ],
    })
    console.log(open,"Open...................")

    const cashVendorLedgerArray = [...data]
    if (+open?.dataValues?.openingBalance ?? 0 !== 0) {
      cashVendorLedgerArray.unshift({
        "vendorId": +id,
        "id": null,
        "date": formDate,
        "creditAmount": open.dataValues.openingBalance > 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "debitAmount": open.dataValues.openingBalance < 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "particulars": "Opening Balance",
        "vchType": "",
        "vchNo": "",
      })
    }

    const totals = cashVendorLedgerArray.reduce((acc, ledger) => {
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

    const records = cashVendorLedgerArray.reduce((acc, obj) => {
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
      message: "Vendor Cash Ledger Data Fetch Successfully",
      data: {form: company,to: cashVendorData, dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
/*=============================================================================================================
                                          without Type C API
 ============================================================================================================ */
exports.get_vendorLedger = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;

    const companyId = req.user.companyId;
    const vendorData = await vendor.findOne({ where: { id, companyId } });
    if(!vendorData){
      return res.status(404).json({
        status: "false",
        message: "Vendor Not Found."
      })
    }
    const company = await Company.findOne({where: {id: companyId}})

    const queryData = { vendorId: id };

    if (companyId) {
      queryData.companyId = companyId;
    }

    if (formDate && toDate) {
      queryData.date = {
        [Sequelize.Op.between]: [formDate, toDate],
      };
    }
    const data = await vendorLedger.findAll({
      attributes: [
        "vendorId",
        "date",
        "id",
        [
          Sequelize.literal("IFNULL(paymentVendor.amount, 0)"),
          "debitAmount",
        ],
        [Sequelize.literal("IFNULL(invoiceVendor.mainTotal, 0)"), "creditAmount"],
        [
          Sequelize.literal(`CASE
        WHEN invoiceVendor.id IS NOT NULL THEN 'PURCHASE GST'
        WHEN paymentVendor.id IS NOT NULL THEN \`paymentVendor->paymentBank\`.\`bankname\`
        ELSE ''
      END`),
          "particulars"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceVendor.id IS NOT NULL THEN 'TAX INVOICE'
        WHEN paymentVendor.id IS NOT NULL THEN 'Payment'
        ELSE ''
      END`),
          "vchType"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceVendor.id IS NOT NULL THEN \`invoiceVendor\`.\`voucherno\`
        WHEN paymentVendor.id IS NOT NULL THEN \`paymentVendor\`.\`voucherno\`
        ELSE ''
      END`),
          "vchNo"
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
          attributes:[],
          include:[{model: companyBankDetails, as: "paymentBank",attributes:[]}]
        },
        {
          model: vendor,
          as: "vendorData",
          attributes:[]
        },
      ],
      where: queryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const open = await vendorLedger.findOne({
      where: {
        id: data[0]?.id ?? 0,
        companyId: companyId
      },
      attributes: [
        [
          Sequelize.literal(`
        (
          SELECT
            IFNULL(SUM(IFNULL(invoiceVendor.mainTotal, 0)- IFNULL(paymentVendor.amount, 0)), 0)
          FROM
            \`P_vendorLedgers\` AS cl2
            LEFT OUTER JOIN \`P_paymentBanks\` AS paymentVendor ON cl2.creditId = paymentVendor.id
            LEFT OUTER JOIN \`P_purchaseInvoices\` AS invoiceVendor ON cl2.debitId = invoiceVendor.id
          WHERE
            cl2.vendorId = \`P_vendorLedger\`.\`vendorId\`
            AND cl2.companyId = ${companyId}
            AND (cl2.date < \`P_vendorLedger\`.\`date\` OR (cl2.date = \`P_vendorLedger\`.\`date\` AND cl2.id < \`P_vendorLedger\`.\`id\`))
        )
      `),
          "openingBalance",
        ]
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
          attributes:[],
          include:[{model: companyBankDetails, as: "paymentBank",attributes:[]}]
        },
        {
          model: vendor,
          as: "vendorData",
          attributes:[]
        },
      ],
    })

    const vendorLedgerArray = [...data]
    if (+open?.dataValues?.openingBalance ?? 0 !== 0) {
      vendorLedgerArray.unshift({
        "vendorId": +id,
        "id": null,
        "date": formDate,
        "creditAmount": open.dataValues.openingBalance > 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "debitAmount": open.dataValues.openingBalance < 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "particulars": "Opening Balance",
        "vchType": "",
        "vchNo": "",
      })
    }

    const totals = vendorLedgerArray.reduce((acc, ledger) => {
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

    const records = vendorLedgerArray.reduce((acc, obj) => {
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
        message: "Vendor Ledger Data Fetch Successfully",
        data: {form: company,to: vendorData, dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records},
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_vendorLedgerPDF = async (req, res)=>{
  const { id } = req.params;
  const { formDate, toDate } = req.query;

  const companyId = req.user.companyId;
  const vendorData = await vendor.findOne({ where: { id, companyId } });
  if(!vendorData){
    return res.status(404).json({
      status: "false",
      message: "Vendor Not Found."
    })
  }
  const company = await Company.findOne({where: {id: companyId}})

  const queryData = { vendorId: id };

  if (companyId) {
    queryData.companyId = companyId;
  }

  if (formDate && toDate) {
    queryData.date = {
      [Sequelize.Op.between]: [formDate, toDate],
    };
  }
  const data = await vendorLedger.findAll({
    attributes: [
      "vendorId",
      "date",
      "id",
      [
        Sequelize.literal("IFNULL(paymentVendor.amount, 0)"),
        "debitAmount",
      ],
      [Sequelize.literal("IFNULL(invoiceVendor.mainTotal, 0)"), "creditAmount"],
      [
        Sequelize.literal(`CASE
        WHEN invoiceVendor.id IS NOT NULL THEN 'PURCHASE GST'
        WHEN paymentVendor.id IS NOT NULL THEN \`paymentVendor->paymentBank\`.\`bankname\`
        ELSE ''
      END`),
        "particulars"
      ],
      [
        Sequelize.literal(`CASE
        WHEN invoiceVendor.id IS NOT NULL THEN 'TAX INVOICE'
        WHEN paymentVendor.id IS NOT NULL THEN 'Payment'
        ELSE ''
      END`),
        "vchType"
      ],
      [
        Sequelize.literal(`CASE
        WHEN invoiceVendor.id IS NOT NULL THEN \`invoiceVendor\`.\`voucherno\`
        WHEN paymentVendor.id IS NOT NULL THEN \`paymentVendor\`.\`voucherno\`
        ELSE ''
      END`),
        "vchNo"
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
        attributes:[],
        include:[{model: companyBankDetails, as: "paymentBank",attributes:[]}]
      },
      {
        model: vendor,
        as: "vendorData",
        attributes:[]
      },
    ],
    where: queryData,
    order: [
      ["date", "ASC"],
      ["id", "ASC"],
    ],
  });

  const open = await vendorLedger.findOne({
    where: {
      id: data[0]?.id ?? 0,
      companyId: companyId
    },
    attributes: [
      [
        Sequelize.literal(`
        (
          SELECT
            IFNULL(SUM(IFNULL(invoiceVendor.mainTotal, 0)- IFNULL(paymentVendor.amount, 0)), 0)
          FROM
            \`P_vendorLedgers\` AS cl2
            LEFT OUTER JOIN \`P_paymentBanks\` AS paymentVendor ON cl2.creditId = paymentVendor.id
            LEFT OUTER JOIN \`P_purchaseInvoices\` AS invoiceVendor ON cl2.debitId = invoiceVendor.id
          WHERE
            cl2.vendorId = \`P_vendorLedger\`.\`vendorId\`
            AND cl2.companyId = ${companyId}
            AND (cl2.date < \`P_vendorLedger\`.\`date\` OR (cl2.date = \`P_vendorLedger\`.\`date\` AND cl2.id < \`P_vendorLedger\`.\`id\`))
        )
      `),
        "openingBalance",
      ]
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
        attributes:[],
        include:[{model: companyBankDetails, as: "paymentBank",attributes:[]}]
      },
      {
        model: vendor,
        as: "vendorData",
        attributes:[]
      },
    ],
  })

  const vendorLedgerArray = [...data]
  if (+open?.dataValues?.openingBalance ?? 0 !== 0) {
    vendorLedgerArray.unshift({
      dataValues: {
        "vendorId": +id,
        "id": null,
        "date": formDate,
        "creditAmount": open.dataValues.openingBalance > 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "debitAmount": open.dataValues.openingBalance < 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
        "particulars": "Opening Balance",
        "vchType": "",
        "vchNo": "",
      }
    })
  }

  const totals = vendorLedgerArray.reduce((acc, ledger) => {
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

  const records = vendorLedgerArray.reduce((acc, obj) => {
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
  const html = await renderFile(path.join(__dirname, "../views/vendorLedger.ejs"),{data:{form: company,to: vendorData, dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records}});
  htmlToPdf.generatePdf({content: html},{printBackground: true, format: 'A4'}).then((pdf) => {
    const base64String = pdf.toString("base64");
    return res.status(200).json({
      status: "Success",
      message: "pdf create successFully",
      data: base64String,
    });
  })
}

exports.C_get_vendorLedgerPdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { formDate, toDate } = req.query;
    const companyId = req.user.companyId;
    const cashVendorData = await C_vendor.findOne({ where: { id, companyId } });
    if(!cashVendorData){
      return res.status(404).json({
        status: "false",
        message: "Cash Vendor Not Found."
      })
    }
    const company = await Company.findOne({where: {id: companyId}})

    const quaryData = { vendorId: id };

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
        [
          Sequelize.literal("IFNULL(paymentLedger.amount, 0)"),
          "debitAmount",
        ],
        [Sequelize.literal("IFNULL(invoiceLedger.totalMrp, 0)"), "creditAmount"],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN 'PURCHASE CASH'
        WHEN paymentLedger.id IS NOT NULL THEN 'CASH'
        ELSE ''
      END`),
          "particulars"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN 'CASH'
        WHEN paymentLedger.id IS NOT NULL THEN 'Payment'
        ELSE ''
      END`),
          "vchType"
        ],
        [
          Sequelize.literal(`CASE
        WHEN invoiceLedger.id IS NOT NULL THEN \`invoiceLedger\`.\`purchaseNo\`
        WHEN paymentLedger.id IS NOT NULL THEN \`paymentLedger\`.\`paymentNo\`
        ELSE ''
      END`),
          "vchNo"
        ],

      ],
      include: [
        {
          model: C_purchaseCash,
          as: "invoiceLedger",
          attributes:[]
        },
        {
          model: C_PaymentCash,
          as: "paymentLedger",
          attributes:[]
        },
        {
          model: C_vendor,
          as: "vendorData",
          attributes:[]
        },
      ],
      where: quaryData,
      order: [
        ["date", "ASC"],
        ["id", "ASC"],
      ],
    });

    const open = await C_vendorLedger.findOne({
      where: {
        id: data[0]?.id ?? 0,
        companyId: companyId
      },
      attributes: [
        [
          Sequelize.literal(`
        (
          SELECT
            IFNULL(SUM(IFNULL(invoiceLedger.totalMrp, 0)- IFNULL(paymentLedger.amount, 0)), 0)
          FROM
            \`P_C_vendorLedgers\` AS cl2
            LEFT OUTER JOIN \`P_C_paymentCashes\` AS paymentLedger ON cl2.creditId = paymentLedger.id
            LEFT OUTER JOIN \`P_C_purchaseCashes\` AS invoiceLedger ON cl2.debitId = invoiceLedger.id
          WHERE
            cl2.vendorId = \`P_C_vendorLedger\`.\`vendorId\`
            AND cl2.companyId = ${companyId}
            AND (cl2.date < \`P_C_vendorLedger\`.\`date\` OR (cl2.date = \`P_C_vendorLedger\`.\`date\` AND cl2.id < \`P_C_vendorLedger\`.\`id\`))
        )
      `),
          "openingBalance",
        ],
      ],
      include: [
        {
          model: C_purchaseCash,
          as: "invoiceLedger",
          attributes:[]
        },
        {
          model: C_PaymentCash,
          as: "paymentLedger",
          attributes:[]
        },
        {
          model: C_vendor,
          as: "vendorData",
          attributes:[]
        },
      ],
    })
    console.log(open,"Open...................")

    const cashVendorLedgerArray = [...data]
    if (+open?.dataValues?.openingBalance ?? 0 !== 0) {
      cashVendorLedgerArray.unshift({
        dataValues: {
          "vendorId": +id,
          "id": null,
          "date": formDate,
          "creditAmount": open.dataValues.openingBalance > 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
          "debitAmount": open.dataValues.openingBalance < 0 ? +Math.abs(open.dataValues.openingBalance).toFixed(2) : 0,
          "particulars": "Opening Balance",
          "vchType": "",
          "vchNo": "",
        }
      })
    }

    const totals = cashVendorLedgerArray.reduce((acc, ledger) => {
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

    const records = cashVendorLedgerArray.reduce((acc, obj) => {
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

    const html = await renderFile(path.join(__dirname, "../views/vendorCashLedger.ejs"),{data:{form: company,to: cashVendorData, dateRange: `${formDateFormat} - ${toDateFormat}`,totals, totalAmount: totals.totalCredit < totals.totalDebit ? totals.totalDebit: totals.totalCredit,closingBalance, records: records}});
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
