const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const C_customer = require('./C_customer');
const User = require('./user');
const company = require('./company');

const C_salesinvoice = sequelize.define('P_C_salesInvoice', {
    customerId: { type : DataTypes.INTEGER},
    date : { type: DataTypes.DATEONLY},
    totalMrp: {
        type : DataTypes.INTEGER,
        defaultValue:0
    },
    createdBy:{type: DataTypes.INTEGER},
    updatedBy:{type:DataTypes.INTEGER},
    companyId:{type:DataTypes.INTEGER}
});

company.hasMany(C_salesinvoice,{foreignKey:'companyId',as:'companysalesinvcash'});
C_salesinvoice.belongsTo(company,{foreignKey:'companyId',as:'companysalesinvcash'});

User.hasMany(C_salesinvoice,{foreignKey:'createdBy', as:'salesInvoiceCreate'});
C_salesinvoice.belongsTo(User,{foreignKey:'createdBy', as:'salesInvoiceCreate'});

User.hasMany(C_salesinvoice,{foreignKey:'updatedBy', as:'salesInvoiceUpdate'});
C_salesinvoice.belongsTo(User,{foreignKey:'updatedBy', as:'salesInvoiceUpdate'});

C_customer.hasMany(C_salesinvoice, {foreignKey:'customerId', onDelete:'CASCADE',as:'CashCustomer'});
C_salesinvoice.belongsTo(C_customer, {foreignKey:'customerId', onDelete:'CASCADE',as:'CashCustomer'});

module.exports = C_salesinvoice;