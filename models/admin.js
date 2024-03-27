const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const admin = sequelize.define("admin", {
  // username: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }
  );

module.exports = admin;