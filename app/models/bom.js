const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const Company = require("./company");
const Product = require("./product");
// const Wastage = require("./Wastage");
const {WORKER_SHIFT} = require("../constant/constant");

const Bom = sequelize.define("P_Bom", {
    bomNo: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    weight: { type: DataTypes.FLOAT },
    createdBy: { type: DataTypes.INTEGER, allowNull: false },
    updatedBy: { type: DataTypes.INTEGER, allowNull: false },
    companyId: { type: DataTypes.INTEGER, allowNull: false },
    productId: {type: DataTypes.INTEGER, allowNull: false },
    qty: { type: DataTypes.INTEGER, allowNull: false },
    unit: {type: DataTypes.STRING, allowNull: false},
    totalQty: {type: DataTypes.FLOAT, allowNull: false},
    shift: {
        type: DataTypes.ENUM(...Object.values(WORKER_SHIFT)),
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    wastageId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    wastageQty: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

User.hasMany(Bom, { foreignKey: "updatedBy", as: "bomUpdatedUser" });
Bom.belongsTo(User, { foreignKey: "updatedBy", as: "bomUpdatedUser" });

User.hasMany(Bom, {foreignKey: "createdBy", as: "bomCreatedUser" });
Bom.belongsTo(User, {foreignKey: "createdBy", as: "bomCreatedUser" });

Company.hasMany(Bom, {foreignKey: "companyId", as: "bomCompany" });
Bom.belongsTo(Company, {foreignKey: "companyId", as: "bomCompany" });

Product.hasMany(Bom, {foreignKey: "productId", as: "bomProduct" });
Bom.belongsTo(Product, {foreignKey: "productId", as: "bomProduct" });


Product.hasMany(Bom, { foreignKey: "wastageId", as: "bomWastageProduct" });
Bom.belongsTo(Product, { foreignKey: "wastageId", as: "bomWastageProduct" });

module.exports = Bom;
