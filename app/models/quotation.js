const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const quotation = sequelize.define("P_quotation", {
  quotation_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  validtill: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  email: DataTypes.STRING,
  mobileno: DataTypes.BIGINT,
  customer: DataTypes.STRING,
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
    defaultValue: 0,
  },
  mainTotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

module.exports = quotation;
