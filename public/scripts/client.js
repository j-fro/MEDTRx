var msApp = angular.module('msApp', ['ngRoute']);

msApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/partials/login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'views/partials/register.html',
            controller: 'RegisterController'
        })
        .when('/dashboard', {
            templateUrl: 'views/partials/dashboard.html',
            controller: 'DashboardController'
        })
        .when('/profile', {
            templateUrl: 'views/partials/profile.html',
            controller: 'ProfileController'
        })
        .otherwise({
            redirectTo: 'dashboard'
        });
}]);
