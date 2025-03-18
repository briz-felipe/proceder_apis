require('dotenv').config();
const {sequelize,db} = require('../models/index');
const user = require('../models/tables/user');
const { generateRandomPassword } = require('./utils');

exports.createUser = async (req, res) => {
    try {
           const { username, email, firstName, lastName, password } = req.body;
           const newUser = await db.User.create({ username, email, firstName, lastName, password });
           res.status(201).json(newUser);
       } catch (error) {
        const alert = error.parent ? error.parent.message : error.message;
        res.status(500).json({ error: alert });
       };
};

exports.createAccess = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { username, email, firstName, lastName, groupName = [], companyName = [] } = req.body;
        const password = generateRandomPassword();

        // Cria o usuário
        const newUser = await db.User.create({ username, email, firstName, lastName, password }, { transaction });

        // Busca grupos e empresas (se houver)
        const [groups, companies] = await Promise.all([
            groupName.length ? db.Group.findAll({ where: { name: groupName } }, { transaction }) : [],
            companyName.length ? db. Company.findAll({ where: { name: companyName } }, { transaction }) : []
        ]);

        // Adiciona relações se existirem
        if (groups.length) await newUser.addGroups(groups, { transaction });
        if (companies.length) await newUser.addCompanies(companies, { transaction });

        // Confirma a transação
        await transaction.commit();

        res.status(201).json(newUser);
    } catch (error) {
        await transaction.rollback();
        const alert = error.parent ? error.parent.message : error.message;
        res.status(500).json({ error: alert });
    }
};

exports.groups = async (req,res) => {
    try{
        const groups = await db.Group.findAll({
            attributes: ['id', 'name', 'createdAt']
        });
        res.status(200).json(groups)
    } catch (error) {
        const alert = error.parent ? error.parent.message : error.message;
        res.status(500).json({ error: alert });
    };
};

exports.createGroup = async (req,res) => {
    try{
        const { name } = req.body;
        const newGroup = await db.Group.create({ name });
        res.status(201).json({
            "id":newGroup.id,
            "name":newGroup.name,
            "createdAt":newGroup.createdAt
        });
    } catch (error) {
        const alert = error.parent ? error.parent.message : error.message;
        res.status(500).json({ error: alert });
    };
};

exports.companies = async (req,res) => {
    try{
        const companies = await db.Company.findAll();
        res.status(200).json(companies)
    } catch (error) {
        const alert = error.parent ? error.parent.message : error.message;
        res.status(500).json({ error: alert });
    };
};

exports.getUsers = async (req, res) => {
    try {
        // Busca os usuários no banco de dados
        const users = await db.User.findAll({
            attributes: ['id', 'username', 'email', 'createdAt']
        });

        // Busca o grupo 'root'
        const group = await db.Group.findOne({
            where: { name: process.env.ROOT_NAME }
        });

        // Valida se o grupo foi encontrado
        if (!group) {
            return res.status(404).json({ error: "Grupo 'root' não encontrado." });
        }

        // Mapeia os usuários adicionando o campo 'isAdmin'
        const usersWithAdminStatus = await Promise.all(
            users.map(async (user) => {
                const isAdmin = await user.hasGroup(group.id);
                return {
                    ...user.toJSON(),
                    isAdmin
                };
            })
        );

        res.status(200).json(usersWithAdminStatus);
    } catch (error) {
        const alert = error.parent ? error.parent.message : error.message;
        res.status(500).json({ error: alert });
    }
};



exports.createCompany = async (req,res) => {
    try{
        const { cnpj,name } = req.body;
        const newCompany = await db.Company.create({ cnpj,name });
        res.status(201).json({
            "id":newCompany.id,
            "cnpj":newCompany.cnpj,
            "name":newCompany.name,
            "isActive":newCompany.isActive,
            "createdAt":newCompany.createdAt
        });
    } catch (error) {

        const alert = error.parent ? error.parent.message : error.message;
        res.status(500).json({ error: alert });
    };
}