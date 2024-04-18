const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const deliverychallan = require('./deliverychallan');

const deliverychallanitem = sequelize.define('deliverychallanItem', {
    serialno : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    mrp : {
        type : DataTypes.FLOAT,
        allowNull : false
    },
    qty : {
        type : DataTypes.INTEGER,
        allowNull :false
    },
    product : {
        type : DataTypes.STRING,
        allowNull : false
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false
    },
    batchno : {
        type : DataTypes.STRING,
        allowNull :false
    },
    quotationno : {
        type : DataTypes.INTEGER,
        allowNull :false
    },
    expirydate : {
        type : DataTypes.DATE,
        allowNull : false
    }
});

deliverychallan.hasMany(deliverychallanitem);
deliverychallanitem.belongsTo(deliverychallan);

module.exports = deliverychallanitem;