const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const customer = require("./customer");

const salesReturn = sequelize.define("P_salesReturn", {
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  creditnote: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  creditdate: {
    type: DataTypes.DATE,
    allowNull: false,
  }
});

customer.hasMany(salesReturn, {foreignKey:'customerId', onDelete:'CASCADE', as:'SalesCustomer'});
salesReturn.belongsTo(customer, {foreignKey:'customerId', onDelete:'CASCADE', as:'SalesCustomer'});


module.exports = salesReturn;
