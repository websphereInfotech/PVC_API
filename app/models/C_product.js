const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');

const C_product = sequelize.define('P_C_product', {
    productname : {type : DataTypes.STRING},
    companyId: {type: DataTypes.INTEGER}
})

module.exports = C_product;