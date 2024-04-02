const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const purchasebill = sequelize.define("purchasebill", {
    vendor: {
        type: DataTypes.STRING
    },
    mobileno: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    billno: { type: DataTypes.STRING },
    billdate: { type: DataTypes.DATE },
    terms: { type: DataTypes.INTEGER },
    duedate: { type: DataTypes.DATE },
    book: { type: DataTypes.STRING },
    pono: { type: DataTypes.STRING }
});

module.exports = purchasebill;