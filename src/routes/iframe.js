const express = require('express');
const db = require('../models');

const router = express.Router();

router.get('/home', (req, res) => {
    res.json({ message: 'API is working' });
});

module.exports = router;