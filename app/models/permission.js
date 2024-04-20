// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class permission extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   permission.init({
//     role: DataTypes.STRING,
//     resource: DataTypes.STRING,
//     permissionValue: DataTypes.BOOLEAN,
//     permission: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'permission',
//   });
//   return permission;
// };
const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const permissions = sequelize.define("P_permissions",{
    role : {type:DataTypes.STRING},
    resource : {type:DataTypes.STRING},
    permissionValue : {type:DataTypes.BOOLEAN},
    permission : {
        type :DataTypes.STRING,
    },
});


module.exports = permissions;