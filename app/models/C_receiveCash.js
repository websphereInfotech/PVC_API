const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_customer = require('./C_customer');
const User = require('./user');
const company = require('./company');

const C_receiveCash = sequelize.define('P_C_receiveCash', {
    customerId:{ type: DataTypes.INTEGER},
    amount: {type: DataTypes.INTEGER},
    description : {type: DataTypes.STRING,
        validate:{
            len:[0,20]
        }
    },
    date: {type: DataTypes.DATEONLY},
    createdBy:{type: DataTypes.INTEGER},
    updatedBy:{type:DataTypes.INTEGER},
    companyId: {type: DataTypes.INTEGER}
});

company.hasMany(C_receiveCash,{foreignKey:'companyId',onDelete:'CASCADE'});
C_receiveCash.belongsTo(company,{foreignKey:'companyId',onDelete:'CASCADE'});

User.hasMany(C_receiveCash,{foreignKey:'createdBy', as:'receiveCreate'});
C_receiveCash.belongsTo(User,{foreignKey:'createdBy', as:'receiveCreate'});

User.hasMany(C_receiveCash,{foreignKey:'updatedBy', as:'receiveUpdate'});
C_receiveCash.belongsTo(User,{foreignKey:'updatedBy', as:'receiveUpdate'});

C_customer.hasMany(C_receiveCash, {foreignKey:'customerId',onDelete:'CASCADE', as:'ReceiveCustomer'});
C_receiveCash.belongsTo(C_customer, {foreignKey:'customerId', onDelete:'CASCADE', as:'ReceiveCustomer'});


module.exports = C_receiveCash;