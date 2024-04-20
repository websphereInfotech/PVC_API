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
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//   }
// };
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
      // console.log("resource@@@@@@@@@@@",resource);
      if (permissions.hasOwnProperty(resource)) {
      
        const rolePermissions = permissions[resource];
     
        for (const role in rolePermissions) {
          if (rolePermissions.hasOwnProperty(role)) {
            const permissionsForRole = rolePermissions[role];
        
            for (const permissionKey in permissionsForRole) {
        
              if (permissionsForRole.hasOwnProperty(permissionKey)) {
                const permissionValue = permissionsForRole[permissionKey];
             
                // Create a new permission entry for each permission
                promises.push(
                  
                  queryInterface.bulkInsert('P_permissions', [{
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
