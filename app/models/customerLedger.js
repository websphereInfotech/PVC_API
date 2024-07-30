const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");
const salesInvoice = require("./salesInvoice");
const receiveBank = require("./Receipt");
const company = require("./company");

const customerLedger = sequelize.define("P_customerLedger", {
  customerId: { type: DataTypes.INTEGER },
  creditId: { type: DataTypes.INTEGER },
  debitId: { type: DataTypes.INTEGER },
  companyId: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATEONLY },
});

company.hasMany(customerLedger,{foreignKey:"companyId",onDelete:"CASCADE",as:"companycustomerdata"});
customerLedger.belongsTo(company,{foreignKey:"companyId",onDelete:"CASCADE",as:"companycustomerdata"});

customer.hasMany(customerLedger, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
  as: "customerData",
});
customerLedger.belongsTo(customer, {
  foreignKey: "customerId",
  onDelete: "CASCADE",
  as: "customerData",
});

salesInvoice.hasMany(customerLedger, {
  foreignKey: "creditId",
  onDelete: "CASCADE",
  as: "invoiceCustomer",
});
customerLedger.belongsTo(salesInvoice, {
  foreignKey: "creditId",
  onDelete: "CASCADE",
  as: "invoiceCustomer",
});

receiveBank.hasMany(customerLedger, {
  foreignKey: "debitId",
  onDelete: "CASCADE",
  as: "receiveCustomer",
});
customerLedger.belongsTo(receiveBank, {
  foreignKey: "debitId",
  onDelete: "CASCADE",
  as: "receiveCustomer",
});

module.exports = customerLedger;
