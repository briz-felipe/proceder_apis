const db = require('../models');

exports.createUser = async (req, res) => {
    try {
           const { username, email, firstName, lastName, password } = req.body;
           const newUser = await db.User.create({ username, email, firstName, lastName, password });
           res.status(201).json(newUser);
       } catch (error) {
           res.status(500).json({ error: 'Erro ao criar usuário' });
       };
};

exports.isRoot = async (req,res) => {
    try{
        const {username} = req.params
        const rootUser = await db.User.findOne({
            where: { username: username, isActive: true }
        });
        const status = !rootUser ? false : true
        res.status(200).json({root:status})
    }catch (error ){
        res.status(500).json({ error: 'Erro ao consultar username' });
    }
}

exports.groups = async (req,res) => {
    try{
        const groups = await db.Group.findAll();
        res.status(200).json(groups)
    } catch (error) {
        res.status(500).json({ error: 'Erro ao consultar grupos' });
    };
};

exports.createGroup = async (req,res) => {
    try{
        const { name } = req.body;
        const newGroup = await db.Group.create({ name });
        res.status(201).json(newGroup);
    } catch (error) {
        const alert = error.parent.message;
        res.status(500).json({ error: alert });
    };
};

exports.companies = async (req,res) => {
    try{
        const companies = await db.Company.findAll();
        res.status(200).json(companies)
    } catch (error) {
        const alert = error.parent.message;
        res.status(500).json({ error: alert });
    };
};

exports.createCompany = async (req,res) => {
    try{
        const { cnpj,name } = req.body;
        const newCompany = await db.Company.create({ cnpj,name });
        res.status(201).json(newCompany);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar empresa' });
    };
}