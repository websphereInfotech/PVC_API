const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");

const permissions = sequelize.define("P_permissions", {
  role: { type: DataTypes.STRING },
  resource: { type: DataTypes.STRING },
  permissionValue: { type: DataTypes.BOOLEAN },
  permission: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  companyId: {
    type: DataTypes.INTEGER,
  },
});

company.hasMany(permissions, { foreignKey: "companyId", onDelete: "CASCADE" });
permissions.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
});

module.exports = permissions;
