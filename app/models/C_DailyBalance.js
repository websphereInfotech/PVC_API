const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const company = require("./company");

const DailyBalance = sequelize.define("P_C_DailyBalance", {
    date: {
        type: DataTypes.DATEONLY, // Stores only YYYY-MM-DD
        allowNull: false,
    },
    openingBalance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    totalDebit: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    totalCredit: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    closingBalance: {
        type: DataTypes.DECIMAL(20, 2),
        allowNull: false,
        defaultValue: 0.00
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    indexes: [
        {
            unique: true,
            fields: ['date', 'companyId']
        }
    ]
});

// Relationships
company.hasMany(DailyBalance, { foreignKey: 'companyId', onDelete: 'CASCADE' });
DailyBalance.belongsTo(company, { foreignKey: 'companyId', onDelete: 'CASCADE' });

module.exports = DailyBalance;