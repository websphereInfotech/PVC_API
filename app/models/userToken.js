const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const User = require('./user')

const userToken = sequelize.define("userToken",{
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

userToken.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = userToken;