const { Sequelize } = require("sequelize");
const Account = require("../models/Account");
const deliverychallan = require("../models/deliverychallan");
const deliverychallanitem = require("../models/deliverychallanitem");
const product = require("../models/product");
const User = require("../models/user");

exports.create_deliverychallan = async (req, res) => {
  try {
    const { date, challanno, accountId, totalQty, items } = req.body;
    const userId = req.user.userId;
    const companyId = req.user.companyId;
    const numberOf = await deliverychallan.findOne({
      where: { challanno: challanno, companyId: companyId },
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
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
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
        where: { id: item.productId, companyId: companyId, isActive: true },
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
      accountId,
      totalQty,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId
    });
    const addToItem = items.map((item) => ({
      deliverychallanId: data.id,
      ...item,
    }));

    await deliverychallanitem.bulkCreate(addToItem);

    const deliveryChallan = await deliverychallan.findOne({
      where: { id: data.id, companyId: companyId },
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
    const { date, challanno, accountId, totalQty, items } = req.body;
    const userId = req.user.userId;
    const companyId = req.user.companyId;

    const updatechallan = await deliverychallan.findOne({
      where: { id: id, companyId: companyId },
    });

    if (!updatechallan) {
      return res
        .status(404)
        .json({ status: "false", message: "Delivery challan Not Found" });
    }
    const accountExist = await Account.findOne({
      where: { id: accountId, companyId: companyId, isActive: true },
    });
    if (!accountExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Account Not Found" });
    }
    const numberOf = await deliverychallan.findOne({
      where: { challanno: challanno, companyId: companyId, id: { [Sequelize.Op.ne]: id },},
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
        where: { id: item.productId, companyId: companyId, isActive: true },
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
        accountId,
        totalQty,
        companyId: companyId,
        updatedBy: userId
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
            qty: item.qty,
            unit: item.unit,
            productId: item.productId
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await deliverychallanitem.create({
          deliverychallanId: id,
          productId: item.productId,
          qty: item.qty,
          unit: item.unit
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
      where: { id, companyId: companyId },
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
    const companyId = req.user.companyId;

    const data = await deliverychallan.destroy({
      where: { id: id, companyId: companyId },
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
    const companyId = req.user.companyId;
    const data = await deliverychallan.findAll({
      where: { companyId: companyId },
      include: [
        {
          model: deliverychallanitem,
          as: "items",
          include: [{ model: product, as: "DeliveryProduct" }],
        },
        { model: Account, as: "accountDelivery" },
        {model: User, as: "challanUpdateUser", attributes: ['username']},{model: User, as: "challanCreateUser", attributes: ['username']}
      ],
    });
      return res.status(200).json({
        status: "true",
        message: "Delivery Challan Data Fetch Successfully",
        data: data,
      });
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
          model: Account,
          as: "accountDelivery",
        },
        {model: User, as: "challanUpdateUser", attributes: ['username']},{model: User, as: "challanCreateUser", attributes: ['username']}
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
