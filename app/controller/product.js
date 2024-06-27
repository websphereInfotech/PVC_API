const C_product = require("../models/C_product");
const product = require("../models/product");
const C_stock = require("../models/C_stock");
const Stock = require("../models/stock");
const User = require("../models/user");
const {Op} = require("sequelize");
const {PRODUCT_TYPE} = require("../constant/constant");

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
      lowStockQty,
      itemselected,
      salesprice,
      gstrate,
      HSNcode,
      cess,
      weight
    } = req.body;
    const userId = req.user.userId

    let purchaseprice = req.body.purchaseprice;
    if (purchaseprice === "") {
      purchaseprice = null;
    }

    // const existingHSNcode = await product.findOne({
    //   where: { HSNcode: HSNcode, companyId: req.user.companyId },
    // });
    // if (existingHSNcode) {
    //   return res
    //     .status(400)
    //     .json({ status: "false", message: "HSN Code Already Exists" });
    // }
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
      weight,
      lowStockQty,
      companyId: req.user.companyId,
      productType: PRODUCT_TYPE.PRODUCT,
      createdBy: userId,
      updatedBy: userId
    });
    const cashProduct = await C_product.create({
      id: data.id,
      productname: productname,
      lowStockQty: lowStockQty,
      lowstock: lowstock,
      companyId: req.user.companyId,
      productType: PRODUCT_TYPE.PRODUCT,
      unit: unit
    });

    await C_stock.create({
      productId: cashProduct.id
    })

    await Stock.create({
      productId: data.id,
  })
    const productData = await product.findByPk(data.id, {
      include: [{model: User, as: "productUpdateUser", attributes: ['username']},{model: User, as: "productCreateUser", attributes: ['username']}]
    })

    return res.status(200).json({
      status: "true",
      message: "Product created successfully",
      data: productData,
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
      lowStockQty,
      itemselected,
      salesprice,
      gstrate,
      HSNcode,
      cess,
      weight
    } = req.body;
    const userId = req.user.userId;

    let purchaseprice = req.body.purchaseprice;
    if (purchaseprice === "") {
      purchaseprice = null;
    }

    const existingProduct = await product.findOne({
      where: { id: id, companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ status: "false", message: "Product Not Found" });
    }

    // if (existingProduct.HSNcode !== HSNcode) {
    //   const existingHSNcode = await product.findOne({
    //     where: { HSNcode: HSNcode,companyId: req.user.companyId },
    //   });
    //   if (existingHSNcode) {
    //     return res
    //       .status(400)
    //       .json({ status: "false", message: "HSN Code Already Exists" });
    //   }
    // }
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
        weight: weight,
        lowStockQty: lowStockQty,
        companyId: req.user.companyId,
        productType: PRODUCT_TYPE.PRODUCT,
        updatedBy: userId
      },
      {
        where: { id: id },
      }
    );
    await C_product.update({
      productname: productname,
      lowStockQty: lowStockQty,
      lowstock: lowstock,
      productType: PRODUCT_TYPE.PRODUCT,
      unit: unit
    }, {
      where: {
        id: id
      }
    })
    const data = await product.findOne({
      where: { id: id, companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true },
      include: [{model: User, as: "productUpdateUser", attributes: ['username']},{model: User, as: "productCreateUser", attributes: ['username']}]
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

    const data = await product.findOne({
      where: { id: id, companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT },
    });
    const dataCash = await C_product.findOne({
      where: {id: id, companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT}
    })

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "Product Not Found" });
    }
    data.isActive = false;
    dataCash.isActive = false
    await data.save()
    await dataCash.save()
      return res
        .status(200)
        .json({ status: "true", message: "Product Delete Successfully" });
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
      where: { id: id, companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true },
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
    const { search } = req.query;
    const whereClause = { companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true };

    if (search) {
      whereClause.productname = { [Op.like]: `%${search}%` };
    }
    const data = await product.findAll({
      where: whereClause,
      include: [{model: User, as: "productUpdateUser", attributes: ['username']},{model: User, as: "productCreateUser", attributes: ['username']}]
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
      where: { companyId: req.user.companyId, productType: PRODUCT_TYPE.PRODUCT, isActive: true },
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
