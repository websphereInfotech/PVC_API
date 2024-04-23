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


const {permissions} = require('../middleware/permissions'); 

module.exports = {
  async up(queryInterface, Sequelize) {
    const promises = [];

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

    return Promise.all(promises);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('P_permissions', null, {});
  }
};

