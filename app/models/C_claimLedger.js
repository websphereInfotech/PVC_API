const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const C_receiveCash = require("./C_receiveCash");
const C_claim = require("./C_claim");
const User = require("./user");

const C_claimLedger = sequelize.define("P_C_claimLedger", {
  receiveId: { type: DataTypes.INTEGER },
  claimId: { type: DataTypes.INTEGER },
  userId: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATEONLY },
});

C_receiveCash.hasMany(C_claimLedger, { foreignKey: "receiveId" ,onDelete:'CASCADE',as:'claimRE'});
C_claimLedger.belongsTo(C_receiveCash, { foreignKey: "receiveId",onDelete:'CASCADE' });

C_claim.hasMany(C_claimLedger, { foreignKey: "claimId",onDelete:'CASCADE' });
C_claimLedger.belongsTo(C_claim, { foreignKey: "claimId",onDelete:'CASCADE' });

User.hasMany(C_claimLedger, { foreignKey: "userId" });
C_claimLedger.belongsTo(User, { foreignKey: "userId" });

module.exports = C_claimLedger;
