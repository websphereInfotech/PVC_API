const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const C_vendor = sequelize.define('P_C_vendor',{
    vendorname : {type : DataTypes.STRING}
});


module.exports = C_vendor;