const ItemCategory = require("../models/ItemCategory");
const ItemGroup = require("../models/ItemGroup");
const User = require("../models/user");
const {Sequelize} = require("sequelize");

exports.create_itemCategory = async (req, res) => {
  try {
    const { name, itemGroupId } = req.body;
    const {companyId, userId} = req.user
      const itemGroupExist = await ItemGroup.findOne({
          where: {
              companyId: companyId,
              id: itemGroupId
          }
      })
      if(!itemGroupExist){
          return res
              .status(404)
              .json({ status: "false", message: "Item group not found." });
      }
    const existingItemCategory = await ItemCategory.findOne({
        where: {
            name: name,
            companyId: companyId,
            itemGroupId: itemGroupId
        }
    });
    if (existingItemCategory) {
      return res
        .status(400)
        .json({ status: "false", message: "Item Category already exists." });
    }
    const data = await ItemCategory.create({
        name: name,
        companyId: companyId,
        itemGroupId: itemGroupId,
        updatedBy: userId,
        createdBy: userId
    });
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item category created successfully.",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_itemCategory = async (req, res) => {
    try {
        const { name, itemGroupId } = req.body;
        const {id} = req.params;
        const {companyId, userId} = req.user
        const itemGroupExist = await ItemGroup.findOne({
            where: {
                companyId: companyId,
                id: itemGroupId
            }
        })
        if(!itemGroupExist){
            return res
                .status(404)
                .json({ status: "false", message: "Item group not found." });
        }
        const existingItemCategory = await ItemCategory.findOne({
            where: {
                name: name,
                companyId: companyId,
                itemGroupId: itemGroupId,
                id: {
                    [Sequelize.Op.ne]: id
                }
            }
        });
        if (existingItemCategory) {
            return res
                .status(400)
                .json({ status: "false", message: "Item Category already exists." });
        }
        const data = await ItemCategory.update({
            name: name,
            itemGroupId: itemGroupId,
            updatedBy: userId,
        }, {where: {
            id: id
            }});
        return res
            .status(200)
            .json({
                status: "true",
                message: "Item category update successfully.",
                data: data,
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};
exports.view_itemCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId

    const data = await ItemCategory.findOne({
      where: { id, companyId: companyId },
        include: [
            {
                model: User,
                as: "categoryUpdateUser"
            },
            {
                model: User,
                as: "categoryCreateUser"
            },
            {
                model: ItemGroup,
                as: "ItemGroup"
            }
        ]
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Item category Not Found." });
    }
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item category data fetch successfully",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.delete_itemCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId

    const data = await ItemCategory.findOne({
      where: { id, companyId: companyId },
    });

    if (!data) {
      return res
        .status(404)
        .json({ status: "false", message: "Item category Not Found." });
    }
    await data.destroy()
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item category delete successfully",
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.get_all_itemCategoryGroup = async (req, res) => {
  try {
      const {groupId} = req.params;
      const companyId = req.user.companyId;
      const itemGroup = await ItemGroup.findOne({
          where: {
              id: groupId,
              companyId: companyId
          },
      });
      if(!itemGroup){
          return res
              .status(404)
              .json({ status: "false", message: "Item Group Not Found." });
      }
    const data = await ItemCategory.findAll({
        where: {
            companyId: companyId,
            itemGroupId: itemGroup.id
        }
    });
    if (data) {
      return res
        .status(200)
        .json({
          status: "true",
          message: "All Item Category Fetch Successfully.",
          data: data,
        });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Item Category Not Found" });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};


exports.view_all_itemCategory = async (req, res) => {
    try {
        const companyId = req.user.companyId

        const data = await ItemCategory.findAll({
            where: { companyId: companyId },
            include: [
                {
                    model: User,
                    as: "categoryUpdateUser"
                },
                {
                    model: User,
                    as: "categoryCreateUser"
                },
                {
                    model: ItemGroup,
                    as: "ItemGroup"
                }
            ]
        });

        return res
            .status(200)
            .json({
                status: "true",
                message: "Item category data fetch successfully",
                data: data,
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};