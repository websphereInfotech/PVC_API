const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Company = require("./company");
const Recipe = require("./recipe");
const User = require("./user");
const ItemType = require("./ItemType");
const ItemGroup = require("./ItemGroup");
const ItemCategory = require("./ItemCategory");
const ItemSubCategory = require("./ItemSubCategory");

const CostingSetting = sequelize.define(
  "CostingSetting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    itemGroupId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    itemCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    itemSubCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    resinRate: { type: DataTypes.FLOAT, defaultValue: 0 },
    brassRate: { type: DataTypes.FLOAT, defaultValue: 0 },
    profitMargin: { type: DataTypes.FLOAT, defaultValue: 0 },
    multiplier: { type: DataTypes.FLOAT, defaultValue: 0 },
    starMargin: { type: DataTypes.FLOAT, defaultValue: 0 },
    goldMargin: { type: DataTypes.FLOAT, defaultValue: 0 },
    silverMargin: { type: DataTypes.FLOAT, defaultValue: 0 },
    refMargin: { type: DataTypes.FLOAT, defaultValue: 0 },
    cdMargin: { type: DataTypes.FLOAT, defaultValue: 0 },
    todMargin: { type: DataTypes.FLOAT, defaultValue: 0 },
    discountBaseColumn: {
      type: DataTypes.ENUM("net", "star", "gold", "silver"),
      defaultValue: "net",
    },
    recipeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "costing_settings",
    timestamps: true,
  }
);

CostingSetting.belongsTo(Company, { foreignKey: "companyId" });
CostingSetting.belongsTo(ItemType, { as: "itemType", foreignKey: "itemTypeId" });
CostingSetting.belongsTo(ItemGroup, { as: "itemGroup", foreignKey: "itemGroupId" });
CostingSetting.belongsTo(ItemCategory, { as: "itemCategory", foreignKey: "itemCategoryId" });
CostingSetting.belongsTo(ItemSubCategory, { as: "itemSubCategory", foreignKey: "itemSubCategoryId" });
CostingSetting.belongsTo(Recipe, { as: "recipeDetail", foreignKey: "recipeId" });
CostingSetting.belongsTo(User, { as: "creator", foreignKey: "createdBy" });
CostingSetting.belongsTo(User, { as: "updater", foreignKey: "updatedBy" });

module.exports = CostingSetting;
