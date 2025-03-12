module.exports = (sequelize, DataTypes) => {
    const UserCompany = sequelize.define('UserCompany', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        companyId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Company', 
                key: 'id'
            }
        }
    }, {
        timestamps: false
    });

    return UserCompany;
};