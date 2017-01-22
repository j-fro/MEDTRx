// Modules
const express = require('express');
const path = require('path');
const db = require('../../utils/database/db');
const auth = require('../../utils/auth');
let router = express.Router();

router.use(auth.checkIfAuthenticated);

router.get('/', (req, res) => {
    db.contacts.select.allByUser(req.user.id, (result) => {
        console.log('Contact result:', result);
        res.send(result);
    });
});

router.post('/', (req, res) => {
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

router.put('/', (req, res) => {
    console.log('Updating a contact:', req.body);
    db.contacts.update.contact(req.body.contactId, req.body.contact, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});

router.delete('/:contactId', (req, res) => {
    console.log('Deleting a contact:', req.params.contactId);
    db.contacts.delete.one(req.params.contactId)
        .then(() => res.sendStatus(200))
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
});

module.exports = router;
