const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');
const customer = require('./customer');

const customfeild = sequelize.define("P_customfeild", {
    label: {
        type: DataTypes.STRING,
    },
    value: {
        type: DataTypes.STRING,
    },
});

customer.hasMany(customfeild);
customfeild.belongsTo(customer);

module.exports = customfeild;