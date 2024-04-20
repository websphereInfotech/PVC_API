const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const product = require('./product');

const unit = sequelize.define("P_unit", {
    shortname : {
        type : DataTypes.STRING,
    },
    unitname : {
        type : DataTypes.STRING
    }
});

product.hasMany(unit);
unit.belongsTo(product);

module.exports = unit;
