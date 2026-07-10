const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const User = require("./user");
const ItemType = require("./ItemType");

const ItemGroup = sequelize.define("P_ItemGroup", {
  name: {
    type: DataTypes.STRING,
      allowNull: false,
  },
  itemTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updatedBy: { type: DataTypes.INTEGER },
  createdBy: { type: DataTypes.INTEGER },
});

company.hasMany(ItemGroup, { foreignKey: "companyId", onDelete: "CASCADE" });
ItemGroup.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

ItemType.hasMany(ItemGroup, { foreignKey: "itemTypeId", as: "ItemType", onDelete: "SET NULL" });
ItemGroup.belongsTo(ItemType, { foreignKey: "itemTypeId", as: "ItemType", onDelete: "SET NULL" });

User.hasMany(ItemGroup, { foreignKey: "updatedBy", as: "groupUpdateUser" });
ItemGroup.belongsTo(User, { foreignKey: "updatedBy", as: "groupUpdateUser" });

User.hasMany(ItemGroup, { foreignKey: "createdBy", as: "groupCreateUser" });
ItemGroup.belongsTo(User, { foreignKey: "createdBy", as: "groupCreateUser" });

module.exports = ItemGroup;
