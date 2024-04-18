// 'use strict';

// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//      await queryInterface.bulkInsert('permissions', [
//       {
//         role: 'admin',
//         route: '/create_quotation',
//         permission: true,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       },
//       {
//         role: 'admin',
//         route: '/create_quatationItem',
//         permission: false,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       }
//     ], {});
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//     */
//      await queryInterface.bulkDelete('permissions', null, {});
//   }
// };
'use strict';

const {permissions} = require('../middleware/permissions'); // Import permissions object

module.exports = {
  async up(queryInterface, Sequelize) {
    const promises = [];

    // Iterate over the permissions object
    for (const resource in permissions) {
      console.log("resourx",resource);
      if (permissions.hasOwnProperty(resource)) {
        console.log("permissions",permissions);
        const rolePermissions = permissions[resource];
        console.log("role",rolePermissions);
        for (const role in rolePermissions) {
          if (rolePermissions.hasOwnProperty(role)) {
            const permissionsForRole = rolePermissions[role];
            console.log("Permisionrole",permissionsForRole);
            for (const permissionKey in permissionsForRole) {
              console.log("permissionKey",permissionKey);
              if (permissionsForRole.hasOwnProperty(permissionKey)) {
                const permissionValue = permissionsForRole[permissionKey];
                console.log("valueofpermission",permissionValue);
                // Create a new permission entry for each permission
                promises.push(
                  
                  queryInterface.bulkInsert('permissions', [{
                    role: role,
                    resource: resource,
                    permission: permissionKey,
                    permissionValue: permissionValue,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }])
                );
              }
            }
          }
        }
      }
    }

    // Return a Promise that resolves when all permission creations are done
    return Promise.all(promises);
  },

  async down(queryInterface, Sequelize) {
    // Delete all permission entries
    return queryInterface.bulkDelete('permissions', null, {});
  }
};
