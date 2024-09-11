const C_Purpose = require("../models/Purpose");
const User = require("../models/user");
const {Op} = require("sequelize");
exports.create_purpose = async (req, res) => {
  try {
    const { name } = req.body;
    const { companyId, userId } = req.user;
    const existingPurpose = await C_Purpose.findOne({
      where: {
        name: name,
        companyId: companyId,
      },
    });
    if (existingPurpose) {
      return res
        .status(400)
        .json({ status: "false", message: "Purpose already exists" });
    }
    const data = await C_Purpose.create({
      name: name,
      companyId: companyId,
      updatedBy: userId,
      createdBy: userId,
    });
    return res.status(200).json({
      status: "true",
      message: "Purpose created successfully.",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.update_purpose = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const { companyId, userId } = req.user;
    const purpose = await C_Purpose.findOne({
      where: {
        id,
        companyId: companyId,
      },
    });
    if (!purpose) {
      return res
        .status(404)
        .json({ status: "false", message: "Purpose Not Found." });
    }
    const existingPurpose = await C_Purpose.findOne({
      where: {
        name: name,
        companyId: companyId,
        id: {
          [Sequelize.Op.ne]: id,
        },
      },
    });
    if (existingPurpose) {
      return res
        .status(400)
        .json({ status: "false", message: "Purpose already exists" });
    }
    const data = await C_Purpose.update(
      {
        name: name,
        updatedBy: userId,
      },
      {
        where: {
          id,
        },
      }
    );
    return res.status(200).json({
      status: "true",
      message: "Purpose Update successfully.",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_purpose = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const data = await C_Purpose.findOne({
      where: { id, companyId: companyId },
      include: [
        {
          model: User,
          as: "purposeUpdateUser",
        },
        {
          model: User,
          as: "purposeCreateUser",
        },
      ],
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purpose Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Purpose data fetch successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.delete_purpose = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const data = await C_Purpose.findOne({
      where: { id, companyId: companyId },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Purpose Not Found" });
    }
    await data.destroy();
    return res.status(200).json({
      status: "true",
      message: "Purpose delete successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_all_purpose = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { search } = req.query;
    const whereClause = { companyId: companyId };
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }
    const data = await C_Purpose.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "purposeCreateUser",
        },
        {
          model: User,
          as: "purposeUpdateUser",
        },
      ],
    });

    return res.status(200).json({
      status: "true",
      message: "Purpose Show Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
