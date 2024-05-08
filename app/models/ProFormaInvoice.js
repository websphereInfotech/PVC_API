const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");
// const moment = require('moment');
const ProFormaInvoice = sequelize.define("P_ProFormaInvoice", {
  ProFormaInvoice_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE
  },
  validtill: {
    type: DataTypes.DATE
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
  customerId:{  
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'P_customer', 
      key: 'id',
    },},
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

customer.hasOne(ProFormaInvoice,{foreignKey:'customerId', onDelete:"CASCADE", as:'customer'});
ProFormaInvoice.belongsTo(customer,{foreignKey:'customerId', onDelete:'CASCADE', as:'customer'});

module.exports = ProFormaInvoice;
