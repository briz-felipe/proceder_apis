const express = require('express');
const db = require('../models');

const router = express.Router();



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

module.exports = router;



