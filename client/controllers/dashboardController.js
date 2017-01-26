angular.module('msApp').controller('DashboardController', [
    '$scope',
    '$http',
    '$window',
    'AuthFactory',
    function($scope, $http, $window, AuthFactory) {
        $scope.loggedIn = false;

        AuthFactory
            .isLoggedIn()
            .then(function(result) {
                if (result.status === 200) {
                    $scope.loggedIn = true;
                }
            })
            .catch(function(err) {
                console.log(err);
            });

        var today = new Date();
        var endOfWeek = today;
        endOfWeek.setDate(today.getDate() - today.getDay());
        $scope.currentWeekStart = endOfWeek;
        $scope.currentWeekEnd = new Date(today).setDate(today.getDate() + 7);

        // Holds the statuses for the week indexed 0-6
        $scope.statuses = {};

        $scope.getStatuses = function() {
            $http
                .get('/organizer')
                .then(function(result) {
                    result.data.forEach(function(status) {
                        for (i = 0; i < new Date().getDay(); i++) {
                            $scope.statuses[i] = 'remove';
                        }
                        var day = new Date(status.created).getDay();
                        $scope.statuses[day] = status.status ? 'ok' : 'remove';
                    });
                })
                .catch(function(error) {
                    if (error.status === 401) {
                        $window.location.href = '#!/login';
                    } else {
                        console.log(error);
                    }
                });
        };

        $scope.goBackOneWeek = function() {
            var oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - oneWeekAgo.getDay() - 7);
            // oneWeekAgo.setDay(0);
            console.log(oneWeekAgo);
            $http
                .get('/organizer/' + oneWeekAgo)
                .then(function(result) {
                    $scope.currentWeekStart = oneWeekAgo;
                    $scope.currentWeekEnd = new Date(oneWeekAgo).setDate(
                        oneWeekAgo.getDate() + 7
                    );
                    for (i = 0; i < 7; i++) {
                        $scope.statuses[i] = 'remove';
                    }
                    result.data.forEach(function(status) {
                        var day = new Date(status.created).getDay();
                        $scope.statuses[day] = status.status ? 'ok' : 'remove';
                    });
                })
                .catch(function(error) {
                    if (error.status === 401) {
                        $window.location.href = '#!/login';
                    } else {
                        console.log(error);
                    }
                });
        };

        $scope.showHistory = function(week) {
            $http
                .get('/organizer/' + week.start)
                .then(function(result) {
                    $scope.currentWeekStart = week.start;
                    $scope.currentWeekEnd = week.end;
                    for (i = 0; i < 7; i++) {
                        $scope.statuses[i] = 'remove';
                    }
                    result.data.forEach(function(status) {
                        var day = new Date(status.created).getDay();
                        $scope.statuses[day] = status.status ? 'ok' : 'remove';
                    });
                    $scope.viewHistory = false;
                })
                .catch(function(error) {
                    if (error.status === 401) {
                        $window.location.href = '#!/login';
                    } else {
                        console.log(error);
                    }
                });
        };

        $scope.checkHistory = function() {
            $http
                .get('/organizer/earliest')
                .then(function(response) {
                    $scope.viewHistory = true;
                    console.log('View history:', $scope.viewHistory);
                    $scope.history = buildHistory(new Date(
                        response.data.created
                    ));
                })
                .catch(function(err) {
                    console.log(err);
                });
        };

        $scope.hideHistory = function() {
            $scope.viewHistory = false;
        };

        // Set all days before today to false
        for (i = 0; i < new Date().getDay(); i++) {
            $scope.statuses[i] = 'remove';
        }
        // Then get the real statuses
        $scope.getStatuses();
    }
]);

function buildHistory(firstDate) {
    firstDate.setDate(firstDate.getDate() - firstDate.getDay());
    firstDate.setHours(0);
    firstDate.setMinutes(0);
    firstDate.setSeconds(0);
    console.log('First Date:', firstDate);
    var result = [];
    while (firstDate <= new Date()) {
        var weekEnd = new Date(firstDate);
        weekEnd.setDate(firstDate.getDate() + 7);
        weekEnd.setSeconds(weekEnd.getSeconds() - 1);
        result.push({start: firstDate, end: weekEnd});
        firstDate = new Date(weekEnd);
        firstDate.setSeconds(firstDate.getSeconds() + 1);
    }
    return result;
}
