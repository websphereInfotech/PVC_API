const ProFormaInvoice = require("../models/ProFormaInvoice");
const ProFormaInvoiceItem = require("../models/ProFormaInvoiceItem");
const customer = require("../models/customer");
const product = require("../models/product");
const User = require("../models/user");

exports.create_ProFormaInvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const {
      ProFormaInvoice_no,
      date,
      validtill,
      customerId,
      termsOfDelivery,
      dispatchThrough,
      destination,
      LL_RR_no,
      terms,
      motorVehicleNo,
      dispatchno,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      items,
    } = req.body;
    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
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
    const numberOf = await ProFormaInvoice.findOne({
      where: {
        ProFormaInvoice_no: ProFormaInvoice_no,
        companyId: req.user.companyId,
      },
    });
    if (numberOf) {
      return res.status(400).json({
        status: "false",
        message: "ProForma Invoice Number Already Exists",
      });
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
        .json({ status: "false", message: "Required Field oF items" });
    }

    for (const item of items) {
      const productname = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const createdInvoice = await ProFormaInvoice.create({
      ProFormaInvoice_no,
      date,
      validtill,
      customerId,
      termsOfDelivery,
      dispatchThrough,
      destination,
      LL_RR_no,
      terms,
      motorVehicleNo,
      dispatchno,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
      createdBy: user,
      updatedBy: user,
      companyId: req.user.companyId,
    });

    const addToProduct = items.map((item) => ({
      InvoiceId: createdInvoice.id,
      ...item,
    }));
    await ProFormaInvoiceItem.bulkCreate(addToProduct);

    const quotationWithItems = await ProFormaInvoice.findOne({
      where: { id: createdInvoice.id },
      include: [{ model: ProFormaInvoiceItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice created successfully",
      data: quotationWithItems,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};
exports.get_all_ProFormaInvoice = async (req, res) => {
  try {
    const allInvoice = await ProFormaInvoice.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: ProFormaInvoiceItem,
          as: "items",
          include: [{ model: product, as: "product" }],
        },
        { model: customer, as: "customer" },
        { model: User, as: "proCreateUser", attributes: ["username"] },
        { model: User, as: "proUpdateUser", attributes: ["username"] },
      ],
    });

    if (!allInvoice) {
      return res
        .status(404)
        .json({ status: "false", message: "ProForma Invoice Data not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice data fetch successfully",
      data: allInvoice,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};
exports.view_ProFormaInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ProFormaInvoice.findOne({
      where: { id, companyId: req.user.companyId },
      include: [
        {
          model: ProFormaInvoiceItem,
          as: "items",
          include: [{ model: product, as: "product" }],
        },
        { model: customer, as: "customer" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "ProForma Invoice not found" });
    }
    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice data fetch successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", error: "Internal Server Error" });
  }
};
exports.update_ProFormaInvoice = async (req, res) => {
  try {
    const user = req.user.userId;
    const { id } = req.params;
    const {
      ProFormaInvoice_no,
      date,
      validtill,
      customerId,
      termsOfDelivery,
      dispatchThrough,
      destination,
      LL_RR_no,
      terms,
      motorVehicleNo,
      dispatchno,
      items,
      totalIgst,
      totalSgst,
      totalMrp,
      mainTotal,
      totalQty,
    } = req.body;

    const existingInvoice = await ProFormaInvoice.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!existingInvoice) {
      return res.status(404).json({
        status: "false",
        message: "ProForma Invoice Not Found",
      });
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
    for (const item of items) {
      const productname = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await ProFormaInvoice.update(
      {
        ProFormaInvoice_no,
        date,
        validtill,
        customerId,
        termsOfDelivery,
        dispatchThrough,
        destination,
        LL_RR_no,
        terms,
        motorVehicleNo,
        dispatchno,
        totalIgst,
        totalSgst,
        totalMrp,
        mainTotal,
        totalQty,
        companyId: req.user.companyId,
        createdBy: existingInvoice.createdBy,
        updatedBy: user,
      },
      { where: { id } }
    );

    const existingItems = await ProFormaInvoiceItem.findAll({
      where: { InvoiceId: id },
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
        await ProFormaInvoiceItem.create({
          InvoiceId: id,
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
    const updatedInvoice = await ProFormaInvoice.findOne({
      where: { id, companyId: req.user.companyId },
      include: [{ model: ProFormaInvoiceItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice Updated Successfully",
      data: updatedInvoice,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};

exports.delete_ProFormaInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await ProFormaInvoice.destroy({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "ProForma Invoice Item Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "ProForma Invoice Item Delete Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
