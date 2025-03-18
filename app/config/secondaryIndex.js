const { Sequelize } = require("sequelize");
const { config } = require("dotenv");
config();
const { SECONDARY_DB_USERNAME, SECONDARY_DB_NAME, SECONDARY_DB_PASSWORD, SECONDARY_DB_HOST } = process.env;

const sequelize = new Sequelize({
  database: SECONDARY_DB_NAME,
  username: SECONDARY_DB_USERNAME,
  password: SECONDARY_DB_PASSWORD,
  host: SECONDARY_DB_HOST,
  dialect: 'mysql',
  logging: true
});

try {
  sequelize.authenticate();
  sequelize.sync({alter: false});
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
  // process.exit(1);
}

module.exports = sequelize;