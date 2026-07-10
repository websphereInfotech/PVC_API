const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const User = require("./user");

const ItemType = sequelize.define("P_ItemType", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updatedBy: { type: DataTypes.INTEGER },
  createdBy: { type: DataTypes.INTEGER },
});

company.hasMany(ItemType, { foreignKey: "companyId", onDelete: "CASCADE" });
ItemType.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

User.hasMany(ItemType, { foreignKey: "updatedBy", as: "typeUpdateUser" });
ItemType.belongsTo(User, { foreignKey: "updatedBy", as: "typeUpdateUser" });

User.hasMany(ItemType, { foreignKey: "createdBy", as: "typeCreateUser" });
ItemType.belongsTo(User, { foreignKey: "createdBy", as: "typeCreateUser" });

module.exports = ItemType;
