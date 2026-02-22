const SparePart = require("../models/Wastage");
const User = require("../models/user");
const item = require("../models/product");
const {Op} = require("sequelize");
exports.create_spare_part = async (req, res) => {
  try {
    const { name } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const data = await SparePart.create({
      name: name,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    return res.status(200).json({
      status: "true",
      message: "SparePart Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.update_spare_part = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const sparePartExist = await SparePart.findOne({
      where: {
        id: id,
        companyId: companyId,
      },
    });
    if (!sparePartExist) {
      return res.status(404).json({
        status: "false",
        message: "SparePart Not Found.",
      });
    }
    const data = await SparePart.update(
      {
        name: name,
        updatedBy: userId,
      },
      { where: { id: id } }
    );

    return res.status(200).json({
      status: "true",
      message: "SparePart Update Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_all_spare_part = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { search } = req.query;
    const whereClause = { companyId: companyId, isActive: true, spare: true };
    if (search) {
      whereClause.productname = { [Op.like]: `%${search}%` };
    }
    const data = await item.findAll({
      where: whereClause,
      include: [{model: User, as: "productUpdateUser", attributes: ['username']},{model: User, as: "productCreateUser", attributes: ['username']}]
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Item Not Found" });
    }

    return res.status(200).json({
      status: "true",
      message: "SparePart Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_single_spare_part = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const data = await SparePart.findOne({
      where: {
        companyId: companyId,
        id: id,
      },
      include: [
        {
          model: User,
          as: "sparePartCreateUser",
        },
        {
          model: User,
          as: "sparePartUpdateUser",
        },
      ],
    });
    if (!data) {
      return res.status(404).json({
        status: "false",
        message: "SparePart Not Found.",
      });
    }
    return res.status(200).json({
      status: "true",
      message: "SparePart Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.delete_spare_part = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const data = await SparePart.findOne({
      where: {
        companyId: companyId,
        id: id,
      },
    });
    if (!data) {
      return res.status(404).json({
        status: "false",
        message: "SparePart Not Found.",
      });
    }
    await data.destroy();
    return res.status(200).json({
      status: "true",
      message: "SparePart Delete Successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
