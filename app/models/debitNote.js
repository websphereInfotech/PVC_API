const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");

const debitNote = sequelize.define("P_debitNote", {
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  debitnoteno: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
  debitdate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
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
    defaultValue:0
  },
});

customer.hasMany(debitNote, {foreignKey:'customerId', onDelete:'CASCADE', as:'DebitCustomer'});
debitNote.belongsTo(customer, {foreignKey:'customerId', onDelete:'CASCADE', as:'DebitCustomer'});


module.exports = debitNote;
