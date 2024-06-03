const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
// const companyUser = require("./companyUser");

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
});

// companyUser.hasMany(User, { foreignKey: "defaultId", onDelete: "CASCADE" });
// User.belongsTo(companyUser, { foreignKey: "defaultId", onDelete: "CASCADE" });

module.exports = User;
