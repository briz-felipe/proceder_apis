const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models');

const router = express.Router();
const secretKey = 'p4pQVFDsuAHvJkHMUBWvim5OIzf479mOfLLoPx2y9eJWc5sdeXBpDdoQYH1CBTsv';

// Rota para autenticar um usuário e retornar um token JWT
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        const user = await db.User.findOne({ where: { username: username } });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
                res.status(200).json({ token });
            } else {
                res.status(401).json({ error: 'Senha inválida' });
            }
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao autenticar usuário' });
    }
});

module.exports = router;