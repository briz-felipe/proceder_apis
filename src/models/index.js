require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Carregar modelos
db.User = require('./tables/user')(sequelize, DataTypes);
db.Group = require('./tables/group')(sequelize, DataTypes);
db.UserGroup = require('./tables/userGroup')(sequelize, DataTypes);
db.Company = require('./tables/company')(sequelize, DataTypes);

// Define as associações
db.User.associate(db);
db.Group.associate(db);

module.exports = db;
