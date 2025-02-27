const express = require('express');
const path = require('path');

const router = express.Router();

router.get("/login/main.js", async (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'login', 'js', 'main.js'));
});

router.get("/src/main.js", async (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'js', 'main.js'));
});

module.exports = router;