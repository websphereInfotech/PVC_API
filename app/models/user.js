const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const User = sequelize.define("P_user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobileno: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  salary: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(
      "Admin",
      "Financial",
      "Employee",
      "Workers",
      "Other"
    ),
    allowNull: false,
  },
});

module.exports = User;
