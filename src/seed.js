const {db} = require('./models');
require('dotenv').config(); // Carrega variáveis de ambiente do .env

const createRootUser = async () => {
    try {
        // Verifica se o usuário root já existe
        const rootUser = await db.User.findOne({
            where: { email: process.env.ROOT_EMAIL }
        });

        // Cria o grupo root (se não existir)
        const groupRoot = await createGroupName();

        if (!rootUser) {

            const newRootUser = await db.User.create({
                username: process.env.ROOT_USERNAME,
                email: process.env.ROOT_EMAIL,
                firstName: 'Root',
                lastName: 'Proceder',
                password: process.env.ROOT_PASSWORD,
                isActive: true
            });

            console.log('Usuário root criado com sucesso.');

            // Associa o usuário root ao grupo root
            await newRootUser.addGroup(groupRoot);
            console.log('Usuário root associado ao grupo root.');
        } else {
            console.log('Usuário root já existe.');

            // Verifica se a associação já existe
            const isAssociated = await rootUser.hasGroup(groupRoot);
            if (!isAssociated) {
                // Associa o usuário root ao grupo root
                await rootUser.addGroup(groupRoot);
                console.log('Usuário root associado ao grupo root.');
            } else {
                console.log('Usuário root já está associado ao grupo root.');
            }
        }
    } catch (error) {
        console.error('Erro ao criar usuário root:', error);
    }
};

const createGroupName = async () => {
    try {
        const rootName = process.env.ROOT_NAME;
        const groupUser = await db.Group.findOne({
            where: { name: rootName }
        });

        if (!groupUser) {
            const newGroup = await db.Group.create({
                name: rootName
            });
            console.log('Grupo root criado com sucesso.');
            return newGroup; // Retorna o grupo criado
        } else {
            console.log('Grupo root já existe.');
            return groupUser; // Retorna o grupo existente
        }
    } catch (error) {
        console.error('Erro ao criar grupo root:', error);
    }
};

module.exports = createRootUser;