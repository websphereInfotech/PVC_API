const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_vendor = require('./C_vendor');

const C_PaymentCash = sequelize.define('P_C_PaymentCash', {
    vendorId:{ type: DataTypes.INTEGER},
    amount: {type: DataTypes.INTEGER},
    description : {type: DataTypes.STRING,
        validate:{
            len:[0,20]
        }
    },
    date: {type: DataTypes.DATEONLY}
});

C_vendor.hasMany(C_PaymentCash, {foreignKey:'vendorId',onDelete:'CASCADE', as:'PaymentVendor'});
C_PaymentCash.belongsTo(C_vendor, {foreignKey:'vendorId', onDelete:'CASCADE', as:'PaymentVendor'});

module.exports = C_PaymentCash;