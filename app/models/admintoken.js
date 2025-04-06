const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");

const admintoken = sequelize.define("P_adminToken", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId :{
    type: DataTypes.INTEGER,
    allowNull: true
  },
  employeeId :{
    type: DataTypes.INTEGER,
    allowNull: true
  },

});

admintoken.belongsTo(User, {foreignKey:"userId",onDelete:'CASCADE'});

module.exports = admintoken;
