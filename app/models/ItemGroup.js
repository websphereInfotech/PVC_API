const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");

const ItemGroup = sequelize.define("P_ItemGroup", {
  name: {
    type: DataTypes.STRING,
      allowNull: false,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

company.hasMany(ItemGroup, { foreignKey: "companyId", onDelete: "CASCADE" });
ItemGroup.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

module.exports = ItemGroup;
