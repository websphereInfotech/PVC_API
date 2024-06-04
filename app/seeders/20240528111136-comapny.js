"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const company = await queryInterface.rawSelect(
      "P_companies",
      {
        where: { companyname: "Shree Krishna Industry" },
      },
      ["id"]
    );
    if (!company) {
      await queryInterface.bulkInsert(
        "P_companies",
        [
          {
            companyname: "Shree Krishna Industry",
            gstnumber: "GSTSI1234567890",
            email: "krishna@example.com",
            mobileno: 1234567890,
            address1: "123 first floor",
            address2: "Mota varachha",
            pincode: 395006,
            state: "Gujarat",
            city: "Surat",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      );
    }
    await queryInterface.bulkInsert(
      "P_companyUsers",
      [
        {
          userId: 1,
          companyId: 1,
          setDefault: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "P_companies",
      { companyname: "Shree Krishna Industry" },
      {}
    );
  },
};
