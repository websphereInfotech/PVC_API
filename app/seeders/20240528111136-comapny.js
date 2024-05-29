'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('P_companies', [{
      companyname: 'Shree Krishna Industry',
      gstnumber: 'GSTSI1234567890', 
      email: 'krishna@example.com', 
      mobileno: 1234567890,
      address1: '123 first floor',
      address2: 'Mota varachha', 
      pincode: 395006, 
      state: 'Gujarat',
      city: 'Surat', 
      createdAt: new Date(),
      updatedAt: new Date(),
    },], {});
  },

  async down(queryInterface, Sequelize) {
   
    await queryInterface.bulkDelete('P_companies', { companyname: 'Shree Krishna Industry' }, {});
  }
};
