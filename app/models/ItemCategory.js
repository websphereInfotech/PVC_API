const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const ItemGroup = require("./ItemGroup");
const company = require("./company");
const User = require("./user");
const ItemCategory = sequelize.define("P_ItemCategory", {
  name: {
    type: DataTypes.STRING,
  },
  itemGroupId: {
    type: DataTypes.INTEGER,
      allowNull: false,
  },
  updatedBy: { type: DataTypes.INTEGER },
  createdBy: { type: DataTypes.INTEGER },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

company.hasMany(ItemCategory, { foreignKey: "companyId", onDelete: "CASCADE" });
ItemCategory.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

ItemGroup.hasMany(ItemCategory, {foreignKey: "itemGroupId", as: "ItemGroup", onDelete: "CASCADE"});
ItemCategory.belongsTo(ItemGroup, {foreignKey: "itemGroupId", as: "ItemGroup", onDelete: "CASCADE"});

User.hasMany(ItemCategory, { foreignKey: "updatedBy", as: "categoryUpdateUser" });
ItemCategory.belongsTo(User, { foreignKey: "updatedBy", as: "categoryUpdateUser" });

User.hasMany(ItemCategory, { foreignKey: "createdBy", as: "categoryCreateUser" });
ItemCategory.belongsTo(User, { foreignKey: "createdBy", as: "categoryCreateUser" });

module.exports = ItemCategory;
