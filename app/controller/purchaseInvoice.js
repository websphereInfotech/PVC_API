const { Sequelize } = require("sequelize");
const C_purchaseCash = require("../models/C_purchaseCash");
const C_purchaseCashItem = require("../models/C_purchseCashItem");
const product = require("../models/product");
const Account = require("../models/Account");
const AccountDetail = require("../models/AccountDetail");
const Ledger = require("../models/Ledger");
const C_Ledger = require("../models/C_Ledger");
const purchaseInvoice = require("../models/purchaseInvoice");
const purchaseInvoiceItem = require("../models/purchaseInvoiceItem");
const User = require("../models/user");
const Stock = require("../models/stock");
const { renderFile } = require("ejs");
const path = require("node:path");
const htmlToPdf = require("html-pdf-node");
const Company = require("../models/company");
const puppeteer = require("puppeteer");
const ExcelJS = require("exceljs");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

exports.create_purchaseInvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const companyId = req.user.companyId;
    const {
      accountId,
      duedate,
      invoicedate,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
      supplyInvoiceNo,
      voucherno,
    } = req.body;

    const numberOf = await purchaseInvoice.findOne({
      where: { voucherno: voucherno, companyId: companyId },
    });
    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Voucher Number Already Exists" });
    }
    const supplyInvoiceNoExist = await purchaseInvoice.findOne({
      where: { supplyInvoiceNo: supplyInvoiceNo, companyId: companyId },
    });
    if (supplyInvoiceNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Supply Number Already Exists" });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field Of Items" });
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
          .json({ status: "false", message: "Product Item Not Found" });
      }
    }
    const purchseData = await purchaseInvoice.create({
      accountId,
      duedate,
      invoicedate,
      totalIgst,
      totalSgst,
      totalMrp,
      totalQty,
      mainTotal,
      voucherno,
      supplyInvoiceNo,
      createdBy: user,
      updatedBy: user,
      companyId: companyId,
    });

    await Ledger.create({
      accountId: accountId,
      companyId: companyId,
      purchaseInvId: purchseData.id,
      date: invoicedate,
    });
    const addToItem = items.map((item) => ({
      purchasebillId: purchseData.id,
      ...item,
    }));

    await purchaseInvoiceItem.bulkCreate(addToItem);

    for (const item of items) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) {
        await itemStock.increment("qty", { by: qty });
      }
    }

    const data = await purchaseInvoice.findOne({
      where: { id: purchseData.id, companyId: companyId },
      include: [{ model: purchaseInvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Purchase Invoice Created Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_purchaseInvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const { id } = req.params;
    const companyId = req.user.companyId;
    const {
      accountId,
      duedate,
      invoicedate,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
      supplyInvoiceNo,
      voucherno,
    } = req.body;

    const existingPurchase = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!existingPurchase) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }
    const numberOf = await purchaseInvoice.findOne({
      where: {
        voucherno: voucherno,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Voucher Number Already Exists" });
    }

    const supplyInvoiceNoExist = await purchaseInvoice.findOne({
      where: {
        supplyInvoiceNo: supplyInvoiceNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (supplyInvoiceNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Supply Number Already Exists" });
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
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Item Not Found" });
      }
    }
    await purchaseInvoice.update(
      {
        accountId,
        duedate,
        invoicedate,
        totalIgst,
        totalSgst,
        totalMrp,
        totalQty,
        mainTotal,
        supplyInvoiceNo,
        voucherno,
        companyId: companyId,
        createdBy: existingPurchase.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );

    await Ledger.update(
      {
        accountId: accountId,
        purchaseInvId: id,
        date: invoicedate,
      },
      {
        where: {
          purchaseInvId: id,
          companyId: companyId,
        },
      }
    );
    const existingItems = await purchaseInvoiceItem.findAll({
      where: { purchasebillId: id },
    });

    for (const exItem of existingItems) {
      const preProductId = exItem.productId;
      const previousQty = exItem?.qty ?? 0;
      const itemStock = await Stock.findOne({
        where: { productId: preProductId },
      });
      if (itemStock) {
        await itemStock.decrement("qty", { by: previousQty });
      }
    }

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await purchaseInvoiceItem.update(
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
        await purchaseInvoiceItem.create({
          purchasebillId: id,
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
        await itemStock.increment("qty", { by: newQty });
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await purchaseInvoiceItem.destroy({ where: { id: item.id } });
    }
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: purchaseInvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Purchase Invoice Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_purchaseInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const billId = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!billId) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }
    const findItems = await purchaseInvoiceItem.findAll({
      where: { purchasebillId: billId.id },
    });
    for (const item of findItems) {
      const productname = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productname) {
        return res.status(404).json({
          status: "false",
          message: `Product Not Found`,
        });
      }
    }
    // }
    for (const item of findItems) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) await itemStock.decrement("qty", { by: qty });
    }
    await purchaseInvoiceItem.destroy({ where: { purchasebillId: id } });
    await billId.destroy();
    return res.status(200).json({
      status: "true",
      message: "Purchase Invoice Successfully delete",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_purchaseInvoice = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await purchaseInvoice.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        { model: Account, as: "accountPurchaseInv" },
        { model: User, as: "salesCreateUser", attributes: ["username"] },
        { model: User, as: "salesUpdateUser", attributes: ["username"] },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "All Purchase Invoice show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_purchaseInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        {
          model: Account,
          as: "accountPurchaseInv",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Purchase Invoice show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.purchaseInvoice_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        {
          model: Account,
          as: "accountPurchaseInv",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/purchaseInvoice.ejs"),
      { data: { form: companyData, purchase: data } }
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
exports.purchaseInvoice_jpg = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        {
          model: Account,
          as: "accountPurchaseInv",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/purchaseInvoice.ejs"),
      { data: { form: companyData, purchase: data } }
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
exports.purchaseInvoice_html = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        {
          model: Account,
          as: "accountPurchaseInv",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
    }

    const html = await renderFile(
      path.join(__dirname, "../views/purchaseInvoice.ejs"),
      { data: { form: companyData, purchase: data } }
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
exports.purchaseInvoice_excel = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        {
          model: Account,
          as: "accountPurchaseInv",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Invoice Not Found" });
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
    worksheet.getCell("A1").value = "PURCHASE TAX INVOICE";
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
    worksheet.getCell("A7").value = `Voucher No.: ${data.voucherno}`;

    worksheet.mergeCells("A8:C8");
    worksheet.getCell("A8").value = `Supply Inv. No.: ${
      data?.supplyInvoiceNo ?? "N/A"
    }`;

    worksheet.mergeCells("D2:F2");
    worksheet.getCell("D2").value = data.accountPurchaseInv.accountName;
    worksheet.getCell("D2").font = { bold: true };
    worksheet.getCell("D2").alignment = { horizontal: "right" };

    worksheet.mergeCells("D3:F3");
    worksheet.getCell("D3").value =
      data.accountPurchaseInv?.accountDetail?.address1 ?? "N/A";
    worksheet.getCell("D3").alignment = { horizontal: "right" };

    worksheet.mergeCells("D4:F4");
    worksheet.getCell("D4").value =
      `${data.accountPurchaseInv?.accountDetail?.city}, ${data.accountPurchaseInv?.accountDetail?.state} - ${data.accountPurchaseInv?.accountDetail?.pincode}` ??
      "N/A";
    worksheet.getCell("D4").alignment = { horizontal: "right" };

    worksheet.mergeCells("D5:F5");
    worksheet.getCell("D5").value = `GSTIN/UIN: ${
      data.accountPurchaseInv?.accountDetail?.gstNumber ?? "Unregistered"
    }`;
    worksheet.getCell("D5").alignment = { horizontal: "right" };

    worksheet.mergeCells("D7:F7");
    worksheet.getCell("D7").value = `Inv. Date: ${
      new Date(data.invoicedate).toLocaleDateString() ?? "N/A"
    }`;
    worksheet.getCell("D7").alignment = { horizontal: "right" };

    worksheet.mergeCells("D8:F8");
    worksheet.getCell("D8").value = `Due Date: ${
      new Date(data.duedate).toLocaleDateString() ?? "N/A"
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
      const productName = item.purchseProduct.productname;
      const HSNcode = item.purchseProduct.HSNcode;
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
exports.get_all_purchaseInvoice_excel = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { formDate, toDate } = req.query;

    const Purchase = await purchaseInvoice.findAll({
      where: {
        invoicedate: {
          [Sequelize.Op.between]: [formDate, toDate],
        },
        companyId: companyId,
      },
      include: [
        {
          model: Account,
          as: "accountPurchaseInv",
        },
        { model: User, as: "salesCreateUser", attributes: ["username"] },
        { model: User, as: "salesUpdateUser", attributes: ["username"] },
      ],
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Purchase");
    worksheet.columns = [
      {
        header: "Voucher No",
        key: "voucherno",
        width: 10,
      },
      {
        header: "Invoice Date",
        key: "invoicedate",
        width: 10,
      },
      {
        header: "Party",
        key: "accountName",
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

    for (const purchase of Purchase) {
      const accountName = purchase.accountPurchaseInv.accountName;
      const createdBy = purchase.salesCreateUser.username;
      const updatedBy = purchase.salesUpdateUser.username;

      worksheet.addRow({
        voucherno: purchase.voucherno,
        invoicedate: purchase.invoicedate,
        accountName: accountName,
        mainTotal: purchase.mainTotal,
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
                                           Type C API
 ============================================================================================================ */

exports.C_create_purchaseCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const { accountId, purchaseNo, date, totalMrp, items } = req.body;
    const companyId = req.user.companyId;

    const purchaseNoExist = await C_purchaseCash.findOne({
      where: {
        purchaseNo: purchaseNo,
        companyId: companyId,
      },
    });
    if (purchaseNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Purchase Number Already Exists" });
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
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Item Not Found" });
      }
    }
    const purchseData = await C_purchaseCash.create({
      accountId,
      date,
      totalMrp,
      purchaseNo: purchaseNo,
      companyId: companyId,
      createdBy: user,
      updatedBy: user,
    });

    // await C_vendorLedger.create({
    //   vendorId,
    //   companyId: req.user.companyId,
    //   debitId: purchseData.id,
    //   date,
    // });

    await C_Ledger.create({
      accountId: accountId,
      companyId: companyId,
      purchaseId: purchseData.id,
      date: date,
    });

    const addToItem = items.map((item) => ({
      PurchaseId: purchseData.id,
      ...item,
    }));

    await C_purchaseCashItem.bulkCreate(addToItem);
    for (const item of items) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) {
        await itemStock.increment("qty", { by: qty });
      }
    }

    const data = await C_purchaseCash.findOne({
      where: { id: purchseData.id },
      include: [{ model: C_purchaseCashItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Purchase Cash Created Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_update_purchaseCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const companyId = req.user.companyId;

    const { id } = req.params;

    const { accountId, purchaseNo, date, totalMrp, items } = req.body;

    const existingPurchase = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!existingPurchase) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }

    const purchaseNoExist = await C_purchaseCash.findOne({
      where: {
        purchaseNo: purchaseNo,
        companyId: companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });
    if (purchaseNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Purchase Number Already Exists" });
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
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Item Not Found" });
      }
    }
    await C_purchaseCash.update(
      {
        accountId,
        date,
        totalMrp,
        purchaseNo: purchaseNo,
        companyId: companyId,
        createdBy: existingPurchase.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );

    await C_Ledger.update(
      {
        accountId: accountId,
        purchaseId: id,
        date: date,
      },
      {
        where: {
          purchaseId: id,
          companyId: companyId,
        },
      }
    );
    const existingItems = await C_purchaseCashItem.findAll({
      where: { PurchaseId: id },
    });
    for (const exItem of existingItems) {
      const preProductId = exItem.productId;
      const previousQty = exItem?.qty ?? 0;
      const itemStock = await Stock.findOne({
        where: { productId: preProductId },
      });
      if (itemStock) {
        await itemStock.decrement("qty", { by: previousQty });
      }
    }
    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);
      if (existingItem) {
        await C_purchaseCashItem.update(
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
        await C_purchaseCashItem.create({
          PurchaseId: id,
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
        await itemStock.increment("qty", { by: newQty });
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await C_purchaseCashItem.destroy({ where: { id: item.id } });
    }

    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: C_purchaseCashItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Purchase Cash Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_delete_purchaseCash = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const billId = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!billId) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }

    const findItems = await C_purchaseCashItem.findAll({
      where: { PurchaseId: billId.id },
    });

    for (const item of findItems) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: { productId },
      });
      if (itemStock) {
        await itemStock.decrement("qty", { by: qty });
      }
    }

    await billId.destroy();
    return res
      .status(200)
      .json({ status: "true", message: "Purchase Cash Delete Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_get_all_purchaseCash = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await C_purchaseCash.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: product, as: "ProductPurchase" }],
        },
        { model: Account, as: "accountPurchaseCash" },
        { model: User, as: "purchaseCreateUser", attributes: ["username"] },
        { model: User, as: "purchaseUpdateUser", attributes: ["username"] },
      ],
    });

    return res.status(200).json({
      status: "true",
      message: "All Purchase Cash show Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_view_purchaseCash = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: product, as: "ProductPurchase" }],
        },
        { model: Account, as: "accountPurchaseCash" },
      ],
    });
    if (data) {
      return res.status(200).json({
        status: "true",
        message: "Purchase Cash show Successfully",
        data: data,
      });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Cash Not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.C_view_purchaseCash_pdf = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: product, as: "ProductPurchase" }],
        },
        { model: Account, as: "accountPurchaseCash" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Cash Not Found" });
    }
    const html = await renderFile(
      path.join(__dirname, "../views/purchaseCash.ejs"),
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
exports.C_view_purchaseCash_jpg = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: product, as: "ProductPurchase" }],
        },
        { model: Account, as: "accountPurchaseCash" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Cash Not Found" });
    }
    const html = await renderFile(
      path.join(__dirname, "../views/purchaseCash.ejs"),
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
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};
exports.C_purchaseCash_html = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: product, as: "ProductPurchase" }],
        },
        { model: Account, as: "accountPurchaseCash" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Cash Not Found" });
    }
    const html = await renderFile(
      path.join(__dirname, "../views/purchaseCash.ejs"),
      { data }
    );
    const base64HTML = Buffer.from(html).toString("base64");

    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({
      status: "Success",
      message: "Html Document Created Successfully",
      data: base64HTML,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};
exports.C_purchaseInvoice_excel = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const companyData = await Company.findByPk(companyId);
    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: product, as: "ProductPurchase" }],
        },
        {
          model: Account,
          as: "accountPurchaseCash",
          include: { model: AccountDetail, as: "accountDetail" },
        },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purchase Cash Not Found" });
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
    worksheet.getCell("A1").value = "PURCHASE CASH INVOICE";
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
    worksheet.getCell("A7").value = `Invoice No.: ${data.purchaseNo}`;

    worksheet.mergeCells("D2:F2");
    worksheet.getCell("D2").value = data.accountPurchaseCash.contactPersonName;
    worksheet.getCell("D2").font = { bold: true };
    worksheet.getCell("D2").alignment = { horizontal: "right" };

    worksheet.mergeCells("D3:F3");
    worksheet.getCell("D3").value =
      data.accountPurchaseCash?.accountDetail?.address1 ?? "N/A";
    worksheet.getCell("D3").alignment = { horizontal: "right" };

    worksheet.mergeCells("D4:F4");
    worksheet.getCell("D4").value =
      `${data.accountPurchaseCash?.accountDetail?.city}, ${data.accountPurchaseCash?.accountDetail?.state} - ${data.accountPurchaseCash?.accountDetail?.pincode}` ??
      "N/A";
    worksheet.getCell("D4").alignment = { horizontal: "right" };

    worksheet.mergeCells("D5:F5");
    worksheet.getCell("D5").value = `GSTIN/UIN: ${
      data.accountPurchaseCash?.accountDetail?.gstNumber ?? "Unregistered"
    }`;
    worksheet.getCell("D5").alignment = { horizontal: "right" };

    worksheet.mergeCells("D7:F7");
    worksheet.getCell("D7").value = `Inv. Date: ${
      new Date(data.date).toLocaleDateString() ?? "N/A"
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
      const productName = item.ProductPurchase.productname;
      const HSNcode = item.ProductPurchase.HSNcode;
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
exports.C_purchaseinvoice_all_excel = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    
    const { formDate, toDate } = req.query;

    const purchses = await C_purchaseCash.findAll({
      where: {
        date: {
          [Sequelize.Op.between]: [formDate, toDate],
        },
        companyId: companyId,
      },
      include: [
        {
          model: Account,
          as: "accountPurchaseCash",
        },
        { model: User, as: "purchaseCreateUser", attributes: ["username"] },
        { model: User, as: "purchaseUpdateUser", attributes: ["username"] },
      ],
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Purchase");
    worksheet.columns = [
      {
        header: "Purchase No",
        key: "purchaseNo",
        width: 10,
      },
      {
        header: "Invoice Date",
        key: "date",
        width: 10,
      },
      {
        header: "Party",
        key: "contactPersonName",
        width: 15,
      },
      {
        header: "Total Amount",
        key: "totalMrp",
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

    for (const purchse of purchses) {
      const contactPersonName = purchse.accountPurchaseCash.contactPersonName;
      const createdBy = purchse.purchaseCreateUser.username;
      const updatedBy = purchse.purchaseUpdateUser.username;

      worksheet.addRow({
        purchaseNo: purchse.purchaseNo,
        date: purchse.date,
        contactPersonName: contactPersonName,
        totalMrp: purchse.totalMrp,
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