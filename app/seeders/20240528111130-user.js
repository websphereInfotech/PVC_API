"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const user = await queryInterface.rawSelect(
      "P_users",
      {
        where: { username: "Vipul Ghelani" },
      },
      ["id"]
    );
    if (!user) {
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
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "P_users",
      { username: "Vipul Ghelani" },
      {}
    );
  },
};
