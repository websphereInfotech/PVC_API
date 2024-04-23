const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');

const admintoken = sequelize.define("P_adminToken",{
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});


module.exports = admintoken;