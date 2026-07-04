const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const User = require("./user");

const RawMaterial = sequelize.define('RawMaterial', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rate_per_kg: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    updatedBy: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.INTEGER },
}, {
    tableName: 'raw_materials',
    timestamps: true,
});

RawMaterial.belongsTo(company, { foreignKey: 'companyId' });
RawMaterial.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
RawMaterial.belongsTo(User, { as: 'updater', foreignKey: 'updatedBy' });

module.exports = RawMaterial;
