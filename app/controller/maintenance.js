const Machine = require("../models/Machine");
const Maintenance = require("../models/Maintenance");
const Product = require("../models/product");
const MaintenanenceItem = require("../models/MaintenanenceItem");
const User = require("../models/user");
const MaintenanceType = require("../models/MaintenanceType");

exports.create_maintenance = async (req, res) => {
  try {
    const { machineId, items, maintenanceType } = req.body;
    const { companyId, userId } = req.user;
    const machineExists = await Machine.findOne({
      where: {
        id: machineId,
        companyId: companyId,
      },
    });
    if (!machineExists) {
      return res.status(404).json({
        status: "false",
        message: "Machine Not Found.",
      });
    }

    for (const item of items) {
      const isProduct = await Product.findOne({
        where: {
          id: item.productId,
          companyId: companyId,
          isActive: true,
        },
      });
      if (!isProduct) {
        return res.status(404).json({
          status: "false",
          message: "Product Not Found.",
        });
      }
    }

    const data = await Maintenance.create({
      ...req.body,
      createdBy: userId,
      updatedBy: userId,
      companyId: companyId,
    });
    for (const item of items) {
      await MaintenanenceItem.create({
        maintenanceId: data.id,
        productId: item.productId,
        qty: item.qty,
      });
    }
    await data.addMMaintenanceTypes(maintenanceType);
    return res.status(200).json({
      status: "true",
      message: "Maintenance Create Successfully.",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};
exports.update_maintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyId, userId } = req.user;
    const { items, machineId, maintenanceType } = req.body;
    const maintenanceExist = await Maintenance.findOne({
      where: { id: id, companyId: companyId },
    });
    if (!maintenanceExist) {
      return res.status(404).json({
        status: "false",
        message: "Maintenance Not Found",
      });
    }
    const machineExists = await Machine.findOne({
      where: {
        id: machineId,
        companyId: companyId,
      },
    });
    if (!machineExists) {
      return res.status(404).json({
        status: "false",
        message: "Machine Not Found.",
      });
    }
    const existingItems = await MaintenanenceItem.findAll({
      where: { maintenanceId: id },
    });
    for (const item of items) {
      const isProduct = await Product.findOne({
        where: {
          id: item.productId,
          companyId: companyId,
          isActive: true,
        },
      });
      if (!isProduct) {
        return res.status(404).json({
          status: "false",
          message: "Product Not Found.",
        });
      }
    }
    Object.assign(maintenanceExist, req.body, { updateBy: userId });
    await maintenanceExist.save();
    await maintenanceExist.setMMaintenanceTypes([]);
    await maintenanceExist.setMMaintenanceTypes(maintenanceType);

    for (const item of items) {
      const existingItem = existingItems.find((ei) => ei.id === item.id);

      if (existingItem) {
        await MaintenanenceItem.update(
          {
            qty: item.qty,
            productId: item.productId,
          },
          { where: { id: existingItem.id } }
        );
      } else {
        await MaintenanenceItem.create({
          maintenanceId: id,
          productId: item.productId,
          qty: item.qty,
        });
      }
    }

    const updatedProductIds = items.map((item) => item.id);

    const itemsToDelete = existingItems.filter(
      (item) => !updatedProductIds.includes(item.id)
    );

    for (const item of itemsToDelete) {
      await MaintenanenceItem.destroy({ where: { id: item.id } });
    }

    return res.status(200).json({
      status: "true",
      message: "Maintenance Update Successfully.",
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.view_all_maintenance = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const data = await Maintenance.findAll({
      where: {
        companyId: companyId,
      },
      include: [
        { model: Machine, as: "machineMaintenance" },
        { model: User, as: "maintenanceUpdateUser" },
        { model: User, as: "maintenanceCreateUser" },
      ],
    });
    return res.status(200).json({
      status: "true",
      message: "Maintenance Fetch Successfully.",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.view_one_maintenance = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;
    const data = await Maintenance.findOne({
      where: {
        companyId: companyId,
        id: id,
      },
      include: [
        { model: Machine, as: "machineMaintenance" },
        {
          model: MaintenanceType,
          as: "mMaintenanceTypes",
          attributes: ["name", "id"],
          through: {
            attributes: [],
          },
        },
        { model: MaintenanenceItem, as: "maintenanceItems", include: [{model: Product, as: "maintenanceProduct"}] },
      ],
    });
    if (!data) {
      return res.status(404).json({
        status: "false",
        message: "Maintenance Not Found.",
      });
    }
    return res.status(200).json({
      status: "true",
      message: "Maintenance Fetch Successfully.",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};

exports.delete_maintenance = async (req, res) => {
  try {
    const companyId = req.user.companyId;
    const { id } = req.params;
    const data = await Maintenance.findOne({
      where: {
        companyId: companyId,
        id: id,
      },
    });
    if (!data) {
      return res.status(404).json({
        status: "false",
        message: "Maintenance Not Found.",
      });
    }
    await data.destroy();
    return res.status(200).json({
      status: "true",
      message: "Maintenance Delete Successfully.",
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};
