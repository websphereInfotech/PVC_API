const { Sequelize } = require("sequelize");
const path = require('path');
const config = require(path.join(__dirname, '..', 'config', 'config.js'));

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  port: dbConfig.port,
  dialect: dbConfig.dialect,
  logging: false
});

module.exports = sequelize;
