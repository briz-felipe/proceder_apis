const express = require('express');
const { listDir } = require('../controllers/sftpController');
const db = require('../models');

const router = express.Router();

router.get('/listdir', listDir);

router.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

// Rota para criar um novo usuário
router.post('/users', async (req, res) => {
    try {
        const { username, email, firstName, lastName, password } = req.body;
        const newUser = await db.User.create({ username, email, firstName, lastName, password });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Rota para obter um usuário pelo email
router.get('/users/:email', async (req, res) => {
    try {
        const user = await db.User.findOne({ where: { email: req.params.email } });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

module.exports = router;