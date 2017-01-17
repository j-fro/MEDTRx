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
        // $window.location.href = '/';
        var toSend = {
            username: $scope.username,
            password: $scope.password
        };
        $http.post('/login', toSend)
        .then(function(result) {
            console.log('Success:', result);
            $window.location.href = '/dashboard';
        })
        .catch(function(err) {
            console.log('Error', err);
        });
    };
}]);

msApp.controller('RegisterController', ['$scope', '$http', '$window', function($scope, $http, $window) {
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
