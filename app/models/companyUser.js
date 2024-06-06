const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const company = require("./company");

const companyUser = sequelize.define("P_companyUser", {
  userId: { type: DataTypes.INTEGER },
  companyId: { type: DataTypes.INTEGER },
  setDefault: { type: DataTypes.BOOLEAN ,
    defaultValue:false
  },
});

companyUser.belongsTo(User, { foreignKey: 'userId', as: 'users' });
companyUser.belongsTo(company, { foreignKey: 'companyId', as: 'companies' });

User.belongsToMany(company, { through: "P_companyUser", foreignKey: 'userId', as: "companies" });
company.belongsToMany(User, { through: "P_companyUser", foreignKey: 'companyId', as: "users" });

module.exports = companyUser;
