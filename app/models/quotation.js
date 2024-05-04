const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
// const moment = require('moment');

const quotation = sequelize.define("P_quotation", {
  quotation_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // date: {
  //   type: DataTypes.DATEONLY,
  //   set(value) {
  //     const formattedDate = moment(value, "DD-MM-YYYY").format("YYYY-MM-DD");
  //     this.setDataValue("date", formattedDate);
  //   },
  //   get() {
  //     const rawDate = this.getDataValue("date");
  //     return moment(rawDate).format("DD-MM-YYYY");
  //   },
  // },
  // validtill: {
  //   type: DataTypes.DATEONLY,
  //   set(value) {
  //     const formattedDate = moment(value, "DD-MM-YYYY").format("YYYY-MM-DD");
  //     this.setDataValue("validtill", formattedDate);
  //   },
  //   get() {
  //     const rawDate = this.getDataValue("validtill");
  //     return moment(rawDate).format("DD-MM-YYYY");
  //   },
  // },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  validtill: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  // email: DataTypes.STRING,
  // mobileno: DataTypes.BIGINT,
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
