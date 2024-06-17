const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const Company = require("./company");
const Product = require("./product");

const Bom = sequelize.define("P_Bom", {
    bomNo: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    description: { type: DataTypes.TEXT },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
    updatedBy: { type: DataTypes.INTEGER, allowNull: false },
    companyId: { type: DataTypes.INTEGER, allowNull: false },
    productId: {type: DataTypes.INTEGER, allowNull: false },
    qty: { type: DataTypes.INTEGER, allowNull: false },
    unit: { type: DataTypes.STRING, allowNull: false },
});

User.hasMany(Bom, { foreignKey: "updatedBy", as: "bomUpdatedUser" });
Bom.belongsTo(User, { foreignKey: "updatedBy", as: "bomUpdatedUser" });

User.hasMany(Bom, {foreignKey: "createdBy", as: "bomCreatedUser" });
Bom.belongsTo(User, {foreignKey: "createdBy", as: "bomCreatedUser" });

Company.hasMany(Bom, {foreignKey: "companyId", as: "bomCompany" });
Bom.belongsTo(Company, {foreignKey: "companyId", as: "bomCompany" });

Product.hasMany(Bom, {foreignKey: "productId", as: "bomProduct" });
Bom.belongsTo(Product, {foreignKey: "productId", as: "bomProduct" });

module.exports = Bom;
