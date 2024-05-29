const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const company = require('./company');

const companyBankDetails = sequelize.define('P_companyBankDetails', {
    companyId: {type:DataTypes.INTEGER},
    accountname:{type: DataTypes.STRING},
    bankname: {type: DataTypes.STRING},
    accountnumber: {type: DataTypes.STRING},
    ifsccode: {type: DataTypes.STRING},
    branch: {type: DataTypes.STRING}
});

company.hasMany(companyBankDetails,{foreignKey:'companyId', onDelete:'CASCADE',as:'comapnyBank'});
companyBankDetails.belongsTo(company,{foreignKey:'companyId', onDelete:'CASCADE',as:'comapnyBank'});

module.exports = companyBankDetails;