const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");

const salesInvoice = sequelize.define("P_salesInvoice", {
  book: {
    type: DataTypes.STRING,
  },
  seriesname: {
    type: DataTypes.STRING,
  },
  invoiceno: { type: DataTypes.STRING },
  invoicedate: { type: DataTypes.DATE },
  terms: { type: DataTypes.INTEGER },
  duedate: { type: DataTypes.DATE },
  ProFormaInvoice_no: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  mobileno: { type: DataTypes.BIGINT },
  customerId: { type: DataTypes.INTEGER,
    allowNull:false,
    // references : {
    //   model:"P_customer",
    //   key:'id'
    // },
   },
  totalIgst: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalSgst: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalMrp: { type: DataTypes.FLOAT, defaultValue: 0 },
  mainTotal: { type: DataTypes.FLOAT, defaultValue: 0 },
});

customer.hasMany(salesInvoice, {foreignKey:'customerId', onDelete:'CASCADE', as:'InvioceCustomer'});
salesInvoice.belongsTo(customer, {foreignKey:'customerId', onDelete:'CASCADE', as:'InvioceCustomer'});

module.exports = salesInvoice;
