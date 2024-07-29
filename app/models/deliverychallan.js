const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Account = require("./Account");
const User = require("./user");

const deliverychallan = sequelize.define("P_deliverychallan", {
  challanno: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  accountId: { type: DataTypes.INTEGER,
    allowNull:false
   },
   totalQty: {
    type: DataTypes.INTEGER,
    defaultValue:0
  },
    updatedBy: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.INTEGER }
});

Account.hasMany(deliverychallan,{ foreignKey:'accountId', onDelete:'CASCADE',as:'accountDelivery'});
deliverychallan.belongsTo(Account,{ foreignKey:'accountId', onDelete:'CASCADE', as:'accountDelivery'});

User.hasMany(deliverychallan, { foreignKey: "updatedBy", as: "challanUpdateUser" });
deliverychallan.belongsTo(User, { foreignKey: "updatedBy", as: "challanUpdateUser" });

User.hasMany(deliverychallan, { foreignKey: "createdBy", as: "challanCreateUser" });
deliverychallan.belongsTo(User, { foreignKey: "createdBy", as: "challanCreateUser" });

module.exports = deliverychallan;
