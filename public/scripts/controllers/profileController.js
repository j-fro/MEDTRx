angular.module('msApp').controller('ProfileController', ['$scope', '$http', '$window', 'AuthFactory', function($scope, $http, $window, AuthFactory) {
    console.log('profile');
    $scope.saved = false;
    $scope.registeredDevice = false;

    AuthFactory.isLoggedIn()
        .then(function(result) {
            if (result.status === 200) {
                $scope.loggedIn = true;
            } else {
                $window.location.href = '#!/login';
            }
        })
        .catch(function(err) {
            console.log(err);
            $window.location.href = '#!/login';
        });

    $scope.existingDevice = function() {
        $http.get('/organizer/device')
            .then(function(result) {
                console.log(result);
                $scope.deviceId = result.data.device_id;
                $scope.registeredDevice = true;
            })
            .catch(function(err) {
                console.log(err);
                $scope.registeredDevice = false;
            });
    };

    $scope.registerDevice = function() {
        $http.put('/organizer', {
                deviceId: $scope.deviceIdIn
            })
            .then(function(response) {
                console.log(response);
                if (response.status === 200) {
                    $scope.saved = true;
                    $scope.existingDevice();
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.existingReminder = function() {
        $http.get('/reminder')
            .then(function(response) {
                $scope.reminderTime = response.data.reminder_time;
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.saveReminder = function() {
        $http.put('/reminder', {
                reminderTime: $scope.reminderTimeIn
            })
            .then(function(response) {
                $scope.saved = true;
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.existingContact = () => {
        $http.get('/contact')
            .then((response) => {
                $scope.contacts = response.data;
                response.data.forEach(function(contact) {
                    $scope.contactValues[contact.id] = contact.contact;
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    $scope.saveContact = () => {
        var contactToSend = {
            contact: $scope.contact,
            contactType: $scope.contactType
        };

        $http.post('/contact', contactToSend)
            .then(function(response) {
                if (response.status === 201) {
                    $scope.saved = true;
                    $scope.contact = undefined;
                    $scope.existingContact();
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.editContact = function(contact) {
        var newContact = $scope.contactValues[contact.id];
        console.log('Editing contact:', contact);
        console.log('And its new value is:', newContact);
        if (newContact !== contact.contact) {
            var contactToSend = {
                contactId: contact.id,
                contact: newContact
            };
            $http.put('/contact', contactToSend)
                .then(function(response) {
                    $scope.saved = true;
                    $scope.existingContact();
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    };

    $scope.removeContact = function(contactId) {
        $http.delete('/contact/' + contactId)
            .then(function(response) {
                $scope.saved = true;
                $scope.existingContact();
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.init = function() {
        $scope.existingDevice();
        $scope.existingContact();
        $scope.existingReminder();
        $scope.editing = null;
        $scope.contactValues = {};
    };

    $scope.init();
}]);
