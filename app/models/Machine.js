const { DataTypes} = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const Machine = sequelize.define("P_Machine", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    companyId: {type: DataTypes.INTEGER, allowNull: false},
});

company.hasMany(Machine,{foreignKey:"companyId", as:'companyMachine'});
Machine.belongsTo(company,{foreignKey:"companyId", as:'companyMachine'});


module.exports = Machine;
