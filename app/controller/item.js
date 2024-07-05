const C_product = require("../models/C_product");
const item = require("../models/product");
const C_stock = require("../models/C_stock");
const Stock = require("../models/stock");
const User = require("../models/user");
const {Op} = require("sequelize");
const {ITEM_GROUP_TYPE} = require("../constant/constant");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

exports.create_item = async (req, res) => {
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
      cess
    } = req.body;
    const userId = req.user.userId

    let purchaseprice = req.body.purchaseprice;
    let weight = req.body.weight;
    if (purchaseprice === "") {
      purchaseprice = null;
    }
    if (weight === "") {
      weight = null;
    }

    // const existingHSNcode = await item.findOne({
    //   where: { HSNcode: HSNcode, companyId: req.user.companyId },
    // });
    // if (existingHSNcode) {
    //   return res
    //     .status(400)
    //     .json({ status: "false", message: "HSN Code Already Exists" });
    // }
    const data = await item.create({
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
      createdBy: userId,
      updatedBy: userId
    });
    const cashProduct = await C_product.create({
      id: data.id,
      productname: productname,
      lowStockQty: lowStockQty,
      lowstock: lowstock,
      companyId: req.user.companyId,
      unit: unit,
      itemgroup: itemgroup
    });

    await C_stock.create({
      productId: cashProduct.id
    })

    await Stock.create({
      productId: data.id,
  })
    const productData = await item.findByPk(data.id, {
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
exports.update_item = async (req, res) => {
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
      cess
    } = req.body;
    const userId = req.user.userId;

    let purchaseprice = req.body.purchaseprice;
    let weight = req.body.weight;
    if (purchaseprice === "") {
      purchaseprice = null;
    }
    if (weight === "") {
      weight = null;
    }

    const existingProduct = await item.findOne({
      where: { id: id, companyId: req.user.companyId, isActive: true },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ status: "false", message: "Product Not Found" });
    }

    // if (existingProduct.HSNcode !== HSNcode) {
    //   const existingHSNcode = await item.findOne({
    //     where: { HSNcode: HSNcode,companyId: req.user.companyId },
    //   });
    //   if (existingHSNcode) {
    //     return res
    //       .status(400)
    //       .json({ status: "false", message: "HSN Code Already Exists" });
    //   }
    // }
    await item.update(
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
      unit: unit,
      itemgroup: itemgroup
    }, {
      where: {
        id: id
      }
    })
    const data = await item.findOne({
      where: { id: id, companyId: req.user.companyId, isActive: true },
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
exports.delete_item = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await item.findOne({
      where: { id: id, companyId: req.user.companyId},
    });
    const dataCash = await C_product.findOne({
      where: {id: id, companyId: req.user.companyId}
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
exports.view_item = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await item.findOne({
      where: { id: id, companyId: req.user.companyId, isActive: true },
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
exports.get_all_items = async (req, res) => {
  try {
    const { search, group } = req.query;

    const whereClause = { companyId: req.user.companyId, isActive: true };
    if (group) {
      const validGroups = Object.values(ITEM_GROUP_TYPE);
      if (!validGroups.includes(group)) {
        return res.status(400).json({ status: "false", message: 'Invalid Item group type' });
      }
      whereClause.itemgroup = group;
    }
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
                                            Type C API
 ============================================================================================================ */

exports.C_get_all_item = async (req, res) => {
  try {
    const data = await C_product.findAll({
      where: { companyId: req.user.companyId, isActive: true },
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
