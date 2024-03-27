const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const purchase = sequelize.define("purchase",{
    quotationno : {
        type : DataTypes.STRING,
        allowNull : false
    },
    date : {
        type :DataTypes.DATE,
        allowNull : false
    },
    email : {type:DataTypes.STRING},
    mobileno : {type:DataTypes.STRING},
    quotationref : {type:DataTypes.STRING},
    pono : {type:DataTypes.STRING},
    vendor : {type:DataTypes.STRING}
});


module.exports = purchase;