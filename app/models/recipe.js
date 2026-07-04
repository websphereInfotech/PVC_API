const { DataTypes } = require("sequelize");
const sequelize = require("../config/index");
const Company = require("./company");
const User = require("./user");

const Recipe = sequelize.define('Recipe', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    total_usage: { type: DataTypes.FLOAT },
    total_amount: { type: DataTypes.FLOAT },
    per_kg_value: { type: DataTypes.FLOAT },
    production_cost: { type: DataTypes.FLOAT, defaultValue: 0 },
    final_value: { type: DataTypes.FLOAT },
    items: { type: DataTypes.JSON },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    updatedBy: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.INTEGER },
}, {
    tableName: 'recipes',
    timestamps: true,
});

Recipe.belongsTo(Company, { foreignKey: 'companyId' });
Recipe.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });
Recipe.belongsTo(User, { as: 'updater', foreignKey: 'updatedBy' });

module.exports = Recipe;
