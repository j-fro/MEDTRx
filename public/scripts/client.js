var msApp = angular.module('msApp', ['ngRoute']);

msApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/dashboard', {
            templateUrl: 'views/partials/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/profile', {
            templateUrl: 'views/partials/profile.html',
            controller: 'ProfileController'
        })
        .when('/logout', {
            templateUrl: 'views/partials/logout.html',
            controller: 'LogoutController'
        })
        .otherwise({
            redirectTo: 'dashboard'
        });
}]);

msApp.controller('LoginController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log('login');
    $scope.login = function() {
        console.log('logging in');
        // TODO add authentication first
        $window.location.href = '/';
    };
}]);

msApp.controller('RegisterController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log('register');
    $scope.register = function() {
        console.log('registering');
        // TODO add authentication first
        $window.location.href = '/login';
    };
}]);
