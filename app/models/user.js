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
        type: DataTypes.ENUM("Super Admin",'Admin', 'Financial', 'Employee','Workers','Other'),
        allowNull: false,
      }
  }
  );

module.exports = User;