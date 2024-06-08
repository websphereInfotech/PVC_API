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
        .json({ status: "false", message: "Required Field Of Items" });
    }

    for (const item of items) {
      const productData = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
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
      creditId: purchseData.id,
      companyId: req.user.companyId,
      date: invoicedate,
    });
    const addToItem = items.map((item) => ({
      purchasebillId: purchseData.id,
      ...item,
    }));

    await purchaseInvoiceItem.bulkCreate(addToItem);

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
    for (const item of items) {
      const productData = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
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
      { where: { creditId: id } }
    );
    const existingItems = await purchaseInvoiceItem.findAll({
      where: { purchasebillId: id },
    });

    const mergedItems = [];
    items.forEach((item) => {
      let existingItem = mergedItems.find(
        (i) => i.productId === item.productId && i.rate === item.rate
      );

      if (existingItem) {
        existingItem.qty += item.qty;
      } else {
        mergedItems.push(item);
      }
    });
    for (const item of mergedItems) {
      const existingItem = existingItems.find(
        (ei) => ei.productId === item.productId && ei.rate === item.rate
      );

      if (existingItem) {
        existingItem.qty = item.qty;
        await existingItem.save();
      } else {
        await purchaseInvoiceItem.create({
          purchasebillId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
        });
      }
    }
    const updatedProducts = items.map((item) => ({
      productId: item.productId,
      rate: item.rate,
    }));

    const itemsToDelete = existingItems.filter(
      (item) =>
        !updatedProducts.some(
          (updatedItem) =>
            updatedItem.productId === item.productId &&
            updatedItem.rate === item.rate
        )
    );

    for (const item of itemsToDelete) {
      await item.destroy();
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
    const billId = await purchaseInvoice.destroy({
      where: { id: id, companyId: req.user.companyId },
    });

    if (billId) {
      return res.status(200).json({
        status: "true",
        message: "Purchase Invoice Delete Successfully",
      });
    } else {
      return res
        .status(404)
        .json({ status: "False", message: "Purchase Invoice Not Found" });
    }
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
      const productData = await C_product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
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
      creditId: purchseData.id,
      date,
    });

    const addToItem = items.map((item) => ({
      PurchaseId: purchseData.id,
      ...item,
    }));

    await C_purchaseCashItem.bulkCreate(addToItem);

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
    for (const item of items) {
      const productData = await C_product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
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

    const creditId = existingPurchase.id;

    await C_vendorLedger.update(
      {
        companyId: req.user.companyId,
        vendorId,
        date,
      },
      { where: { creditId } }
    );
    const mergedItems = [];
    items.forEach((item) => {
      let existingItem = mergedItems.find(
        (i) => i.productId === item.productId && i.rate === item.rate
      );

      if (existingItem) {
        existingItem.qty += item.qty;
      } else {
        mergedItems.push(item);
      }
    });
    for (const item of mergedItems) {
      const existingItem = existingItems.find(
        (ei) => ei.productId === item.productId && ei.rate === item.rate
      );

      if (existingItem) {
        existingItem.qty = item.qty;
        await existingItem.save();
      } else {
        await C_purchaseCashItem.create({
          PurchaseId: id,
          productId: item.productId,
          qty: item.qty,
          rate: item.rate,
          mrp: item.mrp,
        });
      }
    }
    const updatedProducts = items.map((item) => ({
      productId: item.productId,
      rate: item.rate,
    }));

    const itemsToDelete = existingItems.filter(
      (item) =>
        !updatedProducts.some(
          (updatedItem) =>
            updatedItem.productId === item.productId &&
            updatedItem.rate === item.rate
        )
    );

    for (const item of itemsToDelete) {
      await item.destroy();
    }
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
    const billId = await C_purchaseCash.destroy({
      where: { id: id, companyId: req.user.companyId },
    });

    if (billId) {
      return res
        .status(200)
        .json({ status: "true", message: "Purchase Cash Delete Successfully" });
    } else {
      return res
        .status(404)
        .json({ status: "False", message: "Purchase Cash Not Found" });
    }
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
