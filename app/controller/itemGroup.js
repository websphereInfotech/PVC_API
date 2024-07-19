const ItemGroup = require("../models/ItemGroup");

exports.create_itemGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const companyId = req.user.companyId
    const existingGroup = await ItemGroup.findOne({
        where: {
            name: name,
            companyId: companyId
        }
    });
    if (!existingGroup) {
      return res
        .status(400)
        .json({ status: "false", message: "Item Group already exists" });
    }
    const data = await ItemGroup.create({
      name: name,
        companyId: companyId
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
// exports.update_itemgroup = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { group, remarks } = req.body;
//
//     const item = await itemgroup.findByPk(id);
//     if (!item) {
//       return res.status(400).json({ message: "Item group not Found" });
//     }
//     await itemgroup.update(
//       {
//         group: group,
//         remarks: remarks,
//       },
//       {
//         where: { id: id },
//       }
//     );
//     const data = await itemgroup.findByPk(id);
//     return res
//       .status(200)
//       .json({
//         status: "true",
//         message: "Item group Update Successfully",
//         data: data,
//       });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(500)
//       .json({ status: "false", message: "Internal Server Error" });
//   }
// };
exports.view_itemGroup = async (req, res) => {
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
exports.get_all_itemGroup = async (req, res) => {
  try {
      const companyId = req.user.companyId
    const data = await ItemGroup.findAll({
        where: {
            companyId: companyId
        }
    });

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
