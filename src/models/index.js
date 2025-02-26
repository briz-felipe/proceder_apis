require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT // ou 'postgres', 'sqlite', 'mariadb', 'mssql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Carregar modelos
db.User = require('./user')(sequelize, DataTypes);

module.exports = db;
