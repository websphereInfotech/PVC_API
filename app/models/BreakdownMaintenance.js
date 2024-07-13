const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const Machine = require("./Machine");
const BreakdownMaintenance = sequelize.define("P_BreakdownMaintenance", {
    machineId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    performed: {
        type: DataTypes.STRING,
    },
    cost: {
        type: DataTypes.INTEGER,
    },
    companyId: {type: DataTypes.INTEGER, allowNull: false},
    reason: {
        type: DataTypes.STRING,
    },
});

company.hasMany(BreakdownMaintenance,{foreignKey:"companyId", as:'companyBreakdownMaintenance'});
BreakdownMaintenance.belongsTo(company,{foreignKey:"companyId", as:'companyBreakdownMaintenance'});


Machine.hasMany(BreakdownMaintenance,{foreignKey:"machineId", as:'machineBreakdownMaintenance'});
BreakdownMaintenance.belongsTo(Machine,{foreignKey:"machineId", as:'machineBreakdownMaintenance'});

module.exports = BreakdownMaintenance;
