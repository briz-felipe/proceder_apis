const express = require('express');
const path = require('path');

const router = express.Router();

router.get("/login/main.js", async (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'js', 'auth', 'login.js'));
});

router.get("/src/main.js", async (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'js', 'main.js'));
});

router.get("/logo.svg", async (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'img', 'logo.svg'));
});

router.get("/iframe/home/main.js", async (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'js','iframe','home', 'main.js'));
});
router.get("/root/users/main.js", async (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'js','root','createUsers.js'));
});

module.exports = router;