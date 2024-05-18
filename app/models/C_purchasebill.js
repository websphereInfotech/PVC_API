const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const C_vendor = require('./C_vendor');

const C_purchasebill = sequelize.define('P_C_purchaseBill', {
    vendorId: { type : DataTypes.INTEGER},
    date : { type: DataTypes.DATEONLY},
    totalMrp: {
        type : DataTypes.INTEGER,
        defaultValue:0
    }
});

C_vendor.hasMany(C_purchasebill, {foreignKey:'vendorId', onDelete:'CASCADE', as:'VendorPurchase'});
C_purchasebill.belongsTo(C_vendor, {foreignKey:'vendorId', onDelete:'CASCADE',as:'VendorPurchase'});

module.exports = C_purchasebill;