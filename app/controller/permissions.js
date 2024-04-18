const permission = require("../models/permission");

exports.get_all_permissions = async(req,res) => {
    try {
        const data = await permission.findAll();

        if (data.length > 0) {
            // Grouping permissions by role and then by resource
            const groupedPermissions = {};
            data.forEach(item => {
                const role = item.role;
                const resource = item.resource;
                if (!groupedPermissions[role]) {
                    groupedPermissions[role] = {};
                }
                if (!groupedPermissions[role][resource]) {
                    groupedPermissions[role][resource] = [];
                }
                groupedPermissions[role][resource].push({
                    permissionValue: item.permissionValue,
                    permission: item.permission,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                });
            });

            // Constructing the response
            const formattedData = [];
            Object.keys(groupedPermissions).forEach(role => {
                const permissions = [];
                Object.keys(groupedPermissions[role]).forEach(resource => {
                    permissions.push({
                        resource,
                        permissions: groupedPermissions[role][resource]
                    });
                });
                formattedData.push({
                    role,
                    permissions
                });
            });

            return res.status(200).json({ status:'true', message:'Permission Data Fetch Successfully', data: formattedData });
        } else {
            return res.status(404).json({ status:'false', message:'Permission Data not Found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status:'false', message:"Internal Server Error"});
    }
}
