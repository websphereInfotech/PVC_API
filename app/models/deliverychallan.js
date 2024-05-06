const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const deliverychallan = sequelize.define("P_deliverychallan", {
  challanno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  email: { type: DataTypes.STRING },
  mobileno: { type: DataTypes.BIGINT },
  customer: { type: DataTypes.STRING },
  totalIgst: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalSgst: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  totalMrp: { 
    type: DataTypes.FLOAT,
     defaultValue: 0 
    },
  mainTotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

module.exports = deliverychallan;
