const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const User = require('./user');
const company = require('./company');
const Account = require('./Account');

const C_salesinvoice = sequelize.define('P_C_salesInvoice', {
    accountId: { type : DataTypes.INTEGER, allowNull: false},
    date : { type: DataTypes.DATEONLY},
    totalMrp: {
        type : DataTypes.INTEGER,
        defaultValue:0
    },
    createdBy:{type: DataTypes.INTEGER},
    updatedBy:{type:DataTypes.INTEGER},
    companyId:{type:DataTypes.INTEGER},
    saleNo: {type: DataTypes.INTEGER, allowNull: false}
});

company.hasMany(C_salesinvoice,{foreignKey:'companyId',as:'companysalesinvcash'});
C_salesinvoice.belongsTo(company,{foreignKey:'companyId',as:'companysalesinvcash'});

User.hasMany(C_salesinvoice,{foreignKey:'createdBy', as:'salesInvoiceCreate'});
C_salesinvoice.belongsTo(User,{foreignKey:'createdBy', as:'salesInvoiceCreate'});

User.hasMany(C_salesinvoice,{foreignKey:'updatedBy', as:'salesInvoiceUpdate'});
C_salesinvoice.belongsTo(User,{foreignKey:'updatedBy', as:'salesInvoiceUpdate'});

Account.hasMany(C_salesinvoice, {foreignKey:'accountId', onDelete:'CASCADE',as:'accountSaleCash'});
C_salesinvoice.belongsTo(Account, {foreignKey:'accountId', onDelete:'CASCADE',as:'accountSaleCash'});

module.exports = C_salesinvoice;