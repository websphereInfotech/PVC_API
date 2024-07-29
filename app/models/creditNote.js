const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const Account = require("./Account");

const creditNote = sequelize.define("P_creditNote", {
  accountId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  creditnoteNo: {
    type: DataTypes.INTEGER,
  },
  creditdate: {
    type: DataTypes.DATEONLY,
  },
  org_invoiceno: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  org_invoicedate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  LL_RR_no: {
    type: DataTypes.INTEGER,
  },
  dispatchThrough: { type: DataTypes.STRING },
  motorVehicleNo: { type: DataTypes.STRING },
  destination: { type: DataTypes.STRING },
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
  totalQty: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  companyId: { type: DataTypes.INTEGER },
  createdBy: { type: DataTypes.INTEGER },
  updatedBy: { type: DataTypes.INTEGER },
});

User.hasMany(creditNote, { foreignKey: "createdBy", as: "creditCreateUser" });
creditNote.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creditCreateUser",
});

User.hasMany(creditNote, { foreignKey: "updatedBy", as: "creditUpdateUser" });
creditNote.belongsTo(User, {
  foreignKey: "updatedBy",
  as: "creditUpdateUser",
});

Account.hasMany(creditNote, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountCreditNo",
});
creditNote.belongsTo(Account, {
  foreignKey: "accountId",
  onDelete: "CASCADE",
  as: "accountCreditNo",
});

module.exports = creditNote;
