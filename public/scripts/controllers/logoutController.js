angular.module('msApp').controller('LogoutController', ['$scope', '$window', function($scope, $window) {
    console.log('logout');
    $window.location.href = '#!/login';
}]);
