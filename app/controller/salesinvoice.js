const { Sequelize } = require("sequelize");
const C_salesinvoice = require("../models/C_salesinvoice");
const C_salesinvoiceItem = require("../models/C_salesinvoiceItem");
const ProFormaInvoice = require("../models/ProFormaInvoice");
const customer = require("../models/customer");
const customerLedger = require("../models/customerLedger");
const Account = require("../models/Account");
const product = require("../models/product");
const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");
const User = require("../models/user");
const Stock = require("../models/stock");
const {renderFile} = require("ejs");
const path = require("node:path");
const htmlToPdf = require("html-pdf-node");

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
          isActive: true
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
    await customerLedger.create({
      customerId,
      companyId: req.user.companyId,
      creditId: data.id,
      date: invoicedate,
    });

    // await customerLedger.create({
    //   customerId,
    //   companyId: req.user.companyId,
    //   creditId: data.id,
    //   date: invoicedate,
    // });
    const addToItem = items.map((item) => ({
      salesInvoiceId: data.id,
      ...item,
    }));

    await salesInvoiceItem.bulkCreate(addToItem);

    for(const item of items){
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock){
        await itemStock.decrement('qty',{by: qty})
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
    const companyId = req.user.companyId
    const data = await salesInvoice.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        { model: Account, as: "accountInvoice" },
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
    const companyId = req.user.companyId

    const data = await salesInvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        { model: Account, as: "accountInvoice" },
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
      where: { id: accountId, companyId: companyId },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    if (proFormaNo) { // Check if proFormaId is provided
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

    // const filteredExistingItems = existingItems.filter(existingItem =>
    //     items.some(insertItem => insertItem.id === existingItem.id)
    // );
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

    await customerLedger.update(
      {
        customerId,
        companyId: req.user.companyId,
        date: invoicedate,
      },
      { where: { creditId: id } }
    );

    // await customerLedger.update(
    //     {
    //       customerId,
    //       companyId: req.user.companyId,
    //       date: invoicedate,
    //     },
    //     { where: { creditId: id } }
    // );

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await salesInvoiceItem.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
            unit: item.unit,
            productId: item.productId
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
          unit: item.unit
        });
      }
      const productId = item.productId;
      const previousQty = existingItem?.qty ?? 0;
      const newQty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock){
        await itemStock.increment('qty',{by: previousQty})
        await itemStock.decrement('qty',{by: newQty})
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock) await itemStock.increment('qty',{by: qty})
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
    })
    for(const item of findItems){
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock) await itemStock.increment('qty',{by: qty})
    }
    await salesInvoiceItem.destroy({ where: { salesInvoiceId: id } })
    await data.destroy()
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
        companyId: companyId
      }
    });
    if(salesNoExist){
      return res
          .status(400)
          .json({ status: "false", message: "Sales Number Already Exists." });
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
    for(const item of items){
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock){
        await itemStock.decrement('qty',{by: qty})
      }
    }

    const data = await C_salesinvoice.findOne({
      where: { id: salesInvoiceData.id, companyId: companyId },
      include: [{ model: C_salesinvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Created Successfully",
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
    const companyId = req.user.companyId

    const { id } = req.params;
    const { accountId, saleNo, date, totalMrp, items } = req.body;

    const existingInvoice = await C_salesinvoice.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!existingInvoice) {
      return res.status(404).json({
        status: "false",
        message: "Sales Invoice Not Found",
      });
    }

    const salesNoExist = await C_salesinvoice.findOne({
      where: {
        saleNo: saleNo,
        companyId: companyId,
        id: {[Sequelize.Op.ne]: id}
      }
    })
    if(salesNoExist){
      return res
          .status(400)
          .json({ status: "false", message: "Sale Number Already Exists" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId },
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

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await C_salesinvoiceItem.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
            unit: item.unit,
            productId: item.productId
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
          unit: item.unit
        });
      }
      const productId = item.productId;
      const previousQty = existingItem?.qty ?? 0;
      const newQty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock){
        await itemStock.increment('qty',{by: previousQty})
        await itemStock.decrement('qty',{by: newQty})
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock) await itemStock.increment('qty',{by: qty})
      await
      C_salesinvoiceItem.destroy({ where: { id: item.id } });
    }

    const updatedInvoice = await C_salesinvoice.findOne({
      where: { id: id, companyId: companyId },
      include: [{ model: C_salesinvoiceItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Sales Invoice Updated Successfully",
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
        { model: Account, as: "accountCashSale" },
        { model: User, as: "salesInvoiceCreate", attributes: ["username"] },
        { model: User, as: "salesInvoiceUpdate", attributes: ["username"] },
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
        { model: Account, as: "accountCashSale" },
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
    })
    for(const item of findItems){
      const productId = item.productId;
      const qty = item.qty;
      const itemStock = await Stock.findOne({
        where: {productId}
      })
      if(itemStock) await itemStock.increment('qty',{by: qty})
    }
    await C_salesinvoiceItem.destroy({ where: { invoiceId: id } })
    await data.destroy()
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
exports.C_view_salesInvoice_pdf = async (req, res)=>{
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
        { model: Account, as: "accountCashSale" },
      ],
    });

    if (!data) {
      return res
          .status(404)
          .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    const html = await renderFile(path.join(__dirname, "../views/salesCash.ejs"),{data})
    htmlToPdf.generatePdf({content: html},{printBackground: true, format: 'A4'}).then((pdf) => {
      const base64String = pdf.toString("base64");
      return res.status(200).json({
        status: "Success",
        message: "pdf create successFully",
        data: base64String,
      });
    })
  }catch (e) {
    console.error(e);
    return res.status(500).json({status: "false", message: "Internal Server Error."});
  }
}
