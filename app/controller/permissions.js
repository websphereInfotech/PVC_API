const Permission = require("../models/permission");

exports.get_all_permissions = async (req, res) => {
  try {
    const userType = req.user.type;
    let data;
    if (userType === "C") {
      const allowedResources = ["Login", "Quotation", "Sales Return"];

      data = await Permission.findAll({
        where: {
          resource: allowedResources,
        },
      });
    } else {
      data = await Permission.findAll();
    }
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
// exports.update_permissions = async (req, res) => {
//     try {
//         const { userRole, permissions } = req.body;

//         if(userRole !== 'Super Admin') {
//             return res.status(403).json({ status:'false', message:'Unauthorized'});
//         }

//         for(const permission of permissions) {
//             const { role, resource, permissionValue } = permission;

//             const roleData = await Permission.findOne({ where:{role:role}});

//             if(!roleData) {
//                 return res.status(404).json({status:'false', message:`${role} Role not found`});
//             }

//             const updatePermissions = await Permission.update(
//                 {permissionValue: permissionValue},
//                 { where :{ role:role, resource: resource, permission:permission.permission}}
//             );

//             if(!updatePermissions){
//                 return res.status(404).json({ status:'false', message: `Permission not found for the resource ${resource}`});
//             }
//         }
//         return res.status(200).json({ status:'true',message:'Permissions Updated Successfully'})
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ status: 'fail', message: 'Internal Server Error' });
//     }
// };

exports.update_permissions = async (req, res) => {
  try {
    const { userRole, permissions } = req.body;

    if (userRole !== "Super Admin") {
      return res.status(403).json({ status: "false", message: "Unauthorized" });
    }

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
