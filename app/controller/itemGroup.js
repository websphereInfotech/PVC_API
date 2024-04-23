const itemgroup = require("../models/itemgroup");
const product = require("../models/product");

exports.create_itemgroup = async (req, res) => {
  try {
    const { group, remarks, productId } = req.body;
    const existingProduct = await product.findByPk(productId);
    if (!existingProduct) {
      return res
        .status(400)
        .json({ status: "false", message: "Product not found" });
    }
    const data = await itemgroup.create({
      productId,
      group,
      remarks,
    });
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item group created successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_itemgroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { group, remarks } = req.body;

    const item = await itemgroup.findByPk(id);
    if (!item) {
      return res.status(400).json({ message: "Item group not Found" });
    }
    await itemgroup.update(
      {
        group: group,
        remarks: remarks,
      },
      {
        where: { id: id },
      }
    );
    const data = await itemgroup.findByPk(id);
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item group Update Successfully",
        data: data,
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_itemgroup = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await itemgroup.findOne({
      where: { id },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Item group Not Found" });
    }
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item group data fetch successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_itemgroup = async (req, res) => {
  try {
    const data = await itemgroup.findAll();

    if (data) {
      return res
        .status(200)
        .json({
          status: "true",
          message: "Item Group Show Successfully",
          data: data,
        });
    } else {
      return res
        .status(400)
        .json({ status: "false", message: "Item Group Not Found" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
