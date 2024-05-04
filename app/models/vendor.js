const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

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
  mode: {
    type: DataTypes.STRING,
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
  country: {
    type: DataTypes.STRING,
  },
  gstnumber : {
    type: DataTypes.STRING,
  }
});

module.exports = vendor;
