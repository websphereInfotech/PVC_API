const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const company = require("./company");
const Account = require("./Account");

const salesInvoice = sequelize.define("P_salesInvoice", {
  dispatchno: {
    type: DataTypes.INTEGER,
  },
  deliverydate: {
    type: DataTypes.DATEONLY,
  },
  terms: {
    type: DataTypes.ENUM("Advance", "Immediate", "Terms"),
  },
  invoiceno: { type: DataTypes.INTEGER },
  invoicedate: { type: DataTypes.DATEONLY },
  termsOfDelivery: { type: DataTypes.STRING },
  proFormaNo: { type: DataTypes.STRING, allowNull: true },
  dispatchThrough: { type: DataTypes.STRING },
  destination: { type: DataTypes.STRING },
  LL_RR_no: { type: DataTypes.INTEGER },
  motorVehicleNo: { type: DataTypes.STRING },
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalIgst: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalSgst: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalMrp: { type: DataTypes.FLOAT, defaultValue: 0 },
  mainTotal: { type: DataTypes.FLOAT, defaultValue: 0 },
  totalQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  createdBy: {
    type: DataTypes.INTEGER,
  },
  updatedBy: { type: DataTypes.INTEGER },
  companyId: {type: DataTypes.INTEGER}
});

company.hasMany(salesInvoice,{foreignKey:"companyId", as:'companysalesinv'});
salesInvoice.belongsTo(company,{foreignKey:"companyId", as:'companysalesinv'});

User.hasMany(salesInvoice, { foreignKey: "createdBy", as: "createUser" });
salesInvoice.belongsTo(User, { foreignKey: "createdBy", as: "createUser" });

User.hasMany(salesInvoice, { foreignKey: "updatedBy", as: "updateUser" });
salesInvoice.belongsTo(User, { foreignKey: "updatedBy", as: "updateUser" });

Account.hasMany(salesInvoice, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountSaleInv",
});
salesInvoice.belongsTo(Account, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountSaleInv",
});

module.exports = salesInvoice;
