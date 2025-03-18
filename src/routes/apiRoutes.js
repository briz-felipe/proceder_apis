const express = require('express');
const { 
    createUser,
    isRoot,
    groups,
    companies,
    createCompany,
    createGroup,
    createAccess,
    getUsers
} = require('../controllers/users');

const router = express.Router();


// Rota para criar um novo usuário
router.post('/user', createUser);
router.get('/users',getUsers);
router.post('/create/access', createAccess);
router.get('/groups', groups);
router.post('/create/group', createGroup);
router.get('/companies', companies);
router.post('/create/company', createCompany);
router.get('/users/isRoot/:username', isRoot)

module.exports = router;