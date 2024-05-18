const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_customer = require('./C_customer');

const C_receiveCash = sequelize.define('P_C_receiveCash', {
    customerId:{ type: DataTypes.INTEGER},
    amount: {type: DataTypes.INTEGER},
    description : {type: DataTypes.STRING,
        validate:{
            len:[0,20]
        }
    },
    date: {type: DataTypes.DATEONLY}
});

C_customer.hasMany(C_receiveCash, {foreignKey:'customerId',onDelete:'CASCADE', as:'ReceiveCustomer'});
C_receiveCash.belongsTo(C_customer, {foreignKey:'customerId', onDelete:'CASCADE', as:'ReceiveCustomer'});


module.exports = C_receiveCash;