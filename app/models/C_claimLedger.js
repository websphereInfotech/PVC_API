const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const C_receiveCash = require("./C_receiveCash");
const C_claim = require("./C_claim");
const User = require("./user");
const company = require("./company");

const C_claimLedger = sequelize.define("P_C_claimLedger", {
  receiveId: { type: DataTypes.INTEGER },
  claimId: { type: DataTypes.INTEGER },
  userId: { type: DataTypes.INTEGER },
  date: { type: DataTypes.DATEONLY },
  companyId: {type: DataTypes.INTEGER}
});

company.hasMany(C_claimLedger,{foreignKey:'companyId', onDelete:'CASCADE'});
C_claimLedger.belongsTo(company,{foreignKey:'companyId', onDelete:'CASCADE'});

C_receiveCash.hasMany(C_claimLedger, { foreignKey: "receiveId" ,onDelete:'CASCADE',as:'claimLedger'});
C_claimLedger.belongsTo(C_receiveCash, { foreignKey: "receiveId",onDelete:'CASCADE',as:'claimLedger' });

C_claim.hasMany(C_claimLedger, { foreignKey: "claimId",onDelete:'CASCADE',as:'claimData' });
C_claimLedger.belongsTo(C_claim, { foreignKey: "claimId",onDelete:'CASCADE',as:'claimData' });

User.hasMany(C_claimLedger, { foreignKey: "userId",as:'claimUser' });
C_claimLedger.belongsTo(User, { foreignKey: "userId",as:'claimUser' });

module.exports = C_claimLedger;
