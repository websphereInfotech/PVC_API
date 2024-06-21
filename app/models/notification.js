const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const Notification = sequelize.define("P_Notification", {
    notification: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyId: {type: DataTypes.INTEGER, allowNull: false},
});

company.hasMany(Notification,{foreignKey:"companyId", as:'companyNotification'});
Notification.belongsTo(company,{foreignKey:"companyId", as:'companyNotification'});


module.exports = Notification;
