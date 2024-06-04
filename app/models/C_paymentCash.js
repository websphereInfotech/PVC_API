const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_vendor = require('./C_vendor');
const User = require('./user');

const C_PaymentCash = sequelize.define('P_C_paymentCash', {
    vendorId:{ type: DataTypes.INTEGER},
    amount: {type: DataTypes.INTEGER},
    description : {type: DataTypes.STRING,
        validate:{
            len:[0,20]
        }
    },
    date: {type: DataTypes.DATEONLY},
    createdBy:{type: DataTypes.INTEGER},
    updatedBy:{type:DataTypes.INTEGER},
    companyId: {type: DataTypes.INTEGER}
});

User.hasMany(C_PaymentCash,{foreignKey:'createdBy', as:'paymentCreate'});
C_PaymentCash.belongsTo(User,{foreignKey:'createdBy', as:'paymentCreate'});

User.hasMany(C_PaymentCash,{foreignKey:'updatedBy', as:'paymentUpdate'});
C_PaymentCash.belongsTo(User,{foreignKey:'updatedBy', as:'paymentUpdate'});


C_vendor.hasMany(C_PaymentCash, {foreignKey:'vendorId',onDelete:'CASCADE', as:'PaymentVendor'});
C_PaymentCash.belongsTo(C_vendor, {foreignKey:'vendorId', onDelete:'CASCADE', as:'PaymentVendor'});

module.exports = C_PaymentCash;