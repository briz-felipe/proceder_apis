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

