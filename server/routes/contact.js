// Modules
const express = require('express');
const path = require('path');
const db = require('../../utils/database/db');
const auth = require('../../utils/auth');
const router = express.Router();

router.get('/', auth.checkIfAuthenticated, (req, res) => {
    db.contacts.select.allByUser(req.user.id, (result) => {
        console.log('Contact result:', result);
        res.send(result);
    });
});

router.post('/', auth.checkIfAuthenticated, (req, res) => {
    console.log('Adding a contact:', req.body);
    db.contacts.insert.contact(req.user.id, req.body.contact, req.body.contactType, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

module.exports = router;
