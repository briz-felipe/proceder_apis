require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/home', (req, res) => {
    const token = req.cookies?.token;

    // Se o token não existir, redireciona para a página de login
    if (!token) {
        return res.redirect('/login');
    }

    try {
        // Verificar o token
        const verified = jwt.verify(token, process.env.SECRET_KEY_JWT);
        req.user = verified;

        // Renderiza a página home se o token for válido
        return res.render('iframe/home/index');
    } catch (err) {
        console.error('Erro ao verificar o token:', err.message);
        return res.redirect('/login');
    }
});

module.exports = router;
