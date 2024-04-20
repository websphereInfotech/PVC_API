// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class permissioncash extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   permissioncash.init({
//     role: DataTypes.STRING,
//     resource: DataTypes.STRING,
//     permissionValue: DataTypes.BOOLEAN,
//     permission: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'permissioncash',
//   });
//   return permissioncash;
// };
const { DataTypes } = require('sequelize');
const sequelize = require('../config/index');

const permissioncash = sequelize.define("P_permissioncashes",{
  role : {type:DataTypes.STRING},
  resource : {type:DataTypes.STRING},
  permissionValue : {type:DataTypes.BOOLEAN},
  permission : {
        type :DataTypes.DATE,
    },
});


module.exports = permissioncash;