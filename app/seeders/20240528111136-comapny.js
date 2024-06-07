"use strict";
/** @type {import('sequelize-cli').Migration} */

const {existingData, existingPermission} = require('../util/seeder');
module.exports = {
  async up(queryInterface, Sequelize) {
    // const company = await queryInterface.rawSelect(
    //   "P_companies",
    //   {
    //     where: { companyname: "Shree Krishna Industry" },
    //   },
    //   ["id"]
    // );
    // if (!company) {
    //   await queryInterface.bulkInsert(
    //     "P_companies",
    //     [
    //       {
    //         companyname: "Shree Krishna Industry",
    //         gstnumber: "GSTSI1234567890",
    //         email: "krishna@example.com",
    //         mobileno: 1234567890,
    //         address1: "123 first floor",
    //         address2: "Mota varachha",
    //         pincode: 395006,
    //         state: "Gujarat",
    //         city: "Surat",
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //     ],
    //     {}
    //   );
    // }

    // // Check if company user already exists
    // const existingCompanyUser = await queryInterface.rawSelect(
    //   "P_companyUsers",
    //   {
    //     where: { userId: 1, companyId: 1 },
    //   },
    //   []
    // );
   await existingData();
   await existingPermission();
    // if (!existingCompanyUser) {
    //   await queryInterface.bulkInsert(
    //     "P_companyUsers",
    //     [
    //       {
    //         userId: 1,
    //         companyId: 1,
    //         setDefault: true,
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //       },
    //     ],
    //     {}
    //   );
    // }
  },

  async down(queryInterface, Sequelize) {
    // const companyId = await queryInterface.rawSelect(
    //   "P_companies",
    //   {
    //     where: { companyname: "Shree Krishna Industry" },
    //   },
    //   ["id"]
    // );
    // await queryInterface.bulkDelete(
    //   "P_companyUsers",
    //   { companyId: companyId },
    //   {}
    // );

    // await queryInterface.bulkDelete(
    //   "P_companies",
    //   { companyname: "Shree Krishna Industry" },
    //   {}
    // );
  },
};
