angular.module('msApp').controller('RegisterController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log('register');
    $scope.register = function() {
        console.log('registering');
        // TODO add authentication first
        // $window.location.href = '/login';
        var userToSend = {
            email: $scope.emailIn,
            password: $scope.passwordIn
        };
        $http.post('register/', userToSend)
        .then(function(response) {
            console.log(response);
            if(response.status === 201) {
                $window.location.href = '/login';
            }
        })
        .catch(function(err) {
            console.log(err);
        });
    };
}]);
