angular.module('msApp').controller('DashboardController', ['$scope', function($scope) {
    console.log('ng');
    $scope.currentWeekDate = "January 16th 2017";
    $scope.sunday = "Complete";
    $scope.monday = "Complete";
    $scope.tuesday = "--";
    $scope.wednesday = "--";
    $scope.thursday = "--";
    $scope.friday = "--";
    $scope.saturday = "--";

}]);
