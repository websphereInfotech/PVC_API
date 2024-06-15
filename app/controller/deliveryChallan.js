const { Sequelize } = require("sequelize");
const customer = require("../models/customer");
const deliverychallan = require("../models/deliverychallan");
const deliverychallanitem = require("../models/deliverychallanitem");
const product = require("../models/product");

exports.create_deliverychallan = async (req, res) => {
  try {
    const { date, challanno, customerId, totalQty, items } = req.body;
    const numberOf = await deliverychallan.findOne({
      where: { challanno: challanno, companyId: req.user.companyId },
    });
    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Challan Number Already Exists" });
    }
    if (!customerId || customerId === "" || customerId === null) {
      return res
        .status(400)
        .json({ status: "false", message: "Required filed :Customer" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
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
      if (!item.productId || item.productId === "" || item.productId === null) {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
      }
      if (item.qty === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Qty Value Invalid" });
      }
      const productname = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });
      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    const data = await deliverychallan.create({
      date,
      challanno,
      customerId,
      totalQty,
      companyId: req.user.companyId,
    });
    const addToItem = items.map((item) => ({
      deliverychallanId: data.id,
      ...item,
    }));

    await deliverychallanitem.bulkCreate(addToItem);

    const deliveryChallan = await deliverychallan.findOne({
      where: { id: data.id, companyId: req.user.companyId },
      include: [{ model: deliverychallanitem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Delivery Challan Created Successfully",
      data: deliveryChallan,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_deliverychallan = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, challanno, customerId, totalQty, items } = req.body;

    const updatechallan = await deliverychallan.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!updatechallan) {
      return res
        .status(404)
        .json({ status: "false", message: "Delivery challan Not Found" });
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
    const numberOf = await deliverychallan.findOne({
      where: { challanno: challanno, companyId: req.user.companyId, id: { [Sequelize.Op.ne]: id },},
    });
    if (numberOf) {
      return res
        .status(400)
        .json({ status: "false", message: "Challan Number Already Exists" });
    }
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ status: "false", message: "Required Field oF items" });
    }
    for (const item of items) {
      if (item.productId === "" || item.productId === null) {
        return res
          .status(400)
          .json({ status: "false", message: "Required filed :Product" });
      }
      if (item.qty === 0) {
        return res
          .status(400)
          .json({ status: "false", message: "Qty Value Invalid" });
      }
      const productname = await product.findOne({
        where: { id: item.productId, companyId: req.user.companyId },
      });

      if (!productname) {
        return res
          .status(404)
          .json({ status: "false", message: "Product Not Found" });
      }
    }
    await deliverychallan.update(
      {
        challanno,
        date,
        customerId,
        totalQty,
        companyId: req.user.companyId,
      },
      {
        where: { id: id },
      }
    );

    const existingItems = await deliverychallanitem.findAll({
      where: { deliverychallanId: id },
    });

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await deliverychallanitem.update(
          {
            qty: item.qty
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await deliverychallanitem.create({
          deliverychallanId: id,
          productId: item.productId,
          qty: item.qty
        });
      }
    }
    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await deliverychallanitem.destroy({ where: { id: item.id } });
    }
    const data = await deliverychallan.findOne({
      where: { id, companyId: req.user.companyId },
      include: [{ model: deliverychallanitem, as: "items" }],
    });
    return res.status(200).json({
      status: "true",
      message: "Delivery Challan Update Successfully",
      data: data,
    });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal server error" });
  }
};
exports.delete_deliverychallan = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await deliverychallan.destroy({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "Delivery Challan Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Delivery Challan Delete Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_deliverychallan = async (req, res) => {
  try {
    const data = await deliverychallan.findAll({
      where: { companyId: req.user.companyId },
      include: [
        {
          model: deliverychallanitem,
          as: "items",
          include: [{ model: product, as: "DeliveryProduct" }],
        },
        { model: customer, as: "DeliveryCustomer" },
      ],
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Delivery Challan Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Delivery Challan Data Fetch Successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_deliverychallan = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await deliverychallan.findOne({
      where: { id: id, companyId: req.user.companyId },
      include: [
        {
          model: deliverychallanitem,
          as: "items",
          include: [{ model: product, as: "DeliveryProduct" }],
        },
        {
          model: customer,
          as: "DeliveryCustomer",
        },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Delivery Challan Not Found" });
    } else {
      return res.status(200).json({
        status: "true",
        message: "Fetch delivery Challan data successfully",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
