const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const User = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
        type: DataTypes.ENUM("superAdmin",'admin', 'financial', 'employee','workers','other'),
        allowNull: false,
      }
  }
  );

module.exports = User;