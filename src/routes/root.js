const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/users/create', (req, res) => {
    res.render('root/index');
    
});

module.exports = router;