"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "P_users",
      [
        {
          username: "Vipul Ghelani",
          email: "",
          mobileno: 9988776655,
          password:
            "$2a$10$Mb31UZbFdVgXmEnXadWx4O2VGzguRS0tIw0XX.DbOzNoPzm8Awja6",
          salary: null,
          role: "Super Admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "P_users",
      { username: "Vipul Ghelani" },
      {}
    );
  },
};
