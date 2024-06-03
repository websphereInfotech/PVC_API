// const { permissions } = require('../middleware/permissions');

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     const promises = [];

//     for (const resource in permissions) {
//       const rolePermissions = permissions[resource];

//       for (const role in rolePermissions) {
//         const permissionsForRole = rolePermissions[role];

//         for (const permissionKey in permissionsForRole) {
//           const permissionValue = permissionsForRole[permissionKey];

//           promises.push({
//             role: role,
//             resource: resource,
//             permission: permissionKey,
//             permissionValue: permissionValue,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//           });
//         }
//       }
//     }

//     return queryInterface.bulkInsert('P_permissions', promises);

//   },

//   async down(queryInterface, Sequelize) {
//     return queryInterface.bulkDelete('P_permissions', null, {});
//   },
// };

// const { permissions } = require("../middleware/permissions");

// module.exports = {
//   async up(queryInterface, Sequelize) {
//     const existingPermissions = await queryInterface.sequelize.query(
//       "SELECT * FROM P_permissions WHERE companyId = :1 AND permission = :permission",
//       {
//         replacements: { companyId :companyId},
//         type: Sequelize.QueryTypes.SELECT,
//       }
//     );

//     const existingPermissionSet = new Set();
//     existingPermissions.forEach(({ role, resource, permission }) => {
//       existingPermissionSet.add(`${role}-${resource}-${permission}`);
//     });

//     const promises = [];

//     for (const resource in permissions) {
//       const rolePermissions = permissions[resource];

//       for (const role in rolePermissions) {
//         const permissionsForRole = rolePermissions[role];

//         for (const permissionKey in permissionsForRole) {
//           const permissionValue = permissionsForRole[permissionKey];
//           const permissionIdentifier = `${role}-${resource}-${permissionKey}`;
//           const type = resource.includes("Cash") ? true : false;
//           if (!existingPermissionSet.has(permissionIdentifier)) {
//             promises.push({
//               role: role,
//               resource: resource,
//               permission: permissionKey,
//               permissionValue: permissionValue,
//               type: type,
//               companyId: 1,
//               createdAt: new Date(),
//               updatedAt: new Date(),
//             });
//             existingPermissionSet.add(permissionIdentifier);
//           }
//         }
//       }
//     }

//     return queryInterface.bulkInsert("P_permissions", promises);
//   },

//   async down(queryInterface, Sequelize) {
//     return queryInterface.bulkDelete("P_permissions", null, {});
//   },
// };
const { permissions } = require("../middleware/permissions");

module.exports = {
  async up(queryInterface, Sequelize) {
    const companyId = 1; 

    const existingPermissions = await queryInterface.sequelize.query(
      "SELECT * FROM P_permissions WHERE companyId = :companyId AND permission = :permission",
      {
        replacements: { companyId: companyId, permission: 'permission' }, 
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const existingPermissionSet = new Set();
    existingPermissions.forEach(({ role, resource, permission }) => {
      existingPermissionSet.add(`${role}-${resource}-${permission}`);
    });

    const promises = [];

    for (const resource in permissions) {
      const rolePermissions = permissions[resource];

      for (const role in rolePermissions) {
        const permissionsForRole = rolePermissions[role];

        for (const permissionKey in permissionsForRole) {
          const permissionValue = permissionsForRole[permissionKey];
          const permissionIdentifier = `${role}-${resource}-${permissionKey}`;
          const type = resource.includes("Cash");
          if (!existingPermissionSet.has(permissionIdentifier)) {
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
            existingPermissionSet.add(permissionIdentifier);
          }
        }
      }
    }

    return queryInterface.bulkInsert("P_permissions", promises);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("P_permissions", null, {});
  },
};
