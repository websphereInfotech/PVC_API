const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const product = require("./product");
const Maintenance = require("./Maintenance");

const MaintenanceItem = sequelize.define("P_MaintenanceItem", {
  productId: { type: DataTypes.INTEGER },
  qty: { type: DataTypes.INTEGER },
});

product.hasMany(MaintenanceItem, {foreignKey:'productId',onDelete:'CASCADE',as:'maintenanceProduct'});
MaintenanceItem.belongsTo(product, {foreignKey:'productId', onDelete:'CASCADE', as:'maintenanceProduct'});

Maintenance.hasMany(MaintenanceItem, { foreignKey: "maintenanceId" ,onDelete:'CASCADE',as:'maintenanceItems'});
MaintenanceItem.belongsTo(Maintenance, { foreignKey: "maintenanceId",onDelete:'CASCADE', as:'maintenanceItems' });

module.exports = MaintenanceItem;
