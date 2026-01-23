const { Sequelize } = require("sequelize");
const { config } = require("dotenv");
config();
const { DB_USERNAME, DB_NAME, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize({
  database: DB_NAME,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  host: DB_HOST,
  dialect: 'mysql',
  logging: false
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