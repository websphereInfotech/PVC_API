const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const admin = require("./admin");
const User = require("./user");

const admintoken = sequelize.define("P_adminToken", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

admintoken.belongsTo(admin, { foreignKey: "userId", onDelete:"CASCADE"});
admintoken.belongsTo(User, {foreignKey:"userId"})
module.exports = admintoken;
