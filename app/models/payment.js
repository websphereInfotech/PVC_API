const { DataTypes } = require('sequelize');
const sequelize = require('../../config/index');

const payment = sequelize.define("payment",{
    voucherno : {type:DataTypes.STRING},
    account : {type:DataTypes.STRING},
    email : {type:DataTypes.STRING},
    paymentdate : {
        type :DataTypes.DATE,
    },
    mode : {type:DataTypes.STRING},
    refno : {type:DataTypes.STRING},
    paidfrom : {type:DataTypes.STRING},
    amount : {type:DataTypes.STRING},
    billno : {
        type : DataTypes.STRING,
    },
    billfromdate : {
        type :DataTypes.DATE,
    },
    billtodate : {
        type :DataTypes.DATE,
    },
});


module.exports = payment;