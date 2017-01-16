angular.module('msApp').controller('DashboardController', ['$scope', function($scope) {
    console.log('ng');
    var today = new Date();
    today.setDate(today.getDate() - today.getDay());
    $scope.currentWeekDate = today;
    $scope.sunday = "Complete";
    $scope.monday = "Complete";
    $scope.tuesday = "--";
    $scope.wednesday = "--";
    $scope.thursday = "--";
    $scope.friday = "--";
    $scope.saturday = "--";

}]);
