const ItemCategory = require("../models/ItemCategory");
const ItemGroup = require("../models/ItemGroup");

exports.create_itemCategory = async (req, res) => {
  try {
    const { name, itemGroupId } = req.body;
    const companyId = req.user.companyId
    const existingItemCategory = await ItemCategory.findOne({
        where: {
            name: name,
            companyId: companyId,
            itemGroupId: itemGroupId
        }
    });
    if (existingItemCategory) {
      return res
        .status(404)
        .json({ status: "false", message: "Item Category already exists." });
    }
    const data = await ItemCategory.create({
        name: name,
        companyId: companyId,
        itemGroupId: itemGroupId
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
// exports.update_itemcategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { category, remarks } = req.body;
//
//     const item = await itemcategory.findByPk(id);
//     if (!item) {
//       return res.status(400).json({ message: "Item category not Found" });
//     }
//     await itemcategory.update(
//       {
//         category: category,
//         remarks: remarks,
//       },
//       {
//         where: { id: id },
//       }
//     );
//
//     const data = await itemcategory.findByPk(id);
//     return res
//       .status(200)
//       .json({
//         status: "true",
//         message: "Item category Update Successfully",
//         data: data,
//       });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(500)
//       .json({ status: "false", message: "Internal Server Error" });
//   }
// };
exports.view_itemCategory = async (req, res) => {
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
exports.get_all_itemCategoryGroup = async (req, res) => {
  try {
      const {groupId} = req.params;
      const companyId = req.user.companyId;
      const itemGroup = await ItemGroup.findOne({
          where: {
              id: groupId,
              companyId: companyId
          }
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
