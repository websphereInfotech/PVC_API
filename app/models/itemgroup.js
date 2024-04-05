const { DataTypes } = require('sequelize');
const sequelize = require('../../config/index');
const product = require('./product');

const itemgroup = sequelize.define("itemgroup", {
    group : {
        type : DataTypes.STRING,
    },
    remarks : {
        type : DataTypes.STRING
    }
});

product.hasMany(itemgroup);
itemgroup.belongsTo(product);

module.exports = itemgroup;
