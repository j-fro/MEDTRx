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

    $scope.reload = function() {
        $window.location.href = '/';
    };

    $scope.existingDevice = function() {
        $http.get('/organizer/device')
            .then(function(result) {
                console.log(result);
                $scope.deviceId = result.data.device_id;
                $scope.registeredDevice =  true;
            })
            .catch(function (err) {
                console.log(err);
                $scope.registeredDevice =  false;
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
                }
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
                console.log(response);
            })
            .catch(function(err) {
                console.log(err);
            });
    };

    $scope.existingDevice();
}]);
