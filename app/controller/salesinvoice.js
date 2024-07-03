const { Sequelize } = require("sequelize");
const C_customer = require("../models/C_customer");
const C_customerLedger = require("../models/C_customerLedger");
const C_product = require("../models/C_product");
const C_salesinvoice = require("../models/C_salesinvoice");
const C_salesinvoiceItem = require("../models/C_salesinvoiceItem");
const ProFormaInvoice = require("../models/ProFormaInvoice");
const customer = require("../models/customer");
const customerLedger = require("../models/customerLedger");
const product = require("../models/product");
const salesInvoice = require("../models/salesInvoice");
const salesInvoiceItem = require("../models/salesInvoiceitem");
const User = require("../models/user");
const Stock = require("../models/stock");
const C_Stock = require("../models/C_stock");
// const {lowStockWaring} = require("../constant/common");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */
exports.create_salesInvoice = async (req, res) => {
  try {
    const userID = req.user.userId;
    const {
      customerId,
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
        where: { ProFormaInvoice_no: proFormaNo, companyId: req.user.companyId },
      });
      if (!proformaData) {
        return res
            .status(404)
            .json({ status: "false", message: "ProForma Not Found" });
      }
    }
    // for (const item of items) {
    //   const mrp = item.qty * item.rate;
    //   if (item.mrp !== mrp) {
    //     return res.status(400).json({
    //       status: "false",
    //       message: `MRP for item ${item.productId} does not match the calculated value`,
    //     });
    //   }
    // }
    // const totalMrpFromItems = items.reduce((total, item) => {
    //   return total + (item.qty * item.rate);
    // }, 0);

    // if (totalMrp !== totalMrpFromItems) {
    //   return res.status(400).json({
    //     status: "false",
    //     message: "Total MRP Not Match",
    //   });
    // }
    const numberOf = await salesInvoice.findOne({
      where: { invoiceno: invoiceno, companyId: req.user.companyId },
    });

    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Invoice Number Already Exists" });
    }
    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    const customerData = await customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });
    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
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
          companyId: req.user.companyId,
          isActive: true
        },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
      // const productId = productname.id;
      //
      // const qtys = items.reduce((acc, item) => {
      //   if (item.productId === productId) {
      //     return acc + item.qty;
      //   }
      //   return acc;
      // }, 0);
      // const productStock = await Stock.findOne({where: {productId: item.productId}})
      // const totalProductQty = productStock?.qty ?? 0;
      // const isLawStock = await lowStockWaring(productname.lowstock, productname.lowStockQty, qtys, totalProductQty, productname.nagativeqty)
      // if(isLawStock) return res.status(400).json({status: "false", message: `Low Stock in ${productname.productname} Product`});
    }

    const data = await salesInvoice.create({
      customerId,
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
      companyId: req.user.companyId,
    });
    await customerLedger.create({
      customerId,
      companyId: req.user.companyId,
      creditId: data.id,
      date: invoicedate,
    });
    const addToItem = items.map((item) => ({
      salesInvoiceId: data.id,
      ...item,
    }));

    await salesInvoiceItem.bulkCreate(addToItem);

    for(const item of items){
      const productId = item.productId;
      const qty = item.qty;
      const productStock = await Stock.findOne({
        where: {productId}
      })
      if(productStock){
        await productStock.decrement('qty',{by: qty})
      }
    }

    const salesInvoiceData = await salesInvoice.findOne({
      where: { id: data.id, companyId: req.user.companyId },
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
    const data = await salesInvoice.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        { model: customer, as: "InvioceCustomer" },
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

    const data = await salesInvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [
        {
          model: salesInvoiceItem,
          as: "items",
          include: [{ model: product, as: "InvoiceProduct" }],
        },
        { model: customer, as: "InvioceCustomer" },
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

    const { id } = req.params;
    const {
      customerId,
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
      where: { id, companyId: req.user.companyId },
    });

    if (!salesId) {
      return res
        .status(404)
        .json({ status: "false", message: "Sales Invoice Not Found" });
    }
    const numberOf = await salesInvoice.findOne({
      where: {
        invoiceno: invoiceno,
        companyId: req.user.companyId,
        id: { [Sequelize.Op.ne]: id },
      },
    });

    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Invoice Number Already Exists" });
    }
    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    const customerData = await customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });
    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Customer Not Found" });
    }
    if (proFormaNo) { // Check if proFormaId is provided
      const proformaData = await ProFormaInvoice.findOne({
        where: { ProFormaInvoice_no: proFormaNo, companyId: req.user.companyId },
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
        where: { id: item.productId, companyId: req.user.companyId, isActive: true },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }

      // const productId = item.productId;
      // const qtys = items.reduce((acc, item) => {
      //   if (item.productId === productId) {
      //     return acc + item.qty;
      //   }
      //   return acc;
      // }, 0);
      //
      //
      // const existingItemsQty = filteredExistingItems.reduce((acc, item) => {
      //   if (item.productId === productId) {
      //     return acc + item.qty;
      //   }
      //   return acc;
      // }, 0);
      //
      // const productStock = await Stock.findOne({where: {productId: item.productId}})
      // const totalProductQty = productStock?.qty ?? 0;
      // const tempQty = qtys - existingItemsQty;
      // const isLawStock = await lowStockWaring(productname.lowstock, productname.lowStockQty, tempQty, totalProductQty, productname.nagativeqty)
      // if(isLawStock) return res.status(400).json({status: "false", message: `Low Stock in ${productname.productname} Product`});
    }
    await salesInvoice.update(
      {
        customerId,
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
        companyId: req.user.companyId,
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
      const productStock = await Stock.findOne({
        where: {productId}
      })
      if(productStock){
        await productStock.increment('qty',{by: previousQty})
        await productStock.decrement('qty',{by: newQty})
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      const productId = item.productId;
      const qty = item.qty;
      const productStock = await Stock.findOne({
        where: {productId}
      })
      if(productStock) await productStock.increment('qty',{by: qty})
      await salesInvoiceItem.destroy({ where: { id: item.id } });
    }

    const data = await salesInvoice.findOne({
      where: { id, companyId: req.user.companyId },
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
    const { id } = req.params;
    const data = await salesInvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
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
      const productStock = await Stock.findOne({
        where: {productId}
      })
      if(productStock) await productStock.increment('qty',{by: qty})
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
    const { customerId, date, totalMrp, items } = req.body;

    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    const customerData = await C_customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });

    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Cusomer Not Found" });
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
      const productData = await C_product.findOne({
        where: { id: item.productId, companyId: req.user.companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
      // const productCashStock = await C_Stock.findOne({where: {productId: item.productId}})
      // const totalProductQty = productCashStock?.qty ?? 0;
      // const isLawStock = await lowStockWaring(productData.lowstock, productData.lowStockQty, item.qty, totalProductQty, productData.nagativeqty)
      // if(isLawStock) return res.status(400).json({status: "false", message: `Low Stock in ${productData.productname} Product`});
    }
    const salesInvoiceData = await C_salesinvoice.create({
      customerId,
      date,
      totalMrp,
      companyId: req.user.companyId,
      createdBy: user,
      updatedBy: user,
    });

    await C_customerLedger.create({
      customerId,
      companyId: req.user.companyId,
      creditId: salesInvoiceData.id,
      date,
    });

    const addToProduct = await items.map((item) => ({
      invoiceId: salesInvoiceData.id,
      ...item,
    }));
    await C_salesinvoiceItem.bulkCreate(addToProduct);
    for(const item of items){
      const productId = item.productId;
      const qty = item.qty;
      const productCashStock = await C_Stock.findOne({
        where: {productId}
      })
      if(productCashStock){
        await productCashStock.decrement('qty',{by: qty})
      }
    }

    const data = await C_salesinvoice.findOne({
      where: { id: salesInvoiceData.id, companyId: req.user.companyId },
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

    const { id } = req.params;
    const { customerId, date, totalMrp, items } = req.body;

    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    const existingInvoice = await C_salesinvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!existingInvoice) {
      return res.status(404).json({
        status: "false",
        message: "Sales Invoice Not Found",
      });
    }
    const customerData = await C_customer.findOne({
      where: { id: customerId, companyId: req.user.companyId },
    });

    if (!customerData) {
      return res
        .status(404)
        .json({ status: "false", message: "Cusomer Not Found" });
    }
    const existingItems = await C_salesinvoiceItem.findAll({
      where: { invoiceId: id },
    });
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
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
      console.log(item,"Item.........")
      if (item.rate === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Rate Value Invalid" });
      }
      const productData = await C_product.findOne({
        where: { id: item.productId, companyId: req.user.companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }

      // const productId = item.productId;
      // const qtys = items.reduce((acc, item) => {
      //   if (item.productId === productId) {
      //     return acc + item.qty;
      //   }
      //   return acc;
      // }, 0);
      // const existingItemsQty = filteredExistingItems.reduce((acc, item) => {
      //   if (item.productId === productId) {
      //     return acc + item.qty;
      //   }
      //   return acc;
      // }, 0);
      // const productCashStock = await C_Stock.findOne({where: {productId: item.productId}})
      // const totalProductQty = productCashStock?.qty ?? 0;
      // const tempQty = qtys - existingItemsQty;
      // const isLawStock = await lowStockWaring(productData.lowstock, productData.lowStockQty, tempQty, totalProductQty, productData.nagativeqty)
      // if(isLawStock) return res.status(400).json({status: "false", message: `Low Stock in ${productData.productname} Product`});
    }
    await C_salesinvoice.update(
      {
        customerId,
        date,
        totalMrp,
        companyId: req.user.companyId,
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
      const productCashStock = await C_Stock.findOne({
        where: {productId}
      })
      if(productCashStock){
        await productCashStock.increment('qty',{by: previousQty})
        await productCashStock.decrement('qty',{by: newQty})
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      const productId = item.productId;
      const qty = item.qty;
      const productCashStock = await C_Stock.findOne({
        where: {productId}
      })
      if(productCashStock) await productCashStock.increment('qty',{by: qty})
      await 
      C_salesinvoiceItem.destroy({ where: { id: item.id } });
    }
    await C_customerLedger.update(
      {
        companyId: req.user.companyId,
        customerId,
        date,
      },
      { where: { creditId:existingInvoice.id } }
    );

    const updatedInvoice = await C_salesinvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
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
    const data = await C_salesinvoice.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: C_salesinvoiceItem,
          as: "items",
          include: [{ model: C_product, as: "CashProduct" }],
        },
        { model: C_customer, as: "CashCustomer" },
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

    const data = await C_salesinvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [
        {
          model: C_salesinvoiceItem,
          as: "items",
          include: [{ model: C_product, as: "CashProduct" }],
        },
        { model: C_customer, as: "CashCustomer" },
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
    const data = await C_salesinvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
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
      const productCashStock = await C_Stock.findOne({
        where: {productId}
      })
      if(productCashStock) await productCashStock.increment('qty',{by: qty})
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
