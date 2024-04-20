const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const admin = require('./admin');

const admintoken = sequelize.define("P_adminToken",{
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

admintoken.belongsTo(admin, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = admintoken;