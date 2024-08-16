const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");
const {ROLE} = require("../constant/constant");

const User = sequelize.define("P_user", {
  username: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  mobileno: {
    type: DataTypes.BIGINT,
  },
  salary: {
    type: DataTypes.INTEGER,
  },
  password: {
    type: DataTypes.STRING,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(ROLE)),
    allowNull: false,
  },
  entryTime: {
    type: DataTypes.TIME,
  },
  exitTime: {
    type: DataTypes.TIME,
  }
});

module.exports = User;
