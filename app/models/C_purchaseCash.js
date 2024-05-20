const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const C_vendor = require('./C_vendor');

const C_purchaseCash = sequelize.define('P_C_purchaseCash', {
    vendorId: { type : DataTypes.INTEGER},
    date : { type: DataTypes.DATEONLY},
    totalMrp: {
        type : DataTypes.INTEGER,
        defaultValue:0
    }
});

C_vendor.hasMany(C_purchaseCash, {foreignKey:'vendorId', onDelete:'CASCADE', as:'VendorPurchase'});
C_purchaseCash.belongsTo(C_vendor, {foreignKey:'vendorId', onDelete:'CASCADE',as:'VendorPurchase'});

module.exports = C_purchaseCash;