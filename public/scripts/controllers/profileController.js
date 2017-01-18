angular.module('msApp').controller('ProfileController', ['$scope', '$window', 'AuthFactory', function($scope, $window, AuthFactory) {
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
}]);
