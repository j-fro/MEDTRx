angular.module('msApp').controller('ProfileController', ['$scope', '$http', '$window', 'AuthFactory', function($scope, $http, $window, AuthFactory) {
    console.log('profile');

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

    $scope.registerDevice = function() {
        $http.put('/organizer', { deviceId: $scope.deviceIdIn })
            .then(function(response) {
                console.log(response);
            })
            .catch(function(err) {
                console.log(err);
            });
    };
}]);
