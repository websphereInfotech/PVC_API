const { fn, col } = require("sequelize");
const sequelize = require("../config/index");
const Account = require("../models/Account");
const C_OrderProcessing = require("../models/C_OrderProcessing");
const C_OrderProcessingItem = require("../models/C_OrderProcessingItem");
const LoyaltyUser = require("../models/loyaltyUser");
const ProFormaInvoice = require("../models/ProFormaInvoice");
const ProFormaInvoiceItem = require("../models/ProFormaInvoiceItem");
const product = require("../models/product");
const stock = require("../models/stock");
const User = require("../models/user");

const authenticateLoyaltyRequest = (req, res) => {
  const configuredKey = process.env.LOYALTY_API_KEY;
  if (!configuredKey) {
    res.status(500).json({
      status: "false",
      message: "Loyalty API key is not configured",
    });
    return false;
  }

  const providedKey = req.headers["x-loyalty-api-key"];
  if (providedKey !== configuredKey) {
    res.status(401).json({
      status: "false",
      message: "Invalid loyalty API key",
    });
    return false;
  }

  return true;
};

const getNextOrderProcessingNo = async (companyId, transaction) => {
  const maxNo = await C_OrderProcessing.max("orderProcessingNo", {
    where: { companyId },
    transaction,
  });
  return Number(maxNo || 0) + 1;
};

const getNextLoyaltyOrderNumbers = async (companyId, transaction) => {
  let orderProcessingNo = await getNextOrderProcessingNo(companyId, transaction);

  while (true) {
    const ProFormaInvoice_no = `LPF-${orderProcessingNo}`;
    const [orderExists, proFormaExists] = await Promise.all([
      C_OrderProcessing.findOne({
        where: { orderProcessingNo, companyId },
        transaction,
      }),
      ProFormaInvoice.findOne({
        where: { ProFormaInvoice_no, companyId },
        transaction,
      }),
    ]);

    if (!orderExists && !proFormaExists) {
      return { orderProcessingNo, ProFormaInvoice_no };
    }

    orderProcessingNo += 1;
  }
};

