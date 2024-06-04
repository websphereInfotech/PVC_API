const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");

const vendor = sequelize.define("P_vendor", {
  accountname: {
    type: DataTypes.STRING,
  },
  shortname: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  contactpersonname: {
    type: DataTypes.STRING,
  },
  mobileno: {
    type: DataTypes.BIGINT,
  },
  panno: {
    type: DataTypes.INTEGER,
  },
  creditperiod: {
    type: DataTypes.INTEGER,
  },
  address1: {
    type: DataTypes.STRING,
  },
  address2: {
    type: DataTypes.STRING,
  },
  pincode: {
    type: DataTypes.INTEGER,
  },
  state: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  bankdetail: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  creditlimit: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  balance: {
    type: DataTypes.INTEGER,
  },
  gstnumber : {
    type: DataTypes.STRING,
  },
  totalcreadit : {
    type : DataTypes.BIGINT,
    defaultValue:0
  },
  companyId: {type: DataTypes.INTEGER}
});

company.hasMany(vendor, {foreignKey:'companyId',onDelete:'CASCADE'});
vendor.belongsTo(company, {foreignKey:'companyId',onDelete:'CASCADE'});

module.exports = vendor;
