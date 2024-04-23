const product = require("../models/product");
const unit = require("../models/unit");

exports.create_unit = async (req, res) => {
  try {
    const { shortname, unitname, productId } = req.body;
    const existingProduct = await product.findByPk(productId);
    if (!existingProduct) {
      return res
        .status(404)
        .json({ status: "false", message: "Product not found" });
    }
    const data = await unit.create({
      productId,
      shortname,
      unitname,
    });
    return res
      .status(200)
      .json({
        status: "true",
        message: "Unit created successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_unit = async (req, res) => {
  try {
    const { id } = req.params;
    const { shortname, unitname } = req.body;

    const item = await unit.findByPk(id);
    if (!item) {
      return res.status(400).json({ message: "Unit not Found" });
    }
    await unit.update(
      {
        shortname: shortname,
        unitname: unitname,
      },
      {
        where: { id: id },
      }
    );
    const data = await unit.findByPk(id);
    return res
      .status(200)
      .json({
        status: "true",
        message: "Unit Update Successfully",
        data: data,
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_unit = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await unit.findOne({
      where: { id },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Unit Not Found" });
    }
    return res
      .status(200)
      .json({
        status: "true",
        message: "Unit data fetch successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_unit = async (req, res) => {
  try {
    const data = await unit.findAll();
    if (data) {
      return res
        .status(200)
        .json({
          status: "true",
          message: "All Unit Data Show Successfully",
          data: data,
        });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Unit Data Not Found" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
