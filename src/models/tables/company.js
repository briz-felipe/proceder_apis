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

    Company.associate = (models) => {
        // Associação Many-to-Many com User
        Company.belongsToMany(models.User, {
            through: 'UserCompany', // Nome da tabela de associação
            foreignKey: 'companyId', // Chave estrangeira em UserCompany que referencia Company
            otherKey: 'userId' // Chave estrangeira em UserCompany que referencia User
        });
    };

    return Company;
};