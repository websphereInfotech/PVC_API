const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const purchaseReturn = sequelize.define("P_purchaseReturn", {
    vendor: { type: DataTypes.STRING },
    debitnote: { type: DataTypes.STRING },
    debitdate: { type: DataTypes.DATE },
    refno: { type: DataTypes.STRING },
    refdate: { type: DataTypes.DATE }
});

module.exports = purchaseReturn;