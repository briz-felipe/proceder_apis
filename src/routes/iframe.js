const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/home', (req, res) => {
    res.render('iframe/home/index');
    
});

module.exports = router;