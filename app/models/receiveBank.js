const { DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const customer = require('./customer');
const companyBankDetails = require('./companyBankDetails');
const User = require('./user');

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

User.hasMany(receiveBank,{foreignKey:'createdBy',onDelete:'CASCADE', as:'bankCreateUser'});
receiveBank.belongsTo(User,{foreignKey:'createdBy',onDelete:"CASCADE", as:'bankCreateUser'});

User.hasMany(receiveBank,{foreignKey:'updatedBy',onDelete:'CASCADE', as:'bankUpdateUser'});
receiveBank.belongsTo(User,{foreignKey:'updatedBy',onDelete:"CASCADE", as:'bankUpdateUser'});

customer.hasMany(receiveBank, {foreignKey:'customerId', onDelete:'CASCADE',as:'customerBank'});
receiveBank.belongsTo(customer,{foreignKey:'customerId', onDelete:'CASCADE',as:'customerBank'});

companyBankDetails.hasMany(receiveBank, {foreignKey:'accountId', onDelete:'CASCADE',as:'receiveBank'});
receiveBank.belongsTo(companyBankDetails,{foreignKey:'accountId', onDelete:'CASCADE',as:'receiveBank'});

module.exports = receiveBank;