const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const deliverychallan = sequelize.define("deliverychallan",{
    challanno : {
        type : DataTypes.STRING,
        allowNull : false
    },
    date : {
        type :DataTypes.DATE,
        allowNull : false
    },
    email : DataTypes.STRING,
    mobileno : DataTypes.STRING,
    customer : DataTypes.STRING
});


module.exports = deliverychallan;