const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const vendor = require('./vendor');
const companyBankDetails = require('./companyBankDetails');
const User = require('./user');


const paymentBank = sequelize.define("P_paymentBank", {
    voucherno:{type: DataTypes.INTEGER},
    vendorId : {type: DataTypes.INTEGER},
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

User.hasMany(paymentBank,{foreignKey:'createdBy',onDelete:'CASCADE', as:'paymentCreateUser'});
paymentBank.belongsTo(User,{foreignKey:'createdBy',onDelete:"CASCADE", as:'paymentCreateUser'});

User.hasMany(paymentBank,{foreignKey:'updatedBy',onDelete:'CASCADE', as:'paymentUpdateUser'});
paymentBank.belongsTo(User,{foreignKey:'updatedBy',onDelete:"CASCADE", as:'paymentUpdateUser'});

vendor.hasMany(paymentBank, {foreignKey:'vendorId', onDelete:'CASCADE',as:'paymentData'});
paymentBank.belongsTo(vendor, {foreignKey:'vendorId', onDelete:'CASCADE',as:'paymentData'});

companyBankDetails.hasMany(paymentBank,{ foreignKey:'accountId', onDelete:'CASCADE',as:'paymentBank'});
paymentBank.belongsTo(companyBankDetails, {foreignKey:'accountId', onDelete:'CASCADE',as:'paymentBank'});

module.exports = paymentBank;