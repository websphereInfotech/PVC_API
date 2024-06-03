// const {DataTypes} = require('sequelize');
// const sequelize = require('../config/index');
// const User = require('./user');
// const company = require('./company');


// const C_userBalance = sequelize.define('P_C_userBalance',{
//     userId: {type: DataTypes.INTEGER,
//         allowNull:false
//     },
//     companyId : {type: DataTypes.INTEGER,
//         allowNull:false
//     },
//     balance : {type : DataTypes.INTEGER,
//         allowNull:false,
//         defaultValue:0
//     }
// });

// User.hasMany(C_userBalance, {foreignKey:'userId', onDelete:'CASCADE'});
// C_userBalance.belongsTo(User,{foreignKey:'userId', onDelete:'CASCADE'});

// company.hasMany(C_userBalance ,{foreignKey:'companyId', onDelete:'CASCADE'});
// C_userBalance.belongsTo(company, {foreignKey:'companyId', onDelete:'CASCADE'});

// module.exports = C_userBalance;
