const C_product = require("../models/C_product");
// const itemcategory = require("../models/itemcategory");
// const itemgroup = require("../models/itemgroup");
const product = require("../models/product");
const C_stock = require("../models/C_stock");
const Stock = require("../models/stock");
// const unit = require("../models/unit");

/*=============================================================================================================
                                          Widhout Typc C API
 ============================================================================================================ */

exports.create_product = async (req, res) => {
  try {
    const {
      itemtype,
      productname,
      description,
      itemgroup,
      itemcategory,
      unit,
      bankdetail,
      openingstock,
      nagativeqty,
      lowstock,
      itemselected,
      salesprice,
      gstrate,
      HSNcode,
      cess,
    } = req.body;

    let purchaseprice = req.body.purchaseprice;
    if (purchaseprice === "") {
      purchaseprice = null;
    }

    const existingHSNcode = await product.findOne({
      where: { HSNcode: HSNcode, companyId: req.user.companyId },
    });
    if (existingHSNcode) {
      return res
        .status(400)
        .json({ status: "false", message: "HSN Code Already Exists" });
    }
    const data = await product.create({
      itemtype,
      productname,
      description,
      itemgroup,
      itemcategory,
      unit,
      bankdetail,
      openingstock,
      nagativeqty,
      lowstock,
      itemselected,
      salesprice,
      purchaseprice,
      gstrate,
      HSNcode,
      cess,
      companyId: req.user.companyId,
    });
    const cashProduct = await C_product.create({
      productname: productname,
      companyId: req.user.companyId,
    });

    await C_stock.create({
      productId: cashProduct.id
    })

    await Stock.create({
      productId: data.id,
    })

    return res.status(200).json({
      status: "true",
      message: "Product created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_product = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      itemtype,
      productname,
      description,
      itemgroup,
      itemcategory,
      unit,
      bankdetail,
      openingstock,
      nagativeqty,
      lowstock,
      itemselected,
      purchaseprice,
      salesprice,
      gstrate,
      HSNcode,
      cess,
    } = req.body;

    const existingProduct = await product.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ status: "false", message: "Product Not Found" });
    }

    if (existingProduct.HSNcode !== HSNcode) {
      const existingHSNcode = await product.findOne({
        where: { HSNcode: HSNcode,companyId: req.user.companyId },
      });
      if (existingHSNcode) {
        return res
          .status(400)
          .json({ status: "false", message: "HSN Code Already Exists" });
      }
    }
    await product.update(
      {
        itemtype: itemtype,
        productname: productname,
        description: description,
        itemgroup: itemgroup,
        itemcategory: itemcategory,
        unit: unit,
        bankdetail: bankdetail,
        openingstock: openingstock,
        nagativeqty: nagativeqty,
        lowstock: lowstock,
        itemselected: itemselected,
        salesprice: salesprice,
        purchaseprice: purchaseprice,
        gstrate: gstrate,
        HSNcode: HSNcode,
        cess: cess,
        companyId: req.user.companyId,
      },
      {
        where: { id: id },
      }
    );
    const data = await product.findOne({
      where: { id: id, companyId: req.user.companyId },
    });
    return res.status(200).json({
      status: "true",
      message: "Product Updated Successfully",
      data: data,
    });
  } catch (error) {
    console.log("ERROR", error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal server error" });
  }
};
exports.delete_product = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await product.destroy({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "Product Not Found" });
    } else {
      return res
        .status(200)
        .json({ status: "true", message: "Product Delete Successfully" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.view_product = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await product.findOne({
      where: { id: id, companyId: req.user.companyId },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Product Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Product data fetch successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_product = async (req, res) => {
  try {
    const data = await product.findAll({
      where: { companyId: req.user.companyId },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Product Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Product Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

/*=============================================================================================================
                                            Typc C API
 ============================================================================================================ */

exports.C_get_all_product = async (req, res) => {
  try {
    const data = await C_product.findAll({
      where: { companyId: req.user.companyId },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Product Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Product Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
