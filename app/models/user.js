const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");

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
    type: DataTypes.ENUM(
      "Super Admin",
      "Admin",
      "Account",
      "Employee",
      "Workers",
      "Other"
    ),
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
