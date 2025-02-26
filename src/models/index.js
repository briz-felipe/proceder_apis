const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('proceder', 'brizfelipe', 'XH2wYnE*', {
    host: 'localhost',
    dialect: 'postgres' // ou 'postgres', 'sqlite', 'mariadb', 'mssql'
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Carregar modelos
db.User = require('./user')(sequelize, DataTypes);

module.exports = db;
