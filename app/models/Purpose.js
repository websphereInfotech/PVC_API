const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");
const User = require("./user");

const C_Purpose = sequelize.define("P_C_Purpose", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  updatedBy: { type: DataTypes.INTEGER },
  createdBy: { type: DataTypes.INTEGER },
});

company.hasMany(C_Purpose, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
  as: "companyPurpose",
});
C_Purpose.belongsTo(company, {
  foreignKey: "companyId",
  onDelete: "CASCADE",
  as: "companyPurpose",
});

User.hasMany(C_Purpose, { foreignKey: "updatedBy", as: "purposeUpdateUser" });
C_Purpose.belongsTo(User, { foreignKey: "updatedBy", as: "purposeUpdateUser" });

User.hasMany(C_Purpose, { foreignKey: "createdBy", as: "purposeCreateUser" });
C_Purpose.belongsTo(User, { foreignKey: "createdBy", as: "purposeCreateUser" });

module.exports = C_Purpose;