exports.C_create_orderprocessing = async (req, res) => {
  try {
    const user = req.user.userId;
    const { orderProcessingNo, accountId, date, totalMrp, totalQty, items } =
      req.body;
    const companyId = req.user.companyId;

    const orderProcessingNoExist = await C_OrderProcessing.findOne({
      where: {
        orderProcessingNo: orderProcessingNo,
        companyId: companyId,
      },
    });
    if (orderProcessingNoExist) {
      return res
        .status(400)
        .json({ status: "false", message: "Order Number Already Exists." });
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
      //   if (item.rate === 0) {
      //     return res
      //       .status(400)
      //       .json({ status: "false", message: "Rate Value Invalid" });
      //   }
      const productData = await product.findOne({
        where: { id: item.productId, companyId: companyId, isActive: true },
      });
      if (!productData) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const orderProcessingData = await C_OrderProcessing.create({
      accountId,
      date,
      totalMrp,
      totalQty,
      orderProcessingNo: orderProcessingNo,
      companyId: companyId,
      createdBy: user,
      updatedBy: user,
    });

    const addToProduct = await items.map((item) => ({
      orderId: orderProcessingData.id,
      ...item,
    }));
    await C_OrderProcessingItem.bulkCreate(addToProduct);

    const data = await C_OrderProcessing.findOne({
      where: { id: orderProcessingData.id, companyId: companyId },
      include: [{ model: C_OrderProcessingItem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Order Created Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.create_loyalty_order = async (req, res) => {
  if (!authenticateLoyaltyRequest(req, res)) return;

  const transaction = await sequelize.transaction();
  try {
    const {
      loyaltyUserId,
      companyId,
      date,
      validtill,
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

    if (!loyaltyUserId) {
      await transaction.rollback();
      return res.status(400).json({ status: "false", message: "Loyalty User is required" });
    }

    if (!companyId) {
      await transaction.rollback();
      return res.status(400).json({ status: "false", message: "Company is required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ status: "false", message: "Items are required" });
    }

    const loyaltyUser = await LoyaltyUser.findByPk(loyaltyUserId, { transaction });
    if (!loyaltyUser) {
      await transaction.rollback();
      return res.status(404).json({ status: "false", message: "Loyalty User Not Found" });
    }

    if (!loyaltyUser.accountId) {
      await transaction.rollback();
      return res.status(403).json({
        status: "false",
        message: "Loyalty User is not mapped with any account",
      });
    }

    const account = await Account.findOne({
      where: {
        id: loyaltyUser.accountId,
        companyId,
        isActive: true,
      },
      transaction,
    });

    if (!account) {
      await transaction.rollback();
      return res.status(404).json({ status: "false", message: "Mapped Account Not Found" });
    }

    const {
      orderProcessingNo: finalOrderProcessingNo,
      ProFormaInvoice_no: finalProFormaInvoiceNo,
    } = await getNextLoyaltyOrderNumbers(companyId, transaction);

    const normalizedItems = [];
    for (const item of items) {
      if (!item.productId || item.productId === "") {
        await transaction.rollback();
        return res.status(400).json({ status: "false", message: "Product is required in items" });
      }

      if (!item.qty || Number(item.qty) <= 0) {
        await transaction.rollback();
        return res.status(400).json({ status: "false", message: "Qty must be greater than 0" });
      }

      const productData = await product.findOne({
        where: { id: item.productId, companyId, isActive: true },
        transaction,
      });

      if (!productData) {
        await transaction.rollback();
        return res.status(404).json({
          status: "false",
          message: `Product not found for ID ${item.productId}`,
        });
      }

      const rate = Number(item.rate ?? productData.salesprice ?? 0);
      if (rate <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          status: "false",
          message: `Rate is required for product ID ${item.productId}`,
        });
      }

      const qty = Number(item.qty);
      const mrp = Number(item.mrp ?? rate * qty);
      normalizedItems.push({
        productId: item.productId,
        qty,
        rate,
        mrp,
        unit: item.unit || productData.unit,
      });
    }

    const calculatedTotalQty = normalizedItems.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const calculatedTotalMrp = normalizedItems.reduce((sum, item) => sum + Number(item.mrp || 0), 0);
    const finalTotalQty = totalQty ?? calculatedTotalQty;
    const finalTotalMrp = totalMrp ?? calculatedTotalMrp;
    const finalTotalIgst = totalIgst ?? 0;
    const finalTotalSgst = totalSgst ?? 0;
    const finalMainTotal = mainTotal ?? Number(finalTotalMrp) + Number(finalTotalIgst) + Number(finalTotalSgst);
    const orderDate = date || new Date().toISOString().slice(0, 10);

    const orderProcessingData = await C_OrderProcessing.create({
      accountId: account.id,
      date: orderDate,
      totalMrp: finalTotalMrp,
      totalQty: finalTotalQty,
      orderProcessingNo: finalOrderProcessingNo,
      companyId,
      createdBy: null,
      updatedBy: null,
    }, { transaction });

    await C_OrderProcessingItem.bulkCreate(
      normalizedItems.map((item) => ({
        orderId: orderProcessingData.id,
        ...item,
      })),
      { transaction }
    );

    const proFormaInvoiceData = await ProFormaInvoice.create({
      ProFormaInvoice_no: finalProFormaInvoiceNo,
      date: orderDate,
      validtill,
      accountId: account.id,
      termsOfDelivery,
      dispatchThrough,
      destination,
      LL_RR_no: LL_RR_no || null,
      terms,
      motorVehicleNo,
      dispatchno,
      totalIgst: finalTotalIgst,
      totalSgst: finalTotalSgst,
      totalMrp: finalTotalMrp,
      mainTotal: finalMainTotal,
      totalQty: finalTotalQty,
      createdBy: null,
      updatedBy: null,
      companyId,
    }, { transaction });

    await ProFormaInvoiceItem.bulkCreate(
      normalizedItems.map((item) => ({
        InvoiceId: proFormaInvoiceData.id,
        ...item,
      })),
      { transaction }
    );

    const createdOrder = await C_OrderProcessing.findOne({
      where: { id: orderProcessingData.id, companyId },
      include: [{ model: C_OrderProcessingItem, as: "items" }],
      transaction,
    });

    const createdProFormaInvoice = await ProFormaInvoice.findOne({
      where: { id: proFormaInvoiceData.id, companyId },
      include: [{ model: ProFormaInvoiceItem, as: "items" }],
      transaction,
    });

    await transaction.commit();

    return res.status(200).json({
      status: "true",
      message: "Loyalty order and ProForma Invoice created successfully",
      data: {
        orderProcessing: createdOrder,
        proFormaInvoice: createdProFormaInvoice,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.log(error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};

exports.C_update_orderprocessing = async (req, res) => {
  try {
    const userId = req.user.userId;
    const companyId = req.user.companyId;
    const { id } = req.params;
    const { orderProcessingNo, accountId, date, totalMrp, totalQty, items } =
      req.body;

    const existingOrder = await C_OrderProcessing.findOne({
      where: { id, companyId },
    });

    if (!existingOrder) {
      return res.status(404).json({
        status: "false",
        message: "Order not found",
      });
    }

    const accountExist = await Account.findOne({
      where: { id: accountId, companyId, isActive: true },
    });
    if (!accountExist) {
      return res.status(404).json({
        status: "false",
        message: "Account not found",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        status: "false",
        message: "Items are required",
      });
    }

    for (const item of items) {
      if (!item.productId || item.productId === "") {
        return res.status(400).json({
          status: "false",
          message: "Product is required in items",
        });
      }
      if (item.qty === 0) {
        return res.status(400).json({
          status: "false",
          message: "Qty must be greater than 0",
        });
      }

      const productExist = await product.findOne({
        where: { id: item.productId, companyId, isActive: true },
      });

      if (!productExist) {
        return res.status(404).json({
          status: "false",
          message: `Product not found for ID ${item.productId}`,
        });
      }
    }

    await existingOrder.update({
      orderProcessingNo,
      accountId,
      date,
      totalMrp,
      totalQty,
      updatedBy: userId,
    });

    await C_OrderProcessingItem.destroy({
      where: { orderId: id },
    });

    const updatedItems = items.map((item) => ({
      orderId: id,
      ...item,
    }));
    await C_OrderProcessingItem.bulkCreate(updatedItems);

    const updatedOrder = await C_OrderProcessing.findOne({
      where: { id, companyId },
      include: [{ model: C_OrderProcessingItem, as: "items" }],
    });

    return res.status(200).json({
      status: "true",
      message: "Order updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};

exports.C_get_all_orderprocessing = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await C_OrderProcessing.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: C_OrderProcessingItem,
          as: "items",
          include: [{ model: product, as: "orderProduct" }],
        },
        { model: Account, as: "orderAccount" },
        { model: User, as: "orderCreate", attributes: ["username"] },
        { model: User, as: "orderUpdate", attributes: ["username"] },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Order Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Order Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_view_orderprocessing = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_OrderProcessing.findOne({
      where: { id: id, companyId: companyId },
      include: [
        {
          model: C_OrderProcessingItem,
          as: "items",
          include: [{ model: product, as: "orderProduct" }],
        },
        { model: Account, as: "orderAccount" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Order Not Found" });
    }
    return res.status(200).json({
      status: "ture",
      message: "Order Data Fetch SUccessfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.C_Update_Status_orderprocessing = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Open", "Pending", "Closed"].includes(status)) {
      return res.status(400).json({
        status: "false",
        message:
          "Invalid status value. Must be 'Open', 'Pending', or 'Closed'.",
      });
    }

    const order = await C_OrderProcessing.findOne({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!order) {
      return res.status(404).json({
        status: "false",
        message: "Order not found",
      });
    }

    order.status = status;
    order.updatedBy = req.user.id;
    await order.save();

    return res.status(200).json({
      status: "true",
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      status: "false",
      message: "Internal Server Error",
    });
  }
};

exports.C_delete_orderprocessing = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await C_OrderProcessing.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Order Not Found" });
    }
    await C_OrderProcessingItem.destroy({ where: { orderId: id } });
    await data.destroy();
    return res
      .status(200)
      .json({ status: "true", message: "Order Deleted Successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_all_items_orderprocessing = async (req, res) => {
  try {
    const companyId = req.user ? req.user.companyId : req.query.companyId;
    if (!companyId) {
      return res.status(400).json({ status: "false", message: "Company is required" });
    }

    const products = await product.findAll({
      where: {
        companyId,
        isActive: true,
      },
      attributes: ["id", "productname", "weight", "unit"],
      include: [
        {
          model: stock,
          as: "itemStock",
          attributes: ["qty"],
        },
      ],
    });

    const pendingItems = await C_OrderProcessingItem.findAll({
      attributes: ["productId", [fn("SUM", col("qty")), "totalOrderedQty"]],
      include: [
        {
          model: C_OrderProcessing,
          as: "items",
          where: {
            status: "Pending",
            companyId,
          },
          attributes: [],
        },
      ],
      group: ["productId"],
    });

    const orderedQtyMap = {};
    pendingItems.forEach((item) => {
      orderedQtyMap[item.productId] = parseFloat(
        item.dataValues.totalOrderedQty
      );
    });

    const result = products.map((product) => {
      const stockQty = parseFloat(product.itemStock?.qty || 0);
      const orderedQty = orderedQtyMap[product.id] || 0;

      return {
        productId: product.id,
        productname: product.productname,
        weight: product.weight,
        unit: product.unit,
        orderedQty,
        currentStock: stockQty,
        availableQtyAfterOrder: stockQty - orderedQty,
      };
    });

    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: "false", message: "Item Not Found" });
    }

    return res.status(200).json({
      status: "true",
      message: "Item Data Fetch Successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
