const express = require('express');
const { createUser } = require('../controllers/users');

const router = express.Router();


// Rota para criar um novo usuário
router.post('/users', createUser);

module.exports = router;