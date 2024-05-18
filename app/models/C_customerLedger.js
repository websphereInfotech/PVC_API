const { DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_salesinvoice = require('./C_salesinvoice');
const C_receiveCash = require('./C_receiveCash');

const C_customerLedger = sequelize.define("P_C_customerLedger", {
    customerId : {type : DataTypes.INTEGER},
    creditId : {type: DataTypes.INTEGER},
    debitId : {type : DataTypes.INTEGER},
    date: {type: DataTypes.DATEONLY}
});

C_salesinvoice.hasMany(C_customerLedger, {foreignKey:'creditId', onDelete:'CASCADE'});
C_customerLedger.belongsTo(C_salesinvoice, {foreignKey:'creditId', onDelete:'CASCADE'});

C_receiveCash.hasMany(C_customerLedger, { foreignKey:'debitId', onDelete:'CASCADE'});
C_customerLedger.belongsTo(C_receiveCash, {foreignKey:'debitId', onDelete:'CASCADE'});

module.exports = C_customerLedger;