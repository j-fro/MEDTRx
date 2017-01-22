angular.module('msApp').controller('LoginController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log('login');
    $scope.login = function() {
        console.log('logging in');
        var toSend = {
            username: $scope.emailIn,
            password: $scope.passwordIn
        };
        $http.post('/login', toSend)
        .then(function(result) {
            console.log('Success:', result);
            $window.location.href = '/';
        })
        .catch(function(err) {
            console.log('Error', err);
        });
    };
}]);
