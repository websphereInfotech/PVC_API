const {DataTypes} = require('sequelize');
const sequelize = require('../config/index');

const C_claim = sequelize.define('P_C_claim',{
    fromUserId: { type : DataTypes.INTEGER},
    toUserId : { type : DataTypes.INTEGER},
    amount : { type: DataTypes.INTEGER},
    description : { type: DataTypes.STRING},
    isApproved : { type: DataTypes.BOOLEAN}
});

module.exports = C_claim;