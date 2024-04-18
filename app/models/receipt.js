const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const receipt = sequelize.define("receipt", {
    voucherno: { type: DataTypes.STRING },
    account: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    receiptdate: { type: DataTypes.DATE },
    mode: { type: DataTypes.STRING },
    refno: { type: DataTypes.STRING },
    depositto: { type: DataTypes.STRING },
    amountrecive: { type: DataTypes.FLOAT }
});

module.exports = receipt;