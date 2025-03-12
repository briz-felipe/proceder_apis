module.exports = (sequelize, DataTypes) => {
    const Group = sequelize.define('Group', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        timestamps: true,
    });

    // Associação Many-to-Many com User
    Group.associate = (models) => {
        Group.belongsToMany(models.User, {
            through: 'UserGroup', // Nome da tabela de associação
            foreignKey: 'groupId', // Chave estrangeira em UserGroup que referencia Group
            otherKey: 'userId' // Chave estrangeira em UserGroup que referencia User
        });
    };

    return Group;
};