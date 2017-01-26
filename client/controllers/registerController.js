angular.module('msApp').controller('RegisterController', ['$scope', '$http', '$window', function($scope, $http, $window) {
    console.log('register');
    $scope.register = function() {
        console.log('registering');
        // TODO add authentication first
        // $window.location.href = '/login';
        var userToSend = {
            email: $scope.emailIn,
            password: $scope.passwordIn,
            deviceId: $scope.deviceIdIn
        };
        $http.post('register/', userToSend)
        .then(function(response) {
            console.log(response);
            if(response.status === 201) {
                $http.post('/login', {
                    username: $scope.emailIn,
                    password: $scope.passwordIn
                })
                    .then(function(response) {
                        if (response.status === 200) {
                            swal({title: "Great! Now let's set up your profile"}, function() {
                                $window.location.href = '#!/profile';
                                $window.location.reload();
                            });
                        }
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        })
        .catch(function(err) {
            console.log(err);
        });
    };
}]);
