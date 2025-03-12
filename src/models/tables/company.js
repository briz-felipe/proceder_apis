const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('Company', {
        cnpj: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        isActive: {
            type: DataTypes.BOOLEAN, 
            allowNull: false,
            defaultValue: true
        }
    }, {
        timestamps: true
    });

    return Company;
};