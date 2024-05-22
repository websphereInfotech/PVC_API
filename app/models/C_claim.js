const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');
const C_customer = require('./C_customer');

const C_claim = sequelize.define('P_C_claim',{
    fromUserId: { type : DataTypes.INTEGER},
    toUserId : { type : DataTypes.INTEGER},
    amount : { type: DataTypes.INTEGER},
    description : { type: DataTypes.STRING},
    isApproved : { type: DataTypes.BOOLEAN}
});

C_claim.belongsTo(C_customer, { foreignKey: 'fromUserId', as: 'fromUser' });
C_claim.belongsTo(C_customer, { foreignKey: 'toUserId', as: 'toUser' });

module.exports = C_claim;