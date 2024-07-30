const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const C_salesinvoice = require('./C_salesinvoice');
const C_receiveCash = require('./C_Receipt');
const C_customer = require('./C_customer');
const company = require('./company');

const C_customerLedger = sequelize.define("P_C_customerLedger", {
    customerId: { type: DataTypes.INTEGER },
    creditId: { type: DataTypes.INTEGER },
    debitId: { type: DataTypes.INTEGER },
    companyId: { type: DataTypes.INTEGER },
    date: { type: DataTypes.DATEONLY }
});

company.hasMany(C_customerLedger,{foreignKey:'companyId',onDelete:'CASCADE',as:'companycustomerldcash'});
C_customerLedger.hasMany(company,{foreignKey:'companyId',onDelete:'CASCADE',as:'companycustomerldcash'});

C_salesinvoice.hasMany(C_customerLedger, { foreignKey: 'creditId', onDelete: 'CASCADE', as: 'invoiceLedger' });
C_customerLedger.belongsTo(C_salesinvoice, { foreignKey: 'creditId', onDelete: 'CASCADE', as: 'invoiceLedger' });

C_receiveCash.hasMany(C_customerLedger, { foreignKey: 'debitId', onDelete: 'CASCADE', as: 'receiceLedger' });
C_customerLedger.belongsTo(C_receiveCash, { foreignKey: 'debitId', onDelete: 'CASCADE', as: 'receiceLedger' });

C_customer.hasMany(C_customerLedger,{foreignKey:'customerId', onDelete:'CASCADE', as:'customerData'});
C_customerLedger.belongsTo(C_customer, {foreignKey:'customerId', onDelete:'CASCADE', as:'customerData'});

module.exports = C_customerLedger;