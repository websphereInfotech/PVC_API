const ItemSubCategory = require("../models/ItemSubCategory");
const ItemCategory = require("../models/ItemCategory");
const User = require("../models/user");
const {Sequelize, Op} = require("sequelize");

exports.create_itemSubCategory = async (req, res) => {
  try {
    const { name, itemCategoryId } = req.body;
    const {companyId, userId} = req.user
      const itemCategoryExist = await ItemCategory.findOne({
          where: {
              companyId: companyId,
              id: itemCategoryId
          }
      })
      if(!itemCategoryExist){
          return res
              .status(404)
              .json({ status: "false", message: "Item category not found." });
      }
    const existingItemSubCategory = await ItemSubCategory.findOne({
        where: {
            name: name,
            companyId: companyId,
            itemCategoryId: itemCategoryId
        }
    });
    if (existingItemSubCategory) {
      return res
        .status(400)
        .json({ status: "false", message: "Item Sub Category already exists." });
    }
    const data = await ItemSubCategory.create({
        name: name,
        companyId: companyId,
        itemCategoryId: itemCategoryId,
        updatedBy: userId,
        createdBy: userId
    });
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item sub category created successfully.",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_itemSubCategory = async (req, res) => {
    try {
        const { name, itemCategoryId } = req.body;
        const {id} = req.params;
        const {companyId, userId} = req.user
        const itemCategoryExist = await ItemCategory.findOne({
            where: {
                companyId: companyId,
                id: itemCategoryId
            }
        })
        if(!itemCategoryExist){
            return res
                .status(404)
                .json({ status: "false", message: "Item category not found." });
        }
        const existingItemSubCategory = await ItemSubCategory.findOne({
            where: {
                name: name,
                companyId: companyId,
                itemCategoryId: itemCategoryId,
                id: {
                    [Sequelize.Op.ne]: id
                }
            }
        });
        if (existingItemSubCategory) {
            return res
                .status(400)
                .json({ status: "false", message: "Item Sub Category already exists." });
        }
        const data = await ItemSubCategory.update({
            name: name,
            itemCategoryId: itemCategoryId,
            updatedBy: userId,
        }, {where: {
            id: id
            }});
        return res
            .status(200)
            .json({
                status: "true",
                message: "Item sub category update successfully.",
                data: data,
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};
exports.view_itemSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId

    const data = await ItemSubCategory.findOne({
      where: { id, companyId: companyId },
        include: [
            {
                model: User,
                as: "subCategoryUpdateUser"
            },
            {
                model: User,
                as: "subCategoryCreateUser"
            },
            {
                model: ItemCategory,
                as: "ItemCategory"
            }
        ]
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Item sub category Not Found." });
    }
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item sub category data fetch successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_itemSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId

    const data = await ItemSubCategory.findOne({
      where: { id, companyId: companyId },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Item sub category Not Found." });
    }
    await data.destroy()
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item sub category delete successfully",
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_itemSubCategory_by_category = async (req, res) => {
  try {
      const {categoryId} = req.params;
      const companyId = req.user.companyId;
      const itemCategory = await ItemCategory.findOne({
          where: {
              id: categoryId,
              companyId: companyId
          },
      });
      if(!itemCategory){
          return res
              .status(404)
              .json({ status: "false", message: "Item Category Not Found." });
      }
    const data = await ItemSubCategory.findAll({
        where: {
            companyId: companyId,
            itemCategoryId: itemCategory.id
        }
    });
    if (data) {
      return res
        .status(200)
        .json({
          status: "true",
          message: "All Item Sub Category Fetch Successfully.",
          data: data,
        });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Item Sub Category Not Found" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};


exports.view_all_itemSubCategory = async (req, res) => {
    try {
        const companyId = req.user.companyId
        const { search } = req.query;
        const whereClause = { companyId: companyId };
        if (search) {
            whereClause.name = { [Op.like]: `%${search}%` };
        }

        const data = await ItemSubCategory.findAll({
            where: whereClause,
            include: [
                {
                    model: User,
                    as: "subCategoryUpdateUser"
                },
                {
                    model: User,
                    as: "subCategoryCreateUser"
                },
                {
                    model: ItemCategory,
                    as: "ItemCategory"
                }
            ]
        });

        return res
            .status(200)
            .json({
                status: "true",
                message: "Item sub category data fetch successfully",
                data: data,
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};