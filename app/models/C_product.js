const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");

const C_product = sequelize.define("P_C_product", {
  productname: { type: DataTypes.STRING },
  companyId: { type: DataTypes.INTEGER },
});

company.hasMany(C_product, { foreignKey: "companyId", onDelete: "CASCADE" });
C_product.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

module.exports = C_product;
