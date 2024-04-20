const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const purchasebill = require('./purchasebill');

const purchasebillItem = sequelize.define("P_purchasebillItem", {
    product: { type: DataTypes.STRING },
    qty: { type: DataTypes.STRING },
    rate: { type: DataTypes.INTEGER },
    mrp: { type: DataTypes.INTEGER }
});

purchasebill.hasMany(purchasebillItem);
purchasebillItem.belongsTo(purchasebill);

module.exports = purchasebillItem;