const { DataTypes } = require('sequelize');
const sequelize = require('../../config/index');

const stock = sequelize.define("stock",{
    itemname : {type:DataTypes.STRING},
    unit : {type:DataTypes.STRING},
    email : {type:DataTypes.STRING},
    compustk : {
        type :DataTypes.STRING,
    },
    betchno : {type:DataTypes.STRING},
    physicalstk : {type:DataTypes.STRING},
    adjqty : {type:DataTypes.STRING},
    adjustcomment : {type:DataTypes.STRING},
    wastageqty : {
        type : DataTypes.STRING,
    },
    wastagecomment : {
        type :DataTypes.STRING,
    },
    consumeqty : {
        type :DataTypes.STRING,
    },
    consumecomment : {
        type :DataTypes.STRING,
    },
});

module.exports = stock;