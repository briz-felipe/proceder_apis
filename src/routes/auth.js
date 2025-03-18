require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {db} = require('../models');

const router = express.Router();
const secretKey = process.env.SECRET_KEY_JWT;

// Rota para autenticar um usuário e retornar um token JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar o usuário com campos específicos
        const user = await db.User.findOne({
            where: { username },
            attributes: ['id', 'username', 'password', 'email']
        });

        const group = await db.Group.findOne({
            where: { name: process.env.ROOT_NAME }
        })
        const isRoot = !group ? false : await user.hasGroup(group);


        if (!user) {
            return res.status(404).json({ error: 'Usuário ou senha não encontrado' });
        }

        // Validar a senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Usuário ou senha não encontrado' });
        }

        // Gerar o token JWT e codificar o e-mail em paralelo
        const [token, encodedEmail] = await Promise.all([
            jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '1h' }),
            Buffer.from(user.email).toString('base64')
        ]);

        // Configurações padrão dos cookies
        const cookieOptions = {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 3600000 // 1 hora
        };

        // Definir cookies
        res.cookie('token', token, { ...cookieOptions, httpOnly: true });
        res.cookie('proceder_username', user.username, { ...cookieOptions, httpOnly: false });
        res.cookie('proceder_email', encodedEmail, { ...cookieOptions, httpOnly: false });

        res.status(200).json(
            {
                "redirect": isRoot ? '/admin' : '/iframe/home'
            }
        )
        
        
    } catch (error) {
        console.error('Erro durante o login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
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