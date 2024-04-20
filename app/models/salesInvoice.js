const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const salesInvoice = sequelize.define("P_salesInvoice", {
    book: {
        type: DataTypes.STRING
    },
    seriesname: {
        type: DataTypes.STRING
    },
    invoiceno: { type: DataTypes.STRING },
    invoicedate: { type: DataTypes.STRING },
    terms: { type: DataTypes.INTEGER },
    duedate: { type: DataTypes.DATE },
    quotation_no: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    mobileno: { type: DataTypes.STRING },
    customer: { type: DataTypes.STRING }
});

module.exports = salesInvoice;