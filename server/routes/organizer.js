var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.send('Here waiting for the organizer..');
});

router.post('/:deviceId', function(req, res) {
    console.log('Received post from device:', req.params.deviceId, 'with data', req.body);
    res.sendStatus(501);
});

router.put('/', function(req, res) {
    console.log('Received put with:', req.body);
    res.sendStatus(501);
});

module.exports = router;
