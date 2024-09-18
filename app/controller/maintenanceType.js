const { object } = require("joi");
const MaintenanceType = require("../models/MaintenanceType");
const User = require("../models/user");
const {Op} = require("sequelize");
exports.create_maintenanceType = async (req, res) => {
  try {
    const { name } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const data = await MaintenanceType.create({
      name: name,
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId,
    });

    return res.status(200).json({
      status: "true",
      message: "Maintenance Type Create Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.update_maintenanceType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const maintenanceExist = await MaintenanceType.findOne({
      where: {
        id: id,
        companyId: companyId,
      },
    });
    if (!maintenanceExist) {
      return res.status(404).json({
        status: "false",
        message: "Maintenance Type Not Found.",
      });
    }
    Object.assign(maintenanceExist, {name: name, updatedBy: userId,});
    await maintenanceExist.save();

    return res.status(200).json({
      status: "true",
      message: "Maintenance Type Update Successfully",
      data: maintenanceExist,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_all_maintenanceType = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { search } = req.query;
    const whereClause = { companyId: companyId };
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    const data = await MaintenanceType.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "maintenanceTypeCreateUser",
        },
        {
          model: User,
          as: "maintenanceTypeUpdateUser",
        },
      ],
    });

    return res.status(200).json({
      status: "true",
      message: "Maintenance Type Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.view_single_maintenanceType = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const data = await MaintenanceType.findOne({
      where: {
        companyId: companyId,
        id: id,
      },
      include: [
        {
          model: User,
          as: "maintenanceTypeCreateUser",
        },
        {
          model: User,
          as: "maintenanceTypeUpdateUser",
        },
      ],
    });
    if (!data) {
      return res.status(404).json({
        status: "false",
        message: "Maintenance Type Not Found.",
      });
    }
    return res.status(200).json({
      status: "true",
      message: "Maintenance Type Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.delete_maintenanceType = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;

    const data = await MaintenanceType.findOne({
      where: {
        companyId: companyId,
        id: id,
      },
    });
    if (!data) {
      return res.status(404).json({
        status: "false",
        message: "Maintenance Type Not Found.",
      });
    }
    await data.destroy();
    return res.status(200).json({
      status: "true",
      message: "Maintenance Type Delete Successfully",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
