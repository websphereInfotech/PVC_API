const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const User = require("./user");
const company = require("./company");

const C_claim = sequelize.define("P_C_claim", {
  fromUserId: { type: DataTypes.INTEGER },
  toUserId: { type: DataTypes.INTEGER },
  amount: { type: DataTypes.INTEGER },
  description: { type: DataTypes.STRING },
  isApproved: { type: DataTypes.BOOLEAN },
  purpose: {
    type: DataTypes.ENUM("Salary", "Advance", "Expense"),
  },
  companyId: { type: DataTypes.INTEGER },
});
company.hasMany(C_claim, { foreignKey: "companyId", onDelete: "CASCADE" });
C_claim.belongsTo(company, { foreignKey: "companyId", onDelete: "CASCADE" });

User.hasMany(C_claim, {
  foreignKey: "fromUserId",
  onDelete: "CASCADE",
  as: "fromUser",
});
C_claim.belongsTo(User, {
  foreignKey: "fromUserId",
  onDelete: "CASCADE",
  as: "fromUser",
});

User.hasMany(C_claim, {
  foreignKey: "toUserId",
  onDelete: "CASCADE",
  as: "toUser",
});
C_claim.belongsTo(User, {
  foreignKey: "toUserId",
  onDelete: "CASCADE",
  as: "toUser",
});

module.exports = C_claim;
