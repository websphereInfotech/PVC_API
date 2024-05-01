

const { permissions } = require('../middleware/permissions');

module.exports = {
  async up(queryInterface, Sequelize) {
    const promises = [];

    for (const resource in permissions) {
      const rolePermissions = permissions[resource];
    
      for (const role in rolePermissions) {
        const permissionsForRole = rolePermissions[role];
    
        for (const permissionKey in permissionsForRole) {
          const permissionValue = permissionsForRole[permissionKey];
    
          promises.push({
            role: role,
            resource: resource,
            permission: permissionKey,
            permissionValue: permissionValue,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }
    
    
    return queryInterface.bulkInsert('P_permissions', promises);
    
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('P_permissions', null, {});
  },
};

