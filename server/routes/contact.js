// Modules
const express = require('express');
const path = require('path');
const auth = require('../../utils/auth');
const knex = require('../../utils/database');
let router = express.Router();

router.use(auth.checkIfAuthenticated);

router.get('/', (req, res) => {
    knex
        .select()
        .from('contacts')
        .where('user_id', req.user.id)
        .then(contacts => res.send(contacts))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.post('/', (req, res) => {
    console.log('Adding a contact:', req.body);
    knex
        .insert({
            user_id: req.user.id,
            contact: req.body.contact,
            contact_type: req.body.contactType
        })
        .into('contacts')
        .then(() => res.sendStatus(201))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.put('/', (req, res) => {
    console.log('Updating a contact:', req.body);
    knex
        .from('contacts')
        .where('id', req.body.contactId)
        .update('contact', req.body.contact)
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

router.delete('/:contactId', (req, res) => {
    console.log('Deleting a contact:', req.params.contactId);
    knex
        .from('contacts')
        .where('id', req.params.contactId)
        .del()
        .then(() => res.sendStatus(200))
        .catch(err => {
            console.log(err);
        });
});

module.exports = router;
