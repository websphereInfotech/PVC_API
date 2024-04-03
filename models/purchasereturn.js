const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const purchaseReturn = sequelize.define("purchaseReturn", {
    vendor: { type: DataTypes.STRING },
    debitnote: { type: DataTypes.STRING },
    debitdate: { type: DataTypes.DATE },
    billaddress: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    shipaddress: { type: DataTypes.STRING },
    refno: { type: DataTypes.STRING },
    refdate: { type: DataTypes.DATE },
    reason: { type: DataTypes.STRING }
});

module.exports = purchaseReturn;