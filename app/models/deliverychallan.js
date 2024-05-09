const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");

const deliverychallan = sequelize.define("P_deliverychallan", {
  challanno: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  email: { type: DataTypes.STRING },
  mobileno: { type: DataTypes.BIGINT },
  customerId: { type: DataTypes.INTEGER,
    allowNull:false
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
     defaultValue: 0 
    },
  mainTotal: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
});

customer.hasMany(deliverychallan,{ foreignKey:'customerId', onDelete:'CASCADE',as:'DeliveryCustomer'});
deliverychallan.belongsTo(customer,{ foreignKey:'customerId', onDelete:'CASCADE', as:'DeliveryCustomer'});

module.exports = deliverychallan;
