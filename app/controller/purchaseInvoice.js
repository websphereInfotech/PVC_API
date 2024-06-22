const { Sequelize } = require("sequelize");
const C_product = require("../models/C_product");
const C_purchaseCash = require("../models/C_purchaseCash");
const C_purchaseCashItem = require("../models/C_purchseCashItem");
const C_vendor = require("../models/C_vendor");
const C_vendorLedger = require("../models/C_vendorLedger");
const product = require("../models/product");
const purchaseInvoice = require("../models/purchaseInvoice");
const purchaseInvoiceItem = require("../models/purchaseInvoiceItem");
const User = require("../models/user");
const vendor = require("../models/vendor");
const vendorLedger = require("../models/vendorLedger");
const Stock = require("../models/stock");
const C_Stock = require("../models/C_stock");
const {lowStockWaring} = require("../constant/common");
const {PRODUCT_TYPE} = require("../constant/constant");

/*=============================================================================================================
                                          Without Typc C API
 ============================================================================================================ */

exports.create_purchaseInvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const {
      vendorId,
      duedate,
      invoiceno,
      invoicedate,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const numberOf = await purchaseInvoice.findOne({
      where: { invoiceno: invoiceno, companyId: req.user.companyId },
    });
    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Invoice Number Already Exists" });
    }
    if (!vendorId || vendorId === "" || vendorId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Vendor" });
    }

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field Of Items" });
    }
    const vendorData = await vendor.findOne({
      where: { id: vendorId, companyId: req.user.companyId },
    });
    if (!vendorData) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
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
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.RAW_MATERIAL },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Raw Material Not Found" });
      }
    }
    const purchseData = await purchaseInvoice.create({
      vendorId,
      duedate,
      invoiceno,
      invoicedate,
      totalIgst,
      totalSgst,
      totalMrp,
      totalQty,
      mainTotal,
      createdBy: user,
      updatedBy: user,
      companyId: req.user.companyId,
    });

    await vendorLedger.create({
      vendorId,
      debitId: purchseData.id,
      companyId: req.user.companyId,
      date: invoicedate,
    });
    const addToItem = items.map((item) => ({
      purchasebillId: purchseData.id,
      ...item,
    }));

    await purchaseInvoiceItem.bulkCreate(addToItem);

    for(const item of items){
        const productId = item.productId;
        const qty = item.qty;
        const productStock = await Stock.findOne({
          where: {productId}
        })
      if(productStock){
        await productStock.increment('qty',{by: qty})
      }
    }

    const data = await purchaseInvoice.findOne({
      where: { id: purchseData.id, companyId: req.user.companyId },
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
    const {
      vendorId,
      duedate,
      invoiceno,
      invoicedate,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;

    const existingPurchase = await purchaseInvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!existingPurchase) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }
    const numberOf = await purchaseInvoice.findOne({
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
    if (!vendorId || vendorId === "" || vendorId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Vendor" });
    }
    const vendorData = await vendor.findOne({
      where: { id: vendorId, companyId: req.user.companyId },
    });
    if (!vendorData) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
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
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.RAW_MATERIAL },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Raw Material Not Found" });
      }
    }
    await purchaseInvoice.update(
      {
        vendorId,
        duedate,
        invoiceno,
        invoicedate,
        totalIgst,
        totalSgst,
        totalMrp,
        totalQty,
        mainTotal,
        companyId: req.user.companyId,
        createdBy: existingPurchase.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );

    await vendorLedger.update(
      {
        vendorId,
        date: invoicedate,
        companyId: req.user.companyId,
      },
      { where: { debitId: id } }
    );
    const existingItems = await purchaseInvoiceItem.findAll({
      where: { purchasebillId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await purchaseInvoiceItem.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
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
        });
      }
      const productId = item.productId;
      const previousQty = existingItem?.qty ?? 0;
      const newQty = item.qty;
      const productStock = await Stock.findOne({
        where: {productId}
      })
      if(productStock){
        await productStock.decrement('qty',{by: previousQty})
        await productStock.increment('qty',{by: newQty})
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
      if(productStock) await productStock.decrement('qty',{by: qty})
      await purchaseInvoiceItem.destroy({ where: { id: item.id } });
    }
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
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
    const billId = await purchaseInvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!billId) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }
    const findItems = await purchaseInvoiceItem.findAll({
      where: { purchasebillId: billId.id },
    })
    for(const item of findItems){
      const productname = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.RAW_MATERIAL },
      });
      const productId = item.productId;
      const qtys = findItems.reduce((acc, item) => {
        if (item.productId === productId) {
          return acc + item.qty;
        }
        return acc;
      }, 0);
      const productStock = await Stock.findOne({where: {productId: item.productId}})
      const totalProductQty = productStock?.qty ?? 0;
      const isLawStock = await lowStockWaring(productname.lowstock, productname.lowStockQty, qtys, totalProductQty, productname.nagativeqty)
      if(isLawStock) return res.status(400).json({status: "false", message: `Low Stock in ${productname.productname} Product`});
    }
    for(const item of findItems){
      const productId = item.productId;
      const qty = item.qty;
      const productStock = await Stock.findOne({
        where: {productId}
      })
      if(productStock) await productStock.decrement('qty',{by: qty})
    }
    await purchaseInvoiceItem.destroy({ where: { purchasebillId: id } })
    await billId.destroy()
    return res.status(200).json({
      status: "true",
      message: "Purchase Invoice Successfully delete"
    })
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_purchaseInvoice = async (req, res) => {
  try {
    const data = await purchaseInvoice.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        { model: vendor, as: "purchseVendor" },
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
    const data = await purchaseInvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [
        {
          model: purchaseInvoiceItem,
          as: "items",
          include: [{ model: product, as: "purchseProduct" }],
        },
        { model: vendor, as: "purchseVendor" },
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

/*=============================================================================================================
                                           Typc C API
 ============================================================================================================ */

exports.C_create_purchaseCash = async (req, res) => {
  try {
    const user = req.user.userId;
    const { vendorId, date, totalMrp, items } = req.body;

    const vendorData = await C_vendor.findOne({
      where: { id: vendorId, companyId: req.user.companyId },
    });

    if (!vendorId || vendorId === "" || vendorId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Vendor" });
    }
    if (!vendorData) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
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
      const productData = await C_product.findOne({
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.RAW_MATERIAL },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Raw Material Not Found" });
      }
    }
    const purchseData = await C_purchaseCash.create({
      vendorId,
      date,
      totalMrp,
      companyId: req.user.companyId,
      createdBy: user,
      updatedBy: user,
    });

    await C_vendorLedger.create({
      vendorId,
      companyId: req.user.companyId,
      debitId: purchseData.id,
      date,
    });

    const addToItem = items.map((item) => ({
      PurchaseId: purchseData.id,
      ...item,
    }));

    await C_purchaseCashItem.bulkCreate(addToItem);
    for(const item of items){
      const productId = item.productId;
      const qty = item.qty;
      const productCashStock = await C_Stock.findOne({
        where: {productId}
      })
      if(productCashStock){
        await productCashStock.increment('qty',{by: qty})
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

    const { id } = req.params;

    const { vendorId, date, totalMrp, items } = req.body;

    const existingPurchase = await C_purchaseCash.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    if (!existingPurchase) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }
    if (!vendorId || vendorId === "" || vendorId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Vendor" });
    }
    const vendorData = await C_vendor.findOne({
      where: { id: vendorId, companyId: req.user.companyId },
    });
    if (!vendorData) {
      return res
        .status(404)
        .json({ status: "false", message: "Vendor Not Found" });
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
      const productData = await C_product.findOne({
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.RAW_MATERIAL },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Raw Material Not Found" });
      }
    }
    await C_purchaseCash.update(
      {
        vendorId,
        date,
        totalMrp,
        companyId: req.user.companyId,
        createdBy: existingPurchase.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );
    const existingItems = await C_purchaseCashItem.findAll({
      where: { PurchaseId: id },
    });
    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);
      console.log(existingItem,"Exsting Item")
      if (existingItem) {
        await C_purchaseCashItem.update(
          {
            qty: item.qty,
            rate: item.rate,
            mrp: item.mrp,
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
        });
      }
      const productId = item.productId;
      const previousQty = existingItem?.qty ?? 0;
      const newQty = item.qty;
      const productCashStock = await C_Stock.findOne({
        where: {productId}
      })
      if(productCashStock){
        await productCashStock.decrement('qty',{by: previousQty})
        await productCashStock.increment('qty',{by: newQty})
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      const productId = item.productId;
      const qty = item.qty;
      console.log(item,"Item...........")
      const productCashStock = await C_Stock.findOne({
        where: {productId}
      })
      if(productCashStock){
      await productCashStock.decrement('qty',{by: qty})
      }
      await C_purchaseCashItem.destroy({ where: { id: item.id } });
    }
    await C_vendorLedger.update(
      {
        companyId: req.user.companyId,
        vendorId,
        date,
      },
      { where: { debitId:id } }
    );
  
    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: req.user.companyId },
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

    const billId = await C_purchaseCash.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!billId) {
      return res.status(404).json({
        status: "false",
        message: "Purchase Invoice Not Found",
      });
    }

    const findItems = await C_purchaseCashItem.findAll({
      where: { PurchaseId: billId.id },
    })
    for(const item of findItems){
      const productname = await C_product.findOne({
        where: { id: item.productId, companyId: req.user.companyId, productType: PRODUCT_TYPE.RAW_MATERIAL },
      });
      const productId = item.productId;
      const qtys = findItems.reduce((acc, item) => {
        if (item.productId === productId) {
          return acc + item.qty;
        }
        return acc;
      }, 0);
      const productCashStock = await C_Stock.findOne({where: {productId: item.productId}})
      const totalProductQty = productCashStock?.qty ?? 0;
      console.log(productname.lowStockQty,"Low staok QTY.................")
      const isLawStock = await lowStockWaring(productname.lowstock, productname.lowStockQty, qtys, totalProductQty, productname.nagativeqty)
      if(isLawStock) return res.status(400).json({status: "false", message: `Low Stock in ${productname.productname} Product`});
    }
    for(const item of findItems){
      const productId = item.productId;
      const qty = item.qty;
      const productCashStock = await C_Stock.findOne({
        where: {productId}
      })
      if(productCashStock){
        await productCashStock.decrement('qty',{by: qty})
      }
    }

    await billId.destroy()
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
    const data = await C_purchaseCash.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: C_product, as: "ProductPurchase" }],
        },
        { model: C_vendor, as: "VendorPurchase" },
        { model: User, as: "purchaseCreateUser", attributes: ["username"] },
        { model: User, as: "purchaseUpdateUser", attributes: ["username"] },
      ],
    });

    if (data) {
      return res.status(200).json({
        status: "true",
        message: "All Purchase Cash show Successfully",
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
exports.C_view_purchaseCash = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await C_purchaseCash.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [
        {
          model: C_purchaseCashItem,
          as: "items",
          include: [{ model: C_product, as: "ProductPurchase" }],
        },
        { model: C_vendor, as: "VendorPurchase" },
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
