angular.module('msApp').controller('DashboardController', ['$scope', '$http', function($scope, $http) {
    console.log('ng');
    var today = new Date();
    var endOfWeek = today;
    endOfWeek.setDate(today.getDate() - today.getDay());
    $scope.currentWeekStart = endOfWeek;
    $scope.currentWeekEnd = new Date(today).setDate(today.getDate() + 7);

    // Holds the statuses for the week indexed 0-6
    $scope.statuses = {};

    $scope.getStatuses = function() {
        $http.get('/organizer/bob@bobmail.com')
            .then(function(result) {
                result.data.forEach(function(status) {
                    var day = new Date(status.created).getDay();
                    $scope.statuses[day] = status.status ? 'Complete' : 'Missed';
                });
            });
    };

    // Set all days before today to false
    for(i = 0; i < new Date().getDay(); i++) {
        $scope.statuses[i] = 'Missed';
    }
    // Then get the real statuses
    $scope.getStatuses();
}]);
