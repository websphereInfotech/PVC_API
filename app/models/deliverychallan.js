const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");

const deliverychallan = sequelize.define("P_deliverychallan", {
  challanno: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  customerId: { type: DataTypes.INTEGER,
    allowNull:false
   },
   totalQty: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
});

customer.hasMany(deliverychallan,{ foreignKey:'customerId', onDelete:'CASCADE',as:'DeliveryCustomer'});
deliverychallan.belongsTo(customer,{ foreignKey:'customerId', onDelete:'CASCADE', as:'DeliveryCustomer'});

module.exports = deliverychallan;
