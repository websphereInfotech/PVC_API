const Wastage = require("../models/Wastage");
const User = require("../models/user");
const {Op} = require("sequelize");
exports.create_wastage = async (req, res) => {
  try {
    const { name } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const data = await Wastage.create({
      name: name,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    return res.status(200).json({
      status: "true",
      message: "Wastage Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.update_wastage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const wastageExist = await Wastage.findOne({
      where: {
        id: id,
        companyId: companyId,
      },
    });
    if (!wastageExist) {
      return res.status(404).json({
        status: "false",
        message: "Wastage Not Found.",
      });
    }
    const data = await Wastage.update(
      {
        name: name,
        updatedBy: userId,
      },
      { where: { id: id } }
    );

    return res.status(200).json({
      status: "true",
      message: "Wastage Update Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_all_wastage = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { search } = req.query;
    const whereClause = { companyId: companyId };
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    const data = await Wastage.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "wastageCreateUser",
        },
        {
          model: User,
          as: "wastageUpdateUser",
        },
      ],
    });

    return res.status(200).json({
      status: "true",
      message: "Wastage Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_single_wastage = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const data = await Wastage.findOne({
      where: {
        companyId: companyId,
        id: id,
      },
      include: [
        {
          model: User,
          as: "wastageCreateUser",
        },
        {
          model: User,
          as: "wastageUpdateUser",
        },
      ],
    });
    if (!data) {
      return res.status(404).json({
        status: "false",
        message: "Wastage Not Found.",
      });
    }
    return res.status(200).json({
      status: "true",
      message: "Wastage Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.delete_wastage = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const data = await Wastage.findOne({
      where: {
        companyId: companyId,
        id: id,
      },
    });
    if (!data) {
      return res.status(404).json({
        status: "false",
        message: "Wastage Not Found.",
      });
    }
    await data.destroy();
    return res.status(200).json({
      status: "true",
      message: "Wastage Delete Successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
