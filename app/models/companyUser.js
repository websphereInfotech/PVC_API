const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const company = require("./company");

const companyUser = sequelize.define("P_companyUser", {
  userId: { type: DataTypes.INTEGER },
  companyId: { type: DataTypes.INTEGER },
  setDefault: { type: DataTypes.BOOLEAN ,
    defaultValue:true
  },
});

// User.hasMany(companyUser,{foreignKey:'userId',onDelete:'CASCADE'});
// companyUser.belongsTo(User,{foreignKey:'userId', onDelete:'CASCADE'});

// company.hasMany(companyUser, { foreignKey: "companyId", onDelete: "CASCADE" });
// companyUser.belongsTo(company, {
//   foreignKey: "companyId",
//   onDelete: "CASCADE",
// });

User.belongsToMany(company, { through: "P_companyUser", foreignKey: 'userId', as: "companies" });
company.belongsToMany(User, { through: "P_companyUser", foreignKey: 'companyId', as: "users" });


module.exports = companyUser;
