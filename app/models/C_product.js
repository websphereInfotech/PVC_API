const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const {PRODUCT_TYPE} = require("../constant/constant");

const C_product = sequelize.define("P_C_product", {
  productname: { type: DataTypes.STRING },
  companyId: { type: DataTypes.INTEGER },
  lowstock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  lowStockQty: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nagativeqty: {
    type: DataTypes.BOOLEAN
  },
  productType: {
    type: DataTypes.ENUM,
    values: [PRODUCT_TYPE.PRODUCT, PRODUCT_TYPE.RAW_MATERIAL],
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  }
});

company.hasMany(C_product, { foreignKey: "companyId", onDelete: "CASCADE" });
C_product.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

module.exports = C_product;
