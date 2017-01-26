angular.module('msApp').factory('AuthFactory', function($http) {
    var Status = {
        loggedIn: false,
    };

    // the public API
    return {
        Status: Status,

        checkLoggedIn: function() {
            return Status.loggedIn;
        },

        isLoggedIn: function() {
            return $http.get('/login');
        },

        setLoggedIn: function(value) {
            Status.loggedIn = value;
        },

        logout: function() {
            return $http.get('/login/logout');
        },
    };
});
