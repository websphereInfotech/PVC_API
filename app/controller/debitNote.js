const { Sequelize } = require("sequelize");
const debitNote = require("../models/debitNote");
const C_DebitNote = require("../models/C_DebitNote");
const debitNoteItem = require("../models/debitNoteItem");
const C_DebitNoteItems = require("../models/C_DebitNoteItems");
const product = require("../models/product");
const purchaseInvoice = require("../models/purchaseInvoice");
const C_purchaseCash = require("../models/C_purchaseCash");
const User = require("../models/user");
const AccountDetail = require("../models/AccountDetail");
const Account = require("../models/Account");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const htmlToPdf = require("html-pdf-node");
const { renderFile } = require("ejs");
const path = require("node:path");
const Company = require("../models/company");
const puppeteer = require("puppeteer");
const ExcelJS = require("exceljs");

exports.create_debitNote = async (req, res) => {
  try {
    const { companyId, userId } = req.user;
    const {
      accountId,
      debitnoteno,
      debitdate,
      invoicedate,
      invoiceId,
      totalQty,
      items,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
    } = req.body;
    const existingCredit = await debitNote.findOne({
      where: { debitnoteno: debitnoteno, companyId: companyId },
    });

    if (existingCredit) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }

    if (!invoiceId || invoiceId === "" || invoiceId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Invoice Number" });
    }
    const invoiceData = await purchaseInvoice.findOne({
      where: { id: invoiceId, companyId: companyId },
    });
    if (!invoiceData) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }

    for (const item of items) {
      if (!item.productId || item.productId === "") {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
      }
      if (item.qty === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Qty Value Invalid" });
      }
      if (item.rate === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Rate Value Invalid" });
      }
      const productname = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const debitNoteData = await debitNote.create({
      accountId,
      debitnoteno,
      debitdate,
      invoicedate,
      invoiceId,
      totalQty,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    const addToProduct = items.map((item) => ({
      DebitId: debitNoteData.id,
      ...item,
    }));

    await debitNoteItem.bulkCreate(addToProduct);

    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      debitNoId: debitNoteData.id,
      date: debitdate,
    });

    const data = await debitNote.findOne({
      where: { id: debitNoteData.id, companyId: companyId },
      include: [{ model: debitNoteItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, companyId } = req.user;
    const {
      accountId,
      debitnoteno,
      debitdate,
      invoicedate,
      invoiceId,
      totalQty,
      items,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
    } = req.body;

    const existingDebit = await debitNote.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!existingDebit) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
    const existingDebitNo = await debitNote.findOne({
      where: {
        debitnoteno: debitnoteno,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });

    if (existingDebitNo) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }
    if (!invoiceId || invoiceId === "" || invoiceId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Invoice Number" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    for (const item of items) {
      if (!item.productId || item.productId === "") {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
      }
      if (item.qty === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Qty Value Invalid" });
      }
      if (item.rate === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Rate Value Invalid" });
      }
      const productname = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await debitNote.update(
      {
        accountId,
        debitnoteno,
        invoiceId,
        invoicedate,
        debitdate,
        totalQty,
        totalIgst,
        totalSgst,
        totalMrp,
        mainTotal,
        companyId: companyId,
        createdBy: existingDebit.createdBy,
        updatedBy: userId,
      },
      { where: { id } }
    );

    const existingItems = await debitNoteItem.findAll({
      where: { DebitId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await debitNoteItem.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
            unit: item.unit,
            productId: item.productId,
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await debitNoteItem.create({
          DebitId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
          unit: item.unit,
        });
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await debitNoteItem.destroy({ where: { id: item.id } });
    }
    await Ledger.update(
      {
        accountId: accountId,
        date: debitdate,
      },
      {
        where: {
          companyId: companyId,
          debitNoId: id,
        },
      }
    );
    const data = await debitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: debitNoteItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Update Successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};
exports.get_all_debitNote = async (req, res) => {
  try {
    const { companyId } = req.user;
    const data = await debitNote.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        {
          model: Account,
          as: "accountDebitNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: User, as: "debitCreateUser", attributes: ["username"] },
        { model: User, as: "debitUpdateUser", attributes: ["username"] },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
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
exports.view_single_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await debitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        {
          model: Account,
          as: "accountDebitNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: purchaseInvoice, as: "purchaseData" },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await debitNote.destroy({
      where: { id: id, companyId: companyId },
    });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Debit Note Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.debitNote_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const companyData = await Company.findByPk(companyId);

    const data = await debitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        {
          model: Account,
          as: "accountDebitNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: purchaseInvoice, as: "purchaseData" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/debitNote.ejs"),
      { data: { form: companyData, debitNote: data } }
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

exports.debitNote_jpg = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const companyData = await Company.findByPk(companyId);

    const data = await debitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        {
          model: Account,
          as: "accountDebitNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: purchaseInvoice, as: "purchaseData" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/debitNote.ejs"),
      { data: { form: companyData, debitNote: data } }
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
      message: "JPG create successFully",
      data: base64String,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.debitNote_html = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const companyData = await Company.findByPk(companyId);

    const data = await debitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        {
          model: Account,
          as: "accountDebitNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: purchaseInvoice, as: "purchaseData" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/debitNote.ejs"),
      { data: { form: companyData, debitNote: data } }
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
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.debitNote_single_excel = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await debitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: debitNoteItem,
          as: "items",
          include: [{ model: product, as: "DebitProduct" }],
        },
        {
          model: Account,
          as: "accountDebitNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoice");

    worksheet.getColumn("A").width = 20;
    worksheet.getColumn("B").width = 20;
    worksheet.getColumn("C").width = 20;
    worksheet.getColumn("D").width = 20;
    worksheet.getColumn("E").width = 20;
    worksheet.getColumn("F").width = 20;

    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "DEBIT NOTE";
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
    worksheet.getCell(
      "A4"
    ).value = `${companyData.city}, ${companyData.state} - ${companyData.pincode}`;
    worksheet.mergeCells("A5:C5");
    worksheet.getCell("A5").value = `GSTIN/UIN: ${companyData.gstnumber}`;

    worksheet.mergeCells("A7:C7");
    worksheet.getCell("A7").value = `Debit No.: ${data.debitnoteno}`;

    worksheet.mergeCells("D2:F2");
    worksheet.getCell("D2").value = data.accountDebitNo.accountName;
    worksheet.getCell("D2").font = { bold: true };
    worksheet.getCell("D2").alignment = { horizontal: "right" };

    worksheet.mergeCells("D3:F3");
    worksheet.getCell("D3").value =
      data.accountDebitNo?.accountDetail?.address1 ?? "N/A";
    worksheet.getCell("D3").alignment = { horizontal: "right" };

    worksheet.mergeCells("D4:F4");
    worksheet.getCell("D4").value =
      `${data.accountDebitNo?.accountDetail?.city}, ${data.accountDebitNo?.accountDetail?.state} - ${data.accountDebitNo?.accountDetail?.pincode}` ??
      "N/A";
    worksheet.getCell("D4").alignment = { horizontal: "right" };

    worksheet.mergeCells("D5:F5");
    worksheet.getCell("D5").value = `GSTIN/UIN: ${
      data.accountDebitNo?.accountDetail?.gstNumber ?? "Unregistered"
    }`;
    worksheet.getCell("D5").alignment = { horizontal: "right" };

    worksheet.mergeCells("D7:F7");
    worksheet.getCell("D7").value = `Inv. Date: ${
      new Date(data.debitdate).toLocaleDateString() ?? "N/A"
    }`;
    worksheet.getCell("D7").alignment = { horizontal: "right" };

    worksheet.addRow([
      "Sl No",
      "Product",
      "HSN/SAC",
      "Quantity",
      "Rate",
      "Amount",
    ]).font = { bold: true };

    data.items.forEach((item, index) => {
      const no = index + 1;
      const productName = item.DebitProduct.productname;
      const HSNcode = item.DebitProduct.HSNcode;
      const qty = `${item.qty} ${item.unit}`;
      const rate = item.rate;
      const mrp = item.mrp;
      worksheet.addRow([no, productName, HSNcode, qty, rate, mrp]);
    });

    worksheet
      .addRow(["", "", "", "", "Total", data.totalMrp])
      .eachCell((cell, colNumber) => {
        if (colNumber === 5 || colNumber === 6) {
          cell.font = { bold: true };
        }
      });

    if (data.totalIgst > 0) {
      worksheet.addRow(["", "", "", "", "IGST", data.totalIgst]);
    } else if (data.totalSgst) {
      worksheet.addRow(["", "", "", "", "SGST", data.totalSgst / 2]);
      worksheet.addRow(["", "", "", "", "CGST", data.totalSgst / 2]);
    }
    worksheet
      .addRow(["", "", "", "", "Total Amount", data.mainTotal])
      .eachCell((cell, colNumber) => {
        if (colNumber === 5 || colNumber === 6) {
          cell.font = { bold: true };
        }
      });

    const buffer = await workbook.xlsx.writeBuffer();
    const base64String = buffer.toString("base64");
    return res.status(200).json({
      status: "true",
      message: "Excel File generated successfully.",
      data: base64String,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.debitNote_excel = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { formDate, toDate } = req.query;

    const debits = await debitNote.findAll({
      where: {
        debitdate: {
          [Sequelize.Op.between]: [formDate, toDate],
        },
        companyId: companyId,
      },
      include: [
        {
          model: Account,
          as: "accountDebitNo",
        },
        { model: User, as: "debitCreateUser", attributes: ["username"] },
        { model: User, as: "debitUpdateUser", attributes: ["username"] },
      ],
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales");
    worksheet.columns = [
      {
        header: "Debitnote No",
        key: "debitnoteno",
        width: 10,
      },
      {
        header: "Date",
        key: "debitdate",
        width: 10,
      },
      {
        header: "Party",
        key: "accountname",
        width: 15,
      },
      {
        header: "Total Amount",
        key: "mainTotal",
        width: 10,
      },
      {
        header: "Created By",
        key: "createdBy",
        width: 15,
      },
      {
        header: "Updated By",
        key: "updatedBy",
        width: 15,
      },
    ];

    for (const debit of debits) {
      const accountname = debit.accountDebitNo.accountName;
      const createdBy = debit.debitCreateUser.username;
      const updatedBy = debit.debitUpdateUser.username;

      worksheet.addRow({
        debitnoteno: debit.debitnoteno,
        debitdate: debit.debitdate,
        accountname: accountname,
        mainTotal: debit.mainTotal,
        createdBy: createdBy,
        updatedBy: updatedBy,
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const base64String = buffer.toString("base64");
    return res.status(200).json({
      status: "true",
      message: "Excel File generated successfully.",
      data: base64String,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

/*=============================================================================================================
                                         With Type C API
 ============================================================================================================ */

exports.C_create_debitNote = async (req, res) => {
  try {
    const { companyId, userId } = req.user;
    const {
      accountId,
      debitnoteno,
      debitdate,
      purchaseDate,
      purchaseId,
      totalQty,
      items,
      mainTotal,
    } = req.body;
    const existingCredit = await C_DebitNote.findOne({
      where: { debitnoteno: debitnoteno, companyId: companyId },
    });

    if (existingCredit) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }
    if (purchaseId) {
      const purchaseData = await C_purchaseCash.findOne({
        where: { id: purchaseId, companyId: companyId },
      });
      if (!purchaseData) {
        return res
          .status(404)
          .json({ status: "false", message: "Purchase Not Found" });
      }
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }

    for (const item of items) {
      if (!item.productId || item.productId === "") {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
      }
      if (item.qty === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Qty Value Invalid" });
      }
      if (item.rate === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Rate Value Invalid" });
      }
      const productname = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const debitNoteData = await C_DebitNote.create({
      accountId,
      debitnoteno,
      debitdate,
      purchaseDate,
      purchaseId,
      totalQty,
      mainTotal,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    const addToProduct = items.map((item) => ({
      DebitId: debitNoteData.id,
      ...item,
    }));

    await C_DebitNoteItems.bulkCreate(addToProduct);

    await C_Ledger.create({
      accountId: accountId,
      companyId: companyId,
      debitNoId: debitNoteData.id,
      date: debitdate,
    });

    const data = await C_DebitNote.findOne({
      where: { id: debitNoteData.id, companyId: companyId },
      include: [{ model: C_DebitNoteItems, as: "cashDebitNoteItem" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_update_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, companyId } = req.user;
    const {
      accountId,
      debitnoteno,
      debitdate,
      purchaseDate,
      purchaseId,
      totalQty,
      items,
      mainTotal,
    } = req.body;

    const existingDebit = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!existingDebit) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
    const existingDebitNo = await C_DebitNote.findOne({
      where: {
        debitnoteno: debitnoteno,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });

    if (existingDebitNo) {
      return res
        .status(400)
        .json({ status: "false", message: "Debit Note Number Already Exists" });
    }
    if (purchaseId) {
      const purchaseData = await C_purchaseCash.findOne({
        where: { id: purchaseId, companyId: companyId },
      });
      if (!purchaseData) {
        return res
          .status(404)
          .json({ status: "false", message: "Purchase Not Found" });
      }
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    for (const item of items) {
      if (!item.productId || item.productId === "") {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
      }
      if (item.qty === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Qty Value Invalid" });
      }
      if (item.rate === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Rate Value Invalid" });
      }
      const productname = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await C_DebitNote.update(
      {
        accountId,
        debitnoteno,
        purchaseId,
        purchaseDate,
        debitdate,
        totalQty,
        mainTotal,
        companyId: companyId,
        createdBy: existingDebit.createdBy,
        updatedBy: userId,
      },
      { where: { id } }
    );

    const existingItems = await C_DebitNoteItems.findAll({
      where: { DebitId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await C_DebitNoteItems.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
            unit: item.unit,
            productId: item.productId,
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await C_DebitNoteItems.create({
          DebitId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
          unit: item.unit,
        });
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await C_DebitNoteItems.destroy({ where: { id: item.id } });
    }

    await C_Ledger.update(
      {
        accountId: accountId,
        date: debitdate,
      },
      {
        where: {
          companyId: companyId,
          debitNoId: id,
        },
      }
    );
    const data = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: C_DebitNoteItems, as: "cashDebitNoteItem" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Debit Note Update Successfully",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};

exports.C_get_all_debitNote = async (req, res) => {
  try {
    const { companyId } = req.user;
    const data = await C_DebitNote.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: C_DebitNoteItems,
          as: "cashDebitNoteItem",
          include: [{ model: product, as: "DebitProductCash" }],
        },
        {
          model: Account,
          as: "accountDebitNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: User, as: "debitCreateUserCash", attributes: ["username"] },
        { model: User, as: "debitUpdateUserCash", attributes: ["username"] },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
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

exports.C_view_single_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_DebitNoteItems,
          as: "cashDebitNoteItem",
          include: [{ model: product, as: "DebitProductCash" }],
        },
        {
          model: Account,
          as: "accountDebitNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: C_purchaseCash, as: "purchaseDataCash" },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Debit Note Data Fetch Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_delete_debitNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await C_DebitNote.destroy({
      where: { id: id, companyId: companyId },
    });
    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Debit Note Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_debitNote_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_DebitNoteItems,
          as: "cashDebitNoteItem",
          include: [{ model: product, as: "DebitProductCash" }],
        },
        {
          model: Account,
          as: "accountDebitNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: C_purchaseCash, as: "purchaseDataCash" },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/debitNoteCash.ejs"),
      { data }
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

exports.C_debitNote_jpg = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_DebitNoteItems,
          as: "cashDebitNoteItem",
          include: [{ model: product, as: "DebitProductCash" }],
        },
        {
          model: Account,
          as: "accountDebitNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: C_purchaseCash, as: "purchaseDataCash" },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/debitNoteCash.ejs"),
      { data }
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
      message: "JPG create successFully",
      data: base64String,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_debitNote_html = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;

    const data = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_DebitNoteItems,
          as: "cashDebitNoteItem",
          include: [{ model: product, as: "DebitProductCash" }],
        },
        {
          model: Account,
          as: "accountDebitNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: C_purchaseCash, as: "purchaseDataCash" },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/debitNoteCash.ejs"),
      { data }
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
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_debitNote_single_excel = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await C_DebitNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_DebitNoteItems,
          as: "cashDebitNoteItem",
          include: [{ model: product, as: "DebitProductCash" }],
        },
        {
          model: Account,
          as: "accountDebitNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Debit Note Not Found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoice");

    worksheet.getColumn("A").width = 20;
    worksheet.getColumn("B").width = 20;
    worksheet.getColumn("C").width = 20;
    worksheet.getColumn("D").width = 20;
    worksheet.getColumn("E").width = 20;
    worksheet.getColumn("F").width = 20;

    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "DEBIT NOTE CASH";
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
    worksheet.getCell(
      "A4"
    ).value = `${companyData.city}, ${companyData.state} - ${companyData.pincode}`;
    worksheet.mergeCells("A5:C5");
    worksheet.getCell("A5").value = `GSTIN/UIN: ${companyData.gstnumber}`;

    worksheet.mergeCells("A7:C7");
    worksheet.getCell("A7").value = `Debit No.: ${data.debitnoteno}`;

    worksheet.mergeCells("D2:F2");
    worksheet.getCell("D2").value = data.accountDebitNoCash.contactPersonName;
    worksheet.getCell("D2").font = { bold: true };
    worksheet.getCell("D2").alignment = { horizontal: "right" };

    worksheet.mergeCells("D7:F7");
    worksheet.getCell("D7").value = `Date: ${
      new Date(data.debitdate).toLocaleDateString() ?? "N/A"
    }`;
    worksheet.getCell("D7").alignment = { horizontal: "right" };

    worksheet.addRow([
      "Sl No",
      "Product",
      "HSN/SAC",
      "Quantity",
      "Rate",
      "Amount",
    ]).font = { bold: true };

    data.cashDebitNoteItem.forEach((item, index) => {
      const no = index + 1;
      const productName = item.DebitProductCash.productname;
      const HSNcode = item.DebitProductCash.HSNcode;
      const qty = `${item.qty} ${item.unit}`;
      const rate = item.rate;
      const mrp = item.mrp;
      worksheet.addRow([no, productName, HSNcode, qty, rate, mrp]);
    });

    worksheet
      .addRow(["", "", "", "", "Total", data.mainTotal])
      .eachCell((cell, colNumber) => {
        if (colNumber === 5 || colNumber === 6) {
          cell.font = { bold: true };
        }
      });

    const buffer = await workbook.xlsx.writeBuffer();
    const base64String = buffer.toString("base64");
    return res.status(200).json({
      status: "true",
      message: "Excel File generated successfully.",
      data: base64String,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_debitNote_excel = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    
    const { formDate, toDate } = req.query;

    const debits = await C_DebitNote.findAll({
      where: {
        debitdate: {
          [Sequelize.Op.between]: [formDate, toDate],
        },
        companyId: companyId,
      },
      include: [
        {
          model: Account,
          as: "accountDebitNoCash",
        },
        { model: User, as: "debitCreateUserCash", attributes: ["username"] },
        { model: User, as: "debitUpdateUserCash", attributes: ["username"] },
      ],
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("debits");
    worksheet.columns = [
      {
        header: "Debit Note No",
        key: "debitnoteno",
        width: 10,
      },
      {
        header: "Date",
        key: "debitdate",
        width: 10,
      },
      {
        header: "Party",
        key: "contactPersonName",
        width: 15,
      },
      {
        header: "Total Amount",
        key: "mainTotal",
        width: 10,
      },
      {
        header: "Created By",
        key: "createdBy",
        width: 15,
      },
      {
        header: "Updated By",
        key: "updatedBy",
        width: 15,
      },
    ];

    for (const debit of debits) {
      const contactPersonName = debit.accountDebitNoCash.contactPersonName;
      const createdBy = debit.debitCreateUserCash.username;
      const updatedBy = debit.debitUpdateUserCash.username;

      worksheet.addRow({
        debitnoteno: debit.debitnoteno,
        debitdate: debit.debitdate,
        contactPersonName: contactPersonName,
        mainTotal: debit.mainTotal,
        createdBy: createdBy,
        updatedBy: updatedBy,
      });
    }
    const buffer = await workbook.xlsx.writeBuffer();
    const base64String = buffer.toString("base64");
    return res.status(200).json({
      status: "true",
      message: "Excel File generated successfully.",
      data: base64String,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};