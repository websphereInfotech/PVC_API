const ItemGroup = require("../models/ItemGroup");
const ItemType = require("../models/ItemType");
const User = require("../models/user");
const {Sequelize, Op} = require("sequelize");

exports.create_itemGroup = async (req, res) => {
  try {
    const { name, itemTypeId } = req.body;
    const {companyId, userId} = req.user
    const itemTypeExist = await ItemType.findOne({
        where: {
            id: itemTypeId,
            companyId: companyId
        }
    });
    if (!itemTypeExist) {
      return res
        .status(404)
        .json({ status: "false", message: "Item Type not found." });
    }
    const existingGroup = await ItemGroup.findOne({
        where: {
            name: name,
            companyId: companyId,
            itemTypeId: itemTypeId
        }
    });
    if (existingGroup) {
      return res
        .status(400)
        .json({ status: "false", message: "Item Group already exists" });
    }
    const data = await ItemGroup.create({
      name: name,
        itemTypeId: itemTypeId,
        companyId: companyId,
        updatedBy: userId,
        createdBy: userId
    });
    return res
      .status(200)
      .json({
        status: "true",
        message: "Item group created successfully.",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};
exports.update_itemGroup = async (req, res) => {
    try {
        const { name, itemTypeId } = req.body;
        const {id} = req.params;
        const {companyId, userId} = req.user;
        const itemTypeExist = await ItemType.findOne({
            where: {
                id: itemTypeId,
                companyId: companyId
            }
        });
        if (!itemTypeExist) {
            return res
                .status(404)
                .json({ status: "false", message: "Item Type not found." });
        }
        const group = await  ItemGroup.findOne({
            where: {
                id,
                companyId: companyId
            }
        })
        if(!group){
            return res
                .status(404)
                .json({ status: "false", message: "Item Group Not Found." });
        }
        const existingGroup = await ItemGroup.findOne({
            where: {
                name: name,
                companyId: companyId,
                itemTypeId: itemTypeId,
                id: {
                    [Sequelize.Op.ne]: id
                }
            }
        });
        if (existingGroup) {
            return res
                .status(400)
                .json({ status: "false", message: "Item Group already exists" });
        }
        const data = await ItemGroup.update({
            name: name,
            itemTypeId: itemTypeId,
            updatedBy: userId,
        }, {
            where: {
                id
            }
        });
        return res
            .status(200)
            .json({
                status: "true",
                message: "Item group Update successfully.",
                data: data,
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};
exports.view_itemGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const companyId = req.user.companyId;

    const data = await ItemGroup.findOne({
      where: { id, companyId: companyId },
        include: [
            {
                model: User,
                as: "groupUpdateUser"
            },
            {
                model: User,
                as: "groupCreateUser"
            },
            {
                model: ItemType,
                as: "ItemType"
            }
        ]
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

exports.delete_itemGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.companyId;

        const data = await ItemGroup.findOne({
            where: { id, companyId: companyId },
        });

        if (!data) {
            return res
                .status(404)
                .json({ status: "false", message: "Item group Not Found" });
        }
        await data.destroy()
        return res
            .status(200)
            .json({
                status: "true",
                message: "Item group delete successfully",
            });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "false", message: "Internal Server Error" });
    }
};

exports.get_all_itemGroup = async (req, res) => {
  try {
      const companyId = req.user.companyId
      const { search } = req.query;
      const whereClause = { companyId: companyId };
      if (search) {
          whereClause.name = { [Op.like]: `%${search}%` };
      }
    const data = await ItemGroup.findAll({
        where: whereClause,
        include: [
            {
                model: User,
                as: "groupUpdateUser"
            },
            {
                model: User,
                as: "groupCreateUser"
            },
            {
                model: ItemType,
                as: "ItemType"
            }
        ]
    });

      return res
        .status(200)
        .json({
          status: "true",
          message: "Item Group Show Successfully",
          data: data,
        });

  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.get_all_itemGroup_by_type = async (req, res) => {
  try {
      const {typeId} = req.params;
      const companyId = req.user.companyId;
      const itemType = await ItemType.findOne({
          where: {
              id: typeId,
              companyId: companyId
          },
      });
      if(!itemType){
          return res
              .status(404)
              .json({ status: "false", message: "Item Type Not Found." });
      }
      const data = await ItemGroup.findAll({
          where: {
              companyId: companyId,
              itemTypeId: itemType.id
          }
      });
      return res
          .status(200)
          .json({
              status: "true",
              message: "All Item Group Fetch Successfully.",
              data: data,
          });
  } catch (error) {
      console.log(error.message);
      return res
          .status(500)
          .json({ status: "false", message: "Internal Server Error" });
  }
};
