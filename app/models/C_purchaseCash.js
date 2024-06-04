const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const C_vendor = require('./C_vendor');
const User = require('./user');

const C_purchaseCash = sequelize.define('P_C_purchaseCash', {
    vendorId: { type : DataTypes.INTEGER},
    date : { type: DataTypes.DATEONLY},
    totalMrp: {
        type : DataTypes.INTEGER,
        defaultValue:0
    },
    createdBy:{type: DataTypes.INTEGER},
    updatedBy:{type:DataTypes.INTEGER}
});

User.hasMany(C_purchaseCash,{foreignKey:'createdBy', as:'purchaseCreateUser'});
C_purchaseCash.belongsTo(User,{foreignKey:'createdBy', as:'purchaseCreateUser'});

User.hasMany(C_purchaseCash,{foreignKey:'updatedBy', as:'purchaseUpdateUser'});
C_purchaseCash.belongsTo(User,{foreignKey:'updatedBy', as:'purchaseUpdateUser'});

C_vendor.hasMany(C_purchaseCash, {foreignKey:'vendorId', onDelete:'CASCADE', as:'VendorPurchase'});
C_purchaseCash.belongsTo(C_vendor, {foreignKey:'vendorId', onDelete:'CASCADE',as:'VendorPurchase'});

module.exports = C_purchaseCash;