const item = require("../models/product");
const Stock = require("../models/stock");
const User = require("../models/user");
const ItemGroup = require("../models/ItemGroup");
const ItemCategory = require("../models/ItemCategory");
const ItemSubCategory = require("../models/ItemSubCategory");
const {Op, Sequelize} = require("sequelize");

/*=============================================================================================================
                                          Without Type C API
 ============================================================================================================ */

exports.create_item = async (req, res) => {
  try {
    const {
      itemtype,
      productname,
      description,
      itemGroupId, itemCategoryId,itemSubCategoryId,
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
      isWastage
    } = req.body;
    const userId = req.user.userId
    const companyId = req.user.companyId;

    let purchaseprice = req.body.purchaseprice;
    let weight = req.body.weight;
    if (purchaseprice === "") {
      purchaseprice = null;
    }
    if (weight === "") {
      weight = null;
    }
    const productNameExist = await item.findOne({
      where: {
        companyId: companyId,
        productname: productname,
        isActive: true
      }
    });
    if(productNameExist){
      return res.status(400).json({
        status: "false",
        message: "Product already exists."
      })
    }
    const itemGroupExist = await ItemGroup.findOne({
      where: {
        id: itemGroupId,
        companyId: companyId,
      }
    })
    if(!itemGroupExist){
      return res.status(404).json({
        status: "false",
        message: "Item Group not Found."
      })
    }
    const itemCategoryItemExist = await ItemCategory.findOne({
      where: {
        id: itemCategoryId,
        itemGroupId: itemGroupId,
        companyId: companyId,
      }
    });
    if(!itemCategoryItemExist){
      return res.status(404).json({
        status: "false",
        message: "Item Category Not Found."
      })
    }
    const itemSubCategoryItemExist = await ItemSubCategory.findOne({
      where: {
        id: itemSubCategoryId,
        itemCategoryId: itemCategoryId,
        companyId: companyId,
      }
    });
    if(!itemSubCategoryItemExist){
      return res.status(404).json({
        status: "false",
        message: "Item Sub Category Not Found."
      })
    }
    const data = await item.create({
      itemtype,
      productname,
      description,
      itemGroupId,
      itemCategoryId,
      itemSubCategoryId,
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
      wastage: isWastage,
      weight,
      lowStockQty,
      companyId: req.user.companyId,
      createdBy: userId,
      updatedBy: userId
    });

    await Stock.create({
      productId: data.id,
  })
    const productData = await item.findByPk(data.id, {
      include: [{model: User, as: "productUpdateUser", attributes: ['username']},{model: User, as: "productCreateUser", attributes: ['username']}]
    })

    return res.status(200).json({
      status: "true",
      message: "Item created successfully",
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
      itemGroupId, itemCategoryId, itemSubCategoryId,
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
      isWastage
    } = req.body;
    const userId = req.user.userId;
    const companyId = req.user.companyId;

    let purchaseprice = req.body.purchaseprice;
    let weight = req.body.weight;
    if (purchaseprice === "") {
      purchaseprice = null;
    }
    if (weight === "") {
      weight = null;
    }

    const productNameExist = await item.findOne({
      where: {
        companyId: companyId,
        productname: productname,
        id: {
          [Sequelize.Op.ne]: id
        }}
    });
    if(productNameExist){
      return res.status(400).json({
        status: "false",
        message: "Product already exists."
      })
    }

    const existingProduct = await item.findOne({
      where: { id: id, companyId: req.user.companyId, isActive: true },
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ status: "false", message: "Item Not Found" });
    }

    const itemGroupExist = await ItemGroup.findOne({
      where: {
        id: itemGroupId,
        companyId: companyId,
      }
    })
    if(!itemGroupExist){
      return res.status(404).json({
        status: "false",
        message: "Item Group not Found."
      })
    }
    const itemCategoryItemExist = await ItemCategory.findOne({
      where: {
        id: itemCategoryId,
        itemGroupId: itemGroupId,
        companyId: companyId,
      }
    });
    if(!itemCategoryItemExist){
      return res.status(404).json({
        status: "false",
        message: "Item Category Not Found."
      })
    }
    const itemSubCategoryItemExist = await ItemSubCategory.findOne({
      where: {
        id: itemSubCategoryId,
        itemCategoryId: itemCategoryId,
        companyId: companyId,
      }
    });
    if(!itemSubCategoryItemExist){
      return res.status(404).json({
        status: "false",
        message: "Item Sub Category Not Found."
      })
    }

    await item.update(
      {
        itemtype: itemtype,
        productname: productname,
        description: description,
        itemGroupId: itemGroupId,
        itemCategoryId: itemCategoryId,
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
        wastage: isWastage,
        weight: weight,
        lowStockQty: lowStockQty,
        companyId: req.user.companyId,
        updatedBy: userId
      },
      {
        where: { id: id },
      }
    );
    const data = await item.findOne({
      where: { id: id, companyId: req.user.companyId, isActive: true },
      include: [{model: User, as: "productUpdateUser", attributes: ['username']},{model: User, as: "productCreateUser", attributes: ['username']}]
    });
    return res.status(200).json({
      status: "true",
      message: "Item Updated Successfully",
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

    if (!data) {
      return res
        .status(400)
        .json({ status: "false", message: "Item Not Found" });
    }
    data.isActive = false;
    await data.save()
      return res
        .status(200)
        .json({ status: "true", message: "Item Delete Successfully" });
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
      include: [{model: ItemGroup, as: "itemGroup"}, {model: ItemCategory, as: "itemCategory"}, {model: ItemSubCategory, as: "itemSubCategory"}]
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
    const { search } = req.query;

    const whereClause = { companyId: req.user.companyId, isActive: true };
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
        .json({ status: "false", message: "Item Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Item Data Fetch Successfully",
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
    const data = await item.findAll({
      where: { companyId: req.user.companyId, isActive: true },
    });
    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Item Not Found" });
    }
    return res.status(200).json({
      status: "true",
      message: "Item Data Fetch Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
