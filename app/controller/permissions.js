const Permission = require("../models/permission");

exports.get_all_permissions = async (req, res) => {
  try {
    // const userType = req.user.type;
    // let data;
    // if (userType === "C")  {
       const data = await Permission.findAll();
      // const allowedResources = ["Login", "Quotation", "Sales Return"];

      // data = await Permission.findAll({
      //   where: {
      //     resource: allowedResources,
      //   },
      // });
    // } 
    // const data = await Permission.findAll();

    if (data.length > 0) {
      const groupedPermissions = {};
      data.forEach((item) => {
        const role = item.role;
        const resource = item.resource;
        if (!groupedPermissions[role]) {
          groupedPermissions[role] = {};
        }
        if (!groupedPermissions[role][resource]) {
          groupedPermissions[role][resource] = [];
        }
        groupedPermissions[role][resource].push({
          id: item.id,
          permissionValue: item.permissionValue,
          permission: item.permission,
          type:item.type,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        });
      });

      const formattedData = [];
      Object.keys(groupedPermissions).forEach((role) => {
        const permissions = [];
        Object.keys(groupedPermissions[role]).forEach((resource) => {
          permissions.push({
            resource,
            permissions: groupedPermissions[role][resource],
          });
        });
        formattedData.push({
          role,
          permissions,
        });
      });

      return res
        .status(200)
        .json({
          status: "true",
          message: "Permission Data Fetch Successfully",
          data: formattedData,
        });
    } else {
      return res
        .status(404)
        .json({ status: "false", message: "Permission Data not Found" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
  }
};

exports.update_permissions = async (req, res) => {
  try {
    const { permissions } = req.body;
    // console.log("userrole",userRole);
    // if (!userRole) {
    //   return res.status(403).json({ status: "false", message: "UserRole Required.." });
    // }

    for (const permission of permissions) {
      const { id, permissionValue } = permission;

      const existingPermission = await Permission.findByPk(id);

      if (!existingPermission) {
        return res
          .status(404)
          .json({
            status: "false",
            message: `Permission with ID ${id} not found`,
          });
      }
      await existingPermission.update({ permissionValue: permissionValue });
    }

    return res
      .status(200)
      .json({ status: "true", message: "Permissions Updated Successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ status: "fail", message: "Internal Server Error" });
  }
};
