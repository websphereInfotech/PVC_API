const { Sequelize } = require("sequelize");
const creditNote = require("../models/creditNote");
const C_CreditNote = require("../models/C_CreditNote");
const creditNoteItem = require("../models/creditNoteItem");
const C_CreditNoteItems = require("../models/C_CreditNoteItems");
const product = require("../models/product");
const Account = require("../models/Account");
const User = require("../models/user");
const AccountDetail = require("../models/AccountDetail");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const htmlToPdf = require("html-pdf-node");
const { renderFile } = require("ejs");
const path = require("node:path");
const Company = require("../models/company");
const puppeteer = require("puppeteer");
const ExcelJS = require("exceljs");

exports.create_creditNote = async (req, res) => {
  try {
    const {
      accountId,
      creditnoteNo,
      creditdate,
      org_invoicedate,
      org_invoiceno,
      LL_RR_no,
      dispatchThrough,
      motorVehicleNo,
      destination,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    const numberOf = await creditNote.findOne({
      where: { creditnoteNo: creditnoteNo, companyId: req.user.companyId },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "Credit Note Number Already Exists",
      });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
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
          .json({ status: "false", message: "Qty And Rate Value Invalid" });
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
    const creditData = await creditNote.create({
      accountId,
      creditnoteNo,
      creditdate,
      org_invoiceno,
      org_invoicedate,
      LL_RR_no,
      dispatchThrough,
      destination,
      motorVehicleNo,
      totalIgst,
      totalSgst,
      totalMrp,
      totalQty,
      mainTotal,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    const addToProduct = items.map((item) => ({
      creditId: creditData.id,
      ...item,
    }));
    await creditNoteItem.bulkCreate(addToProduct);

    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      creditNoId: creditData.id,
      date: creditdate,
    });

    const data = await creditNote.findOne({
      where: { id: creditData.id, companyId: companyId },
      include: [{ model: creditNoteItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Credit Note Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.update_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const {
      accountId,
      creditnoteNo,
      creditdate,
      org_invoicedate,
      org_invoiceno,
      LL_RR_no,
      dispatchThrough,
      motorVehicleNo,
      destination,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const existingCredit = await creditNote.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!existingCredit) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }
    const numberOf = await creditNote.findOne({
      where: {
        creditnoteNo: creditnoteNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "Credit Note Number Already Exists",
      });
    }

    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId },
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
    await creditNote.update(
      {
        accountId,
        creditnoteNo,
        creditdate,
        org_invoiceno,
        org_invoicedate,
        LL_RR_no,
        dispatchThrough,
        motorVehicleNo,
        destination,
        totalIgst,
        totalSgst,
        totalMrp,
        totalQty,
        mainTotal,
        companyId: companyId,
        createdBy: existingCredit.createdBy,
        updatedBy: userId,
      },
      { where: { id } }
    );

    const existingItems = await creditNoteItem.findAll({
      where: { creditId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await creditNoteItem.update(
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
        await creditNoteItem.create({
          creditId: id,
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
      await creditNoteItem.destroy({ where: { id: item.id } });
    }

    await Ledger.update(
      {
        accountId: accountId,
        date: creditdate,
      },
      {
        where: {
          companyId: companyId,
          creditNoId: id,
        },
      }
    );
    const data = await creditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: creditNoteItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Credit Note Update Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_all_creditNote = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await creditNote.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        {
          model: Account,
          as: "accountCreditNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: User, as: "creditCreateUser", attributes: ["username"] },
        { model: User, as: "creditUpdateUser", attributes: ["username"] },
      ],
    });
    return res.status(200).json({
      status: "true",
      message: "Credit Note Data fetch successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_single_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await creditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        {
          model: Account,
          as: "accountCreditNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Credit Note Data fetch successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.delete_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const data = await creditNote.destroy({
      where: { id: id, companyId: companyId },
    });

    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Credit Note Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.creditNote_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await creditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        {
          model: Account,
          as: "accountCreditNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/creditNote.ejs"),
      { data: { form: companyData, creditNote: data } }
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
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.creditNote_jpg = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await creditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        {
          model: Account,
          as: "accountCreditNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/creditNote.ejs"),
      { data: { form: companyData, creditNote: data } }
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
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.creditNote_html = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await creditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        {
          model: Account,
          as: "accountCreditNo",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/creditNote.ejs"),
      { data: { form: companyData, creditNote: data } }
    );
    const base64HTML = Buffer.from(html).toString("base64");

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: "Success",
      message: "Html Document Created Successfully",
      data: base64HTML,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.creditNote_single_excel = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await creditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: creditNoteItem,
          as: "items",
          include: [{ model: product, as: "CreditProduct" }],
        },
        {
          model: Account,
          as: "accountCreditNo",
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
    worksheet.getCell("A1").value = "CREDIT NOTE";
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
    worksheet.getCell("A7").value = `Creditnote No.: ${data.creditnoteNo}`;

    worksheet.mergeCells("A8:C8");
    worksheet.getCell("A8").value = `Org. Invoice No.: ${
      data?.org_invoiceno ?? "N/A"
    }`;

    worksheet.mergeCells("D2:F2");
    worksheet.getCell("D2").value = data.accountCreditNo.accountName;
    worksheet.getCell("D2").font = { bold: true };
    worksheet.getCell("D2").alignment = { horizontal: "right" };

    worksheet.mergeCells("D3:F3");
    worksheet.getCell("D3").value =
      data.accountCreditNo?.accountDetail?.address1 ?? "N/A";
    worksheet.getCell("D3").alignment = { horizontal: "right" };

    worksheet.mergeCells("D4:F4");
    worksheet.getCell("D4").value =
      `${data.accountCreditNo?.accountDetail?.city}, ${data.accountCreditNo?.accountDetail?.state} - ${data.accountCreditNo?.accountDetail?.pincode}` ??
      "N/A";
    worksheet.getCell("D4").alignment = { horizontal: "right" };

    worksheet.mergeCells("D5:F5");
    worksheet.getCell("D5").value = `GSTIN/UIN: ${
      data.accountCreditNo?.accountDetail?.gstNumber ?? "Unregistered"
    }`;
    worksheet.getCell("D5").alignment = { horizontal: "right" };

    worksheet.mergeCells("D7:F7");
    worksheet.getCell("D7").value = `Date: ${
      new Date(data.creditdate).toLocaleDateString() ?? "N/A"
    }`;
    worksheet.getCell("D7").alignment = { horizontal: "right" };

    worksheet.mergeCells("D8:F8");
    worksheet.getCell("D8").value = `Org. Invoice Date: ${
      new Date(data.org_invoicedate).toLocaleDateString() ?? "N/A"
    }`;
    worksheet.getCell("D8").alignment = { horizontal: "right" };

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
      const productName = item.CreditProduct.productname;
      const HSNcode = item.CreditProduct.HSNcode;
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
exports.creditNote_excel = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { formDate, toDate } = req.query;

    const credits = await creditNote.findAll({
      where: {
        creditdate: {
          [Sequelize.Op.between]: [formDate, toDate],
        },
        companyId: companyId,
      },
      include: [
        {
          model: Account,
          as: "accountCreditNo",
        },
        { model: User, as: "creditCreateUser", attributes: ["username"] },
        { model: User, as: "creditUpdateUser", attributes: ["username"] },
      ],
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales");
    worksheet.columns = [
      {
        header: "Creditnote No",
        key: "creditnoteNo",
        width: 10,
      },
      {
        header: "Date",
        key: "creditdate",
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

    for (const credit of credits) {
      const accountname = credit.accountCreditNo.accountName;
      const createdBy = credit.creditCreateUser.username;
      const updatedBy = credit.creditUpdateUser.username;

      worksheet.addRow({
        creditnoteNo: credit.creditnoteNo,
        creditdate: credit.creditdate,
        accountname: accountname,
        mainTotal: credit.mainTotal,
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
                                         Without Typc C API
 ============================================================================================================ */

exports.C_create_creditNote = async (req, res) => {
  try {
    const {
      accountId,
      creditnoteNo,
      creditdate,
      LL_RR_no,
      dispatchThrough,
      motorVehicleNo,
      destination,
      mainTotal,
      totalQty,
      items,
    } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.userId;

    const numberOf = await C_CreditNote.findOne({
      where: { creditnoteNo: creditnoteNo, companyId: companyId },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "Credit Note Number Already Exists",
      });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
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
          .json({ status: "false", message: "Qty And Rate Value Invalid" });
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
    const creditData = await C_CreditNote.create({
      accountId,
      creditnoteNo,
      creditdate,
      LL_RR_no,
      dispatchThrough,
      destination,
      motorVehicleNo,
      totalQty,
      mainTotal,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    const addToProduct = items.map((item) => ({
      creditId: creditData.id,
      ...item,
    }));
    await C_CreditNoteItems.bulkCreate(addToProduct);

    await C_Ledger.create({
      accountId: accountId,
      companyId: companyId,
      creditNoId: creditData.id,
      date: creditdate,
    });

    const data = await C_CreditNote.findOne({
      where: { id: creditData.id, companyId: companyId },
      include: [{ model: C_CreditNoteItems, as: "cashCreditNoteItem" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Credit Note Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_update_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const {
      accountId,
      creditnoteNo,
      creditdate,
      LL_RR_no,
      dispatchThrough,
      motorVehicleNo,
      destination,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const existingCredit = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!existingCredit) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }
    const numberOf = await C_CreditNote.findOne({
      where: {
        creditnoteNo: creditnoteNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "Credit Note Number Already Exists",
      });
    }

    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId },
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
    await C_CreditNote.update(
      {
        accountId,
        creditnoteNo,
        creditdate,
        LL_RR_no,
        dispatchThrough,
        motorVehicleNo,
        destination,
        totalQty,
        mainTotal,
        companyId: companyId,
        createdBy: existingCredit.createdBy,
        updatedBy: userId,
      },
      { where: { id } }
    );

    const existingItems = await C_CreditNoteItems.findAll({
      where: { creditId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await C_CreditNoteItems.update(
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
        await C_CreditNoteItems.create({
          creditId: id,
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
      await C_CreditNoteItems.destroy({ where: { id: item.id } });
    }

    await C_Ledger.update(
      {
        accountId: accountId,
        date: creditdate,
      },
      {
        where: {
          companyId: companyId,
          creditNoId: id,
        },
      }
    );
    const data = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: C_CreditNoteItems, as: "cashCreditNoteItem" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Credit Note Update Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_get_all_creditNote = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await C_CreditNote.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: C_CreditNoteItems,
          as: "cashCreditNoteItem",
          include: [{ model: product, as: "CreditProductCash" }],
        },
        {
          model: Account,
          as: "accountCreditNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
        { model: User, as: "creditCreateUserCash", attributes: ["username"] },
        { model: User, as: "creditUpdateUserCash", attributes: ["username"] },
      ],
    });
    return res.status(200).json({
      status: "true",
      message: "Credit Note Data fetch successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_view_single_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_CreditNoteItems,
          as: "cashCreditNoteItem",
          include: [{ model: product, as: "CreditProductCash" }],
        },
        {
          model: Account,
          as: "accountCreditNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Credit Note Data fetch successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.C_delete_creditNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId } = req.user;
    const data = await C_CreditNote.destroy({
      where: { id: id, companyId: companyId },
    });

    if (data) {
      return res
        .status(200)
        .json({ status: "true", message: "Credit Note Deleted Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_creditNote_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_CreditNoteItems,
          as: "cashCreditNoteItem",
          include: [{ model: product, as: "CreditProductCash" }],
        },
        {
          model: Account,
          as: "accountCreditNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/creditNoteCash.ejs"),
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
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.C_creditNote_jpg = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_CreditNoteItems,
          as: "cashCreditNoteItem",
          include: [{ model: product, as: "CreditProductCash" }],
        },
        {
          model: Account,
          as: "accountCreditNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/creditNoteCash.ejs"),
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
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.C_creditNote_html = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_CreditNoteItems,
          as: "cashCreditNoteItem",
          include: [{ model: product, as: "CreditProductCash" }],
        },
        {
          model: Account,
          as: "accountCreditNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/creditNoteCash.ejs"),
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
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};

exports.C_creditNote_single_excel = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await C_CreditNote.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_CreditNoteItems,
          as: "cashCreditNoteItem",
          include: [{ model: product, as: "CreditProductCash" }],
        },
        {
          model: Account,
          as: "accountCreditNoCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Credit Note Not Found" });
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
    worksheet.getCell("A1").value = "CREDIT NOTE CASH";
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
    worksheet.getCell("A7").value = `Voucher No.: ${data.creditnoteNo}`;

    worksheet.mergeCells("D2:F2");
    worksheet.getCell("D2").value = data.accountCreditNoCash.accountName;
    worksheet.getCell("D2").font = { bold: true };
    worksheet.getCell("D2").alignment = { horizontal: "right" };

    worksheet.mergeCells("D7:F7");
    worksheet.getCell("D7").value = `Date: ${
      new Date(data.creditdate).toLocaleDateString() ?? "N/A"
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

    data.cashCreditNoteItem.forEach((item, index) => {
      const no = index + 1;
      const productName = item.CreditProductCash.productname;
      const HSNcode = item.CreditProductCash.HSNcode;
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
exports.C_creditNote_excel = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    
    const { formDate, toDate } = req.query;

    const credits = await C_CreditNote.findAll({
      where: {
        creditdate: {
          [Sequelize.Op.between]: [formDate, toDate],
        },
        companyId: companyId,
      },
      include: [
        {
          model: Account,
          as: "accountCreditNoCash",
        },
        { model: User, as: "creditCreateUserCash", attributes: ["username"] },
        { model: User, as: "creditUpdateUserCash", attributes: ["username"] },
      ],
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales");
    worksheet.columns = [
      {
        header: "Credit Note No",
        key: "creditnoteNo",
        width: 10,
      },
      {
        header: "Date",
        key: "creditdate",
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

    for (const credit of credits) {
      const contactPersonName = credit.accountCreditNoCash.contactPersonName;
      const createdBy = credit.creditCreateUserCash.username;
      const updatedBy = credit.creditUpdateUserCash.username;

      worksheet.addRow({
        creditnoteNo: credit.creditnoteNo,
        creditdate: credit.creditdate,
        contactPersonName: contactPersonName,
        mainTotal: credit.mainTotal,
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