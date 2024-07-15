const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const Machine = require("./Machine");
const PreventiveMaintenance = sequelize.define("P_PreventiveMaintenance", {
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
});

company.hasMany(PreventiveMaintenance,{foreignKey:"companyId", as:'companyPreventiveMaintenance'});
PreventiveMaintenance.belongsTo(company,{foreignKey:"companyId", as:'companyPreventiveMaintenance'});

Machine.hasMany(PreventiveMaintenance,{foreignKey:"machineId", as:'machinePreventiveMaintenance'});
PreventiveMaintenance.belongsTo(Machine,{foreignKey:"machineId", as:'machinePreventiveMaintenance'});

module.exports = PreventiveMaintenance;
