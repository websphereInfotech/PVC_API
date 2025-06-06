const { fn, col } = require("sequelize");
const Account = require("../models/Account");
const C_OrderProcessing = require("../models/C_OrderProcessing");
const C_OrderProcessingItem = require("../models/C_OrderProcessingItem");
const product = require("../models/product");
const stock = require("../models/stock");
const User = require("../models/user");

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
    const products = await product.findAll({
      where: {
        companyId: req.user.companyId,
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
            companyId: req.user.companyId,
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
