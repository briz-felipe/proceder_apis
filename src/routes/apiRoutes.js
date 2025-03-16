const express = require('express');
const { createUser,isRoot,groups,companies,createCompany,createGroup,createAccess } = require('../controllers/users');

const router = express.Router();


// Rota para criar um novo usuário
router.post('/users', createUser);
router.post('/create/access', createAccess);
router.get('/groups', groups);
router.post('/create/group', createGroup);
router.get('/companies', companies);
router.post('/create/company', createCompany);
router.get('/users/isRoot/:username', isRoot)

module.exports = router;