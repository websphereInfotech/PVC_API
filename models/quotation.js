const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const quotation = sequelize.define("quotation",{
    quotationno : {
        type : DataTypes.STRING,
        allowNull : false
    },
    date : {
        type :DataTypes.DATE,
        allowNull : false
    },
    validtill : {
        type : DataTypes.DATE,
        allowNull : false
    },
    email : DataTypes.STRING,
    mobileno : DataTypes.STRING,
    customer : DataTypes.STRING
});


module.exports = quotation;