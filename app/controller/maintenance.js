const Machine = require("../models/Machine");
const BreakdownMaintenance = require("../models/BreakdownMaintenance");
const MMaintenanceType = require("../models/MMaintenanceType");
const Maintenance = require("../models/Maintenance");
const Product = require("../models/product");

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
      companyId: companyId,
      createdBy: userId,
      updatedBy: userId
    });
    await data.addMMaintenanceTypes(maintenanceType);
    return res.status(200).json({
      status: "true",
      message: "Breakdown Maintenance Create Successfully.",
      data: data,
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error." });
  }
};