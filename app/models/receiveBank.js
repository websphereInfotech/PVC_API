const { DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const customer = require('./customer');
const companyBankDetails = require('./companyBankDetails');

const receiveBank = sequelize.define("P_receiveBank", {
    voucherno : {type: DataTypes.INTEGER},
    customerId : {type: DataTypes.INTEGER},
    paymentdate :{type: DataTypes.DATEONLY},
    mode:{
        type: DataTypes.ENUM(
            "Cheque",
            "Net Banking",
            "Cash",
            "UPI",
            "IMPS",
            "NEFT",
            "RTGS",
            "Debit card",
            "Credit card",
            "Other"
        )
    },
    referance:{type : DataTypes.STRING},
    accountId:{type: DataTypes.INTEGER},
    amount: { type: DataTypes.INTEGER}
});

customer.hasMany(receiveBank, {foreignKey:'customerId', onDelete:'CASCADE'});
receiveBank.belongsTo(customer,{foreignKey:'customerId', onDelete:'CASCADE'});

companyBankDetails.hasMany(receiveBank, {foreignKey:'accountId', onDelete:'CASCADE'});
receiveBank.belongsTo(companyBankDetails,{foreignKey:'accountId', onDelete:'CASCADE'});

module.exports = receiveBank;