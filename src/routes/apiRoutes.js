const express = require('express');
const { createUser,isRoot } = require('../controllers/users');

const router = express.Router();


// Rota para criar um novo usuário
router.post('/users', createUser);
router.get('/users/isRoot/:username', isRoot)

module.exports = router;