const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');

const C_product = sequelize.define('P_C_product', {
    productname : {type : DataTypes.STRING}
})

module.exports = C_product;