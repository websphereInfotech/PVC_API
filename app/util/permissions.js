const { permissions } = require('../middleware/permissions');
const Permissions = require('../models/permission')
const permissionAdd = async (companyId) => {
    const promises = []
    for (const resource in permissions) {
              const rolePermissions = permissions[resource];
        
              for (const role in rolePermissions) {
                const permissionsForRole = rolePermissions[role];
        
                for (const permissionKey in permissionsForRole) {
                  const permissionValue = permissionsForRole[permissionKey];
                  const type = resource.includes("Cash") ? true : false;
                  promises.push({
                    role: role,
                    resource: resource,
                    permission: permissionKey,
                    permissionValue: permissionValue,
                    type: type,
                    companyId: companyId,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  });
                }
              }
            }
        

        return Permissions.bulkCreate(promises);
    };

module.exports = permissionAdd;
