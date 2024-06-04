const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const company = require('./company');

const C_vendor = sequelize.define('P_C_vendor',{
    vendorname : {type : DataTypes.STRING},
    companyId: {type: DataTypes.INTEGER}
});

company.hasMany(C_vendor,{foreignKey:'companyId', onDelete:'CASCADE'});
C_vendor.belongsTo(company,{foreignKey:'companyId', onDelete:'CASCADE'});

module.exports = C_vendor;