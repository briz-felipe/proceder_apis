const express = require('express');
const { listDir } = require('../controllers/sftpController');

const router = express.Router();

router.get('/listdir', listDir);
router.get('/', (req, res) => {
    res.json({ message: 'API is working' });
});

module.exports = router;