// Modules
const express = require('express');
const path = require('path');
let router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/index.html'));
});

module.exports = router;
