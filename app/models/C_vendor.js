const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const C_vendor = sequelize.define('P_C_vendor',{
    vendorname : {type : DataTypes.STRING},
    companyId: {type: DataTypes.INTEGER}
});


module.exports = C_vendor;