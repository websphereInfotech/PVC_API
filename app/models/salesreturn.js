const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");

const salesReturn = sequelize.define("P_salesReturn", {
  customer: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creditnote: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creditdate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  sr_no: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  batch_no: {
    type: DataTypes.STRING,
  },
  expiry_date: {
    type: DataTypes.DATE,
  },
  amount: {
    type: DataTypes.FLOAT,
  },
  invoiceno: {
    type: DataTypes.INTEGER,
  },
  invoicedate: {
    type: DataTypes.DATE,
  },
  quantity: {
    //qty
    type: DataTypes.INTEGER,
  },
});

module.exports = salesReturn;
