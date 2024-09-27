const { Sequelize } = require("sequelize");
const C_salesinvoice = require("../models/C_salesinvoice");
const C_salesinvoiceItem = require("../models/C_salesinvoiceItem");
const ProFormaInvoice = require("../models/ProFormaInvoice");
const Account = require("../models/Account");
const Ledger = require("../models/Ledger");
const product = require("../models/product");
const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");
const User = require("../models/user");
const Stock = require("../models/stock");
const { renderFile } = require("ejs");
const path = require("node:path");
const htmlToPdf = require("html-pdf-node");
const AccountDetail = require("../models/AccountDetail");
const C_Ledger = require("../models/C_Ledger");
const company = require("../models/company");
const ExcelJS = require("exceljs");
const puppeteer = require("puppeteer");
/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */
exports.create_salesInvoice = async (req, res) => {
  try {
    const userID = req.user.userId;
    const companyId = req.user.companyId;
    const {
      accountId,
      invoiceno,
      invoicedate,
      proFormaNo,
      dispatchThrough,
      dispatchno,
      deliverydate,
      destination,
      LL_RR_no,
      terms,
      motorVehicleNo,
      termsOfDelivery,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    if (proFormaNo) {
      const proformaData = await ProFormaInvoice.findOne({
        where: { ProFormaInvoice_no: proFormaNo, companyId: companyId },
      });
      if (!proformaData) {
        return res
          .status(404)
          .json({ status: "false", message: "ProForma Not Found" });
      }
    }
    const numberOf = await salesInvoice.findOne({
      where: { invoiceno: invoiceno, companyId: companyId },
    });

    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Invoice Number Already Exists" });
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
        .json({ status: "false", message: "Required Field Of Items" });
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
        where: {
          id: item.productId,
          companyId: companyId,
          isActive: true,
        },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }

    const data = await salesInvoice.create({
      accountId,
      dispatchThrough,
      dispatchno,
      destination,
      deliverydate,
      LL_RR_no,
      terms,
      motorVehicleNo,
      invoiceno,
      invoicedate,
      termsOfDelivery,
      proFormaNo,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      createdBy: userID,
      updatedBy: userID,
      companyId: companyId,
    });

    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      saleInvId: data.id,
      date: invoicedate,
    });
    const addToItem = items.map((item) => ({
      salesInvoiceId: data.id,
      ...item,
    }));

    await salesInvoiceItem.bulkCreate(addToItem);

    for (const item of items) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) {
        await itemStock.decrement("qty", { by: qty });
      }
    }

    const salesInvoiceData = await salesInvoice.findOne({
      where: { id: data.id, companyId: companyId },
      include: [{ model: salesInvoiceItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Create Successfully",
      data: salesInvoiceData,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_salesInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await salesInvoice.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        { model: Account, as: "accountSaleInv" },
        { model: User, as: "createUser", attributes: ["username"] },
        { model: User, as: "updateUser", attributes: ["username"] },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const data = await salesInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        {
          model: Account,
          as: "accountSaleInv",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    return res.status(200).json({
      status: "ture",
      message: "Sales Invoice Data Fetch SUccessfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_salesInvoice = async (req, res) => {
  try {
    const userID = req.user.userId;
    const companyId = req.user.companyId;

    const { id } = req.params;
    const {
      accountId,
      dispatchThrough,
      dispatchno,
      destination,
      deliverydate,
      LL_RR_no,
      motorVehicleNo,
      invoiceno,
      terms,
      invoicedate,
      termsOfDelivery,
      proFormaNo,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const salesId = await salesInvoice.findOne({
      where: { id, companyId: companyId },
    });

    if (!salesId) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    const numberOf = await salesInvoice.findOne({
      where: {
        invoiceno: invoiceno,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });

    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Invoice Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (proFormaNo) {
      // Check if proFormaId is provided
      const proformaData = await ProFormaInvoice.findOne({
        where: { ProFormaInvoice_no: proFormaNo, companyId: companyId },
      });

      if (!proformaData) {
        return res
          .status(404)
          .json({ status: "false", message: "ProForma Not Found" });
      }
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    const existingItems = await salesInvoiceItem.findAll({
      where: { salesInvoiceId: id },
    });

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
    await salesInvoice.update(
      {
        accountId,
        dispatchThrough,
        dispatchno,
        destination,
        deliverydate,
        LL_RR_no,
        terms,
        motorVehicleNo,
        invoiceno,
        invoicedate,
        termsOfDelivery,
        proFormaNo,
        totalIgst,
        totalSgst,
        totalMrp,
        mainTotal,
        totalQty,
        companyId: companyId,
        createdBy: salesId.createdBy,
        updatedBy: userID,
      },
      {
        where: { id: id },
      }
    );
    await Ledger.update(
      {
        accountId: accountId,
        saleInvId: id,
        date: invoicedate,
      },
      {
        where: {
          saleInvId: id,
          companyId: companyId,
        },
      }
    );

    for (const exItem of existingItems) {
      const preProductId = exItem.productId;
      const previousQty = exItem?.qty ?? 0;
      const itemStock = await Stock.findOne({
        where: { productId: preProductId },
      });
      if (itemStock) {
        await itemStock.increment("qty", { by: previousQty });
      }
    }

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await salesInvoiceItem.update(
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
        await salesInvoiceItem.create({
          salesInvoiceId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
          unit: item.unit,
        });
      }
      const productId = item.productId;
      const newQty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) {
        await itemStock.decrement("qty", { by: newQty });
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await salesInvoiceItem.destroy({ where: { id: item.id } });
    }

    const data = await salesInvoice.findOne({
      where: { id, companyId: companyId },
      include: [{ model: salesInvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Update Successfuly",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_salesInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;
    const data = await salesInvoice.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    const findItems = await salesInvoiceItem.findAll({
      where: { salesInvoiceId: id },
    });
    for (const item of findItems) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) await itemStock.increment("qty", { by: qty });
    }
    await salesInvoiceItem.destroy({ where: { salesInvoiceId: id } });
    await data.destroy();
    return res
      .status(200)
      .json({ status: "true", message: "Sales Invoice Delete Successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.salesInvoice_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const companyData = await company.findByPk(companyId);

    const data = await salesInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        {
          model: Account,
          as: "accountSaleInv",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    const html = await renderFile(
      path.join(__dirname, "../views/saleInvoice.ejs"),
      { data: { form: companyData, sales: data } }
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
exports.salesInvoice_excel = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { formDate, toDate } = req.query;

    const sales = await salesInvoice.findAll({
      where: {
        invoicedate: {
          [Sequelize.Op.between]: [formDate, toDate],
        },
        companyId: companyId,
      },
      include: [
        {
          model: Account,
          as: "accountSaleInv",
        },
        { model: User, as: "createUser", attributes: ["username"] },
        { model: User, as: "updateUser", attributes: ["username"] },
      ],
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sales");
    worksheet.columns = [
      {
        header: "Invoice No",
        key: "invoiceno",
        width: 10,
      },
      {
        header: "Invoice Date",
        key: "invoicedate",
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

    for (const sale of sales) {
      const accountname = sale.accountSaleInv.accountName;
      const createdBy = sale.createUser.username;
      const updatedBy = sale.updateUser.username;

      worksheet.addRow({
        invoiceno: sale.invoiceno,
        invoicedate: sale.invoicedate,
        accountname: accountname,
        mainTotal: sale.mainTotal,
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

exports.view_salesInvoice_excel = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const companyData = await company.findByPk(companyId);

    const data = await salesInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        {
          model: Account,
          as: "accountSaleInv",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoice");

    worksheet.getColumn("A").width = 20;
    worksheet.getColumn("B").width = 20;
    worksheet.getColumn("C").width = 20;
    worksheet.getColumn("D").width = 20;
    worksheet.getColumn("E").width = 20;
    worksheet.getColumn("F").width = 20;

    //Left Side
    worksheet.mergeCells("A1:F1");
    worksheet.getCell("A1").value = "SALE TAX INVOICE";
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
    worksheet.getCell("A7").value = `Invoice No.: ${data.invoiceno}`;

    worksheet.mergeCells("A8:C8");
    worksheet.getCell("A8").value = `Dispatch Doc No.: ${
      data?.dispatchno ?? "N/A"
    }`;

    worksheet.mergeCells("A9:C9");
    worksheet.getCell("A9").value = `Dispatched through: ${
      data?.dispatchThrough ?? "N/A"
    }`;

    // Right side....
    worksheet.mergeCells("D2:F2");
    worksheet.getCell("D2").value = data.accountSaleInv.accountName;
    worksheet.getCell("D2").font = { bold: true };
    worksheet.getCell("D2").alignment = { horizontal: "right" };

    worksheet.mergeCells("D3:F3");
    worksheet.getCell("D3").value =
      data.accountSaleInv?.accountDetail?.address1 ?? "N/A";
    worksheet.getCell("D3").alignment = { horizontal: "right" };

    worksheet.mergeCells("D4:F4");
    worksheet.getCell("D4").value =
      `${data.accountSaleInv?.accountDetail?.city}, ${data.accountSaleInv?.accountDetail?.state} - ${data.accountSaleInv?.accountDetail?.pincode}` ??
      "N/A";
    worksheet.getCell("D4").alignment = { horizontal: "right" };

    worksheet.mergeCells("D5:F5");
    worksheet.getCell("D5").value = `GSTIN/UIN: ${
      data.accountSaleInv?.accountDetail?.gstNumber ?? "Unregistered"
    }`;
    worksheet.getCell("D5").alignment = { horizontal: "right" };

    worksheet.mergeCells("D7:F7");
    worksheet.getCell("D7").value = `Date: ${
      new Date(data.invoicedate).toLocaleDateString() ?? "N/A"
    }`;
    worksheet.getCell("D7").alignment = { horizontal: "right" };

    worksheet.mergeCells("D8:F8");
    worksheet.getCell("D8").value = "Delivery Note: ---";
    worksheet.getCell("D8").alignment = { horizontal: "right" };

    worksheet.mergeCells("D9:F9");
    worksheet.getCell("D9").value = `Destination: ${data.destination ?? "N/A"}`;
    worksheet.getCell("D9").alignment = { horizontal: "right" };

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
      const productName = item.InvoiceProduct.productname;
      const HSNcode = item.InvoiceProduct.HSNcode;
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

exports.view_salesInvoice_jpg = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const companyData = await company.findByPk(companyId);

    const data = await salesInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        {
          model: Account,
          as: "accountSaleInv",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    const html = await renderFile(
      path.join(__dirname, "../views/saleInvoice.ejs"),
      { data: { form: companyData, sales: data } }
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

/*=============================================================================================================
                                           Type C API
 ============================================================================================================ */

exports.C_create_salesinvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const { saleNo, accountId, date, totalMrp, items } = req.body;
    const companyId = req.user.companyId;

    const salesNoExist = await C_salesinvoice.findOne({
      where: {
        saleNo: saleNo,
        companyId: companyId,
      },
    });
    if (salesNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Sales Number Already Exists." });
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
        .json({ status: "false", message: "Required Field of items" });
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
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const salesInvoiceData = await C_salesinvoice.create({
      accountId,
      date,
      totalMrp,
      saleNo: saleNo,
      companyId: companyId,
      createdBy: user,
      updatedBy: user,
    });

    const addToProduct = await items.map((item) => ({
      invoiceId: salesInvoiceData.id,
      ...item,
    }));
    await C_salesinvoiceItem.bulkCreate(addToProduct);
    for (const item of items) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) {
        await itemStock.decrement("qty", { by: qty });
      }
    }

    await C_Ledger.create({
      accountId: accountId,
      companyId: companyId,
      saleId: salesInvoiceData.id,
      date: date,
    });

    const data = await C_salesinvoice.findOne({
      where: { id: salesInvoiceData.id, companyId: companyId },
      include: [{ model: C_salesinvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Sales Cash Created Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_update_salesinvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const companyId = req.user.companyId;

    const { id } = req.params;
    const { accountId, saleNo, date, totalMrp, items } = req.body;

    const existingInvoice = await C_salesinvoice.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!existingInvoice) {
      return res.status(404).json({
        status: "false",
        message: "Sales Cash Not Found",
      });
    }

    const salesNoExist = await C_salesinvoice.findOne({
      where: {
        saleNo: saleNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (salesNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Sale Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });

    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    const existingItems = await C_salesinvoiceItem.findAll({
      where: { invoiceId: id },
    });
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
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await C_salesinvoice.update(
      {
        accountId,
        date,
        totalMrp,
        saleNo: saleNo,
        companyId: companyId,
        createdBy: existingInvoice.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );

    for (const exItem of existingItems) {
      const preProductId = exItem.productId;
      const previousQty = exItem?.qty ?? 0;
      const itemStock = await Stock.findOne({
        where: { productId: preProductId },
      });
      if (itemStock) {
        await itemStock.increment("qty", { by: previousQty });
      }
    }

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await C_salesinvoiceItem.update(
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
        await C_salesinvoiceItem.create({
          invoiceId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
          unit: item.unit,
        });
      }
      const productId = item.productId;
      const newQty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) {
        await itemStock.decrement("qty", { by: newQty });
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await C_salesinvoiceItem.destroy({ where: { id: item.id } });
    }

    await C_Ledger.update(
      {
        accountId: accountId,
        saleId: id,
        date: date,
      },
      {
        where: {
          saleId: id,
          companyId: companyId,
        },
      }
    );

    const updatedInvoice = await C_salesinvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: C_salesinvoiceItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Sales Cash Updated Successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_get_all_salesInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await C_salesinvoice.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: C_salesinvoiceItem,
          as: "items",
          include: [{ model: product, as: "CashProduct" }],
        },
        { model: Account, as: "accountSaleCash" },
        { model: User, as: "salesInvoiceCreate", attributes: ["username"] },
        { model: User, as: "salesInvoiceUpdate", attributes: ["username"] },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Cash Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Sales Cash Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_view_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const data = await C_salesinvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_salesinvoiceItem,
          as: "items",
          include: [{ model: product, as: "CashProduct" }],
        },
        { model: Account, as: "accountSaleCash" },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Cash Not Found" });
    }
    return res.status(200).json({
      status: "ture",
      message: "Sales Invoice Data Fetch SUccessfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_delete_salesInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_salesinvoice.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    const findItems = await C_salesinvoiceItem.findAll({
      where: { invoiceId: id },
    });
    for (const item of findItems) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) await itemStock.increment("qty", { by: qty });
    }
    await C_salesinvoiceItem.destroy({ where: { invoiceId: id } });
    await data.destroy();
    return res
      .status(200)
      .json({ status: "true", message: "Sales Cash Delete Successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_view_salesInvoice_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const data = await C_salesinvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_salesinvoiceItem,
          as: "items",
          include: [{ model: product, as: "CashProduct" }],
        },
        { model: Account, as: "accountSaleCash" },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Cash Not Found" });
    }
    const html = await renderFile(
      path.join(__dirname, "../views/salesCash.ejs"),
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
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};
