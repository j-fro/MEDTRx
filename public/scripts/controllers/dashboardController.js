angular.module('msApp').controller('DashboardController', ['$scope', '$http', function($scope, $http) {
    console.log('ng');
    var today = new Date();
    today.setDate(today.getDate() - today.getDay());
    $scope.currentWeekStart = today;
    $scope.currentWeekEnd = new Date(today).setDate(today.getDate() + 7);
    // var weekDates = [0, 1, 2, 3, 4, 5, 6].map(function(day) {
    //     return new Date(new Date(today).setDate(today.getDate() + day));
    // });
    // console.log(weekDates);


    $scope.statuses = {};

    $scope.getStatuses = function() {
        $http.get('/organizer/bob@bobmail.com')
            .then(function(result) {
                console.log(result);
                result.data.forEach(function(status) {
                    console.log(new Date(status.created));
                    var day = new Date(status.created).getDay();
                    console.log('index:', day);
                    $scope.statuses[day] = status.status;
                });
            });
    };

    for(i = 0; i < new Date().getDay(); i++) {
        if(!$scope.statuses[i]) {
            $scope.statuses[i] = false;
        }
    }

    $scope.getStatuses();
}]);
