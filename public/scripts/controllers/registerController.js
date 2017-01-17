angular.module('msApp').controller('RegisterController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log('register');
    $scope.register = function() {
        console.log('registering');
        // TODO add authentication first
        $window.location.href = '#!/login';
    };
}]);
