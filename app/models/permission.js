
const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const permissions = sequelize.define("P_permissions", {
  role: { type: DataTypes.STRING },
  resource: { type: DataTypes.STRING },
  permissionValue: { type: DataTypes.BOOLEAN },
  permission: {
    type: DataTypes.STRING,
  },
  type: {type: DataTypes.STRING}
});
module.exports = permissions;