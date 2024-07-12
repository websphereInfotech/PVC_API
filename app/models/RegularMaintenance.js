const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const Machine = require("./Machine");
const RegularMaintenance = sequelize.define("P_RegularMaintenance", {
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

company.hasMany(RegularMaintenance,{foreignKey:"companyId", as:'companyRegularMaintenance'});
RegularMaintenance.belongsTo(company,{foreignKey:"companyId", as:'companyRegularMaintenance'});


Machine.hasMany(RegularMaintenance,{foreignKey:"machineId", as:'machineRegularMaintenance'});
RegularMaintenance.belongsTo(Machine,{foreignKey:"machineId", as:'machineRegularMaintenance'});

module.exports = RegularMaintenance;
