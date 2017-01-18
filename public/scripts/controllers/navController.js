angular.module('msApp').controller('NavController', ['$scope', '$window', 'AuthFactory', function($scope, $window, AuthFactory) {
    console.log('Nav controller load');
    $scope.loggedIn = false;
    AuthFactory.isLoggedIn()
    .then(function(result) {
        if(result.status === 200) {
            $scope.loggedIn = true;
        }
    })
    .catch(function(err) {
        console.log(err);
    });

    $scope.logout = function() {
        AuthFactory.logout()
            .then(function(response) {
                $scope.loggedIn = false;
                $window.location.href='/';
            });
    };
}]);
