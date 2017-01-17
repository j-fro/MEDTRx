angular.module('msApp').controller('LoginController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log('login');
    $scope.login = function() {
        console.log('logging in');
        // TODO add authentication first
        $window.location.href = '/';
    };
}]);
