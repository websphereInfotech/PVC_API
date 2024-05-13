const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const company = sequelize.define('P_company', {
  companyname: { type: DataTypes.STRING },
  gstnumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  mobileno: { type: DataTypes.BIGINT },
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
  country: {
    type: DataTypes.STRING,
  },
  accountname: { type: DataTypes.STRING },
  bankname: { type: DataTypes.STRING },
  accountnumber: { type: DataTypes.STRING },
  ifsccode: { type: DataTypes.STRING },
  branch: { type: DataTypes.STRING }
});

module.exports = company;