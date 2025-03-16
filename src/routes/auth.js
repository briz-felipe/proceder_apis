const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {db} = require('../models');

const router = express.Router();
const secretKey = 'p4pQVFDsuAHvJkHMUBWvim5OIzf479mOfLLoPx2y9eJWc5sdeXBpDdoQYH1CBTsv';

// Rota para autenticar um usuário e retornar um token JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await db.User.findOne({ where: { username: username } });
    
        if (user) {
            // Validate the password
            const isPasswordValid = await bcrypt.compare(password, user.password);
    
            if (isPasswordValid) {
                // Generate JWT token
                const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    
                // Encode the email in Base64
                const encodedEmail = Buffer.from(user.email).toString('base64');
    
                // Return the token, username, and encoded email
                res.status(200).json({
                    token,
                    username: user.username,
                    email: encodedEmail // Base64-encoded email
                });
            } else {
                res.status(401).json({ error: 'Senha inválida' });
            }
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro durante o login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
    // try {
    //     const { username, password } = req.body;
    //     const user = await db.User.findOne({ where: { username: username } });
    //     if (user) {
    //         const isPasswordValid = await bcrypt.compare(password, user.password);
    //         if (isPasswordValid) {
    //             const token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' });
    //             res.status(200).json({ token });
    //         } else {
    //             res.status(401).json({ error: 'Senha inválida' });
    //         }
    //     } else {
    //         res.status(404).json({ error: 'Usuário não encontrado' });
    //     }
    // } catch (error) {
    //     res.status(500).json({ error: 'Erro ao autenticar usuário' });
    // }
});

router.post('/validate-token', (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ valid: false });
        }
        res.json({ valid: true });
    });
});

// Rota para logout
router.post('/logout', (req, res) => {
    // Invalidate the token on the client side by removing it from localStorage
    res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;