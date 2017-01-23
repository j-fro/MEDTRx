/*
db

.contacts:
    .select:
         .allByUserIdAndType: (userId: integer, contactType: string)
            -> Promise(resolve(result: array[{contact: string}]), reject(err: string))
            Finds all contact numbers for the supplied user that match the supplied type
            and resolves them as an array of objects with property contact. Rejects with
            an error string if an error is encountered.

         .allByUser: (userId: integer) -> Promise(resolve(result: array[{
                id: integer,
                user_id: integer,
                contact_type: string,
                contact: string
            }]), reject(err: string))
            Finds all contact numbers for the supplied user and resolves them as an
            array of contact objects. Rejects with an error string if an error is
            encountered.

    .insert:
         .contact: (userId: integer, contact: string, contactType: string)
            -> Promise(resolve(), reject(err))
            Adds a contact to the database for the supplied user with the supplied info.
            Resolves with no arguments if successful, or rejects with an (err) string if
            an error occurred.

    .update:
         .contact: (contactId: integer, contact: string)
                -> Promise(resolve(), reject(err))
            Updates a contact record from the database if its id matches (contactId)
            and sets the contact value to (contact). Resolves with no arguments if
            successful, or rejects with an (err) string if an error occurred.

    .delete:
         .one: (contactId: integer) -> Promise(resolve(), reject(err: string))
            Deletes any contact records from the database if their id matches
            (contactId). Resolves with no arguments if successful, or rejects with an
            (err) string if an error occurred.
*/


module.exports = {
    reminders: require('./tables/reminders/reminders'),
    contacts: require('./tables/contacts/contacts'),
    statuses: require('./tables/statuses/statuses'),
    users: require('./tables/users/users'),
    devices: require('./tables/devices/devices')
};
