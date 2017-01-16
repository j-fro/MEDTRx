angular.module('msApp').controller('DashboardController', ['$scope', '$http', function($scope, $http) {
    console.log('ng');
    var today = new Date();
    today.setDate(today.getDate() - today.getDay());
    $scope.currentWeekStart = today;
    $scope.currentWeekEnd = new Date(today).setDate(today.getDate() + 7);
    var weekDates = [0, 1, 2, 3, 4, 5, 6].map(function(day) {
        return new Date(new Date(today).setDate(today.getDate() + day));
    });

    $scope.sunday = "Complete";
    $scope.monday = "Complete";
    $scope.tuesday = "--";
    $scope.wednesday = "--";
    $scope.thursday = "--";
    $scope.friday = "--";
    $scope.saturday = "--";

    $scope.getStatuses = function() {
        $http.get('/organizer/bob@bobmail.com')
            .then(function(result) {
                console.log(result);
            });
    };

    $scope.getStatuses();
}]);
