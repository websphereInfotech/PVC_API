const ItemType = require("../models/ItemType");
const User = require("../models/user");
const { Sequelize, Op } = require("sequelize");

exports.create_itemType = async (req, res) => {
  try {
    const { name } = req.body;
    const { companyId, userId } = req.user;
    const existingType = await ItemType.findOne({
      where: {
        name,
        companyId,
      },
    });

    if (existingType) {
      return res
        .status(400)
        .json({ status: "false", message: "Item Type already exists" });
    }

    const data = await ItemType.create({
      name,
      companyId,
      updatedBy: userId,
      createdBy: userId,
    });

    return res.status(200).json({
      status: "true",
      message: "Item type created successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.update_itemType = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const { companyId, userId } = req.user;

    const type = await ItemType.findOne({
      where: {
        id,
        companyId,
      },
    });

    if (!type) {
      return res
        .status(404)
        .json({ status: "false", message: "Item Type Not Found." });
    }

    const existingType = await ItemType.findOne({
      where: {
        name,
        companyId,
        id: {
          [Sequelize.Op.ne]: id,
        },
      },
    });

    if (existingType) {
      return res
        .status(400)
        .json({ status: "false", message: "Item Type already exists" });
    }

    await type.update({
      name,
      updatedBy: userId,
    });

    return res.status(200).json({
      status: "true",
      message: "Item type update successfully.",
      data: type,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_itemType = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await ItemType.findOne({
      where: { id, companyId },
      include: [
        {
          model: User,
          as: "typeUpdateUser",
        },
        {
          model: User,
          as: "typeCreateUser",
        },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Item type Not Found" });
    }

    return res.status(200).json({
      status: "true",
      message: "Item type data fetch successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.delete_itemType = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;
    const data = await ItemType.findOne({
      where: { id, companyId },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Item type Not Found" });
    }

    await data.destroy();

    return res.status(200).json({
      status: "true",
      message: "Item type delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_all_itemType = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { search } = req.query;
    const whereClause = { companyId };

    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    const data = await ItemType.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "typeUpdateUser",
        },
        {
          model: User,
          as: "typeCreateUser",
        },
      ],
    });

    return res.status(200).json({
      status: "true",
      message: "Item Type Show Successfully",
      data,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
