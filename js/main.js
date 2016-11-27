var app = angular.module('app',['ngRoute']);

app.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl:"stocklist.html",
      controller: "stocksCtrl"
    })
    .when('/add', {
      templateUrl:"add.html"
    })
    .when('/edit/:editID', {
      templateUrl:"edit.html",
      controller: "editCtrl"
    })
    .otherwise({
      template:"404 error"
    })
});

app.controller('stocksCtrl', function ($scope, $http, $interval){
  $http.get("data.json").success(function(data) {
    for (var i = 0; i < data.length; i++) {
      data[i].date = new Date(data[i].date).toUTCString();
      if ( new Date(data[i].date).getTime() < new Date().getTime() ){
        data[i].id = "end";
      }
    }
    $scope.stocks = data;
  });
});


app.controller('editCtrl', function ($scope, $http){
  $http.get("data.json").success(function(data) {
    var idlink = document.location.hash.substr(7);
    for (var i = 0; i < data.length; i++){
      if(idlink === data[i].id){
        var stockObj = data[i];
      }
    }
    $scope.stocks = stockObj;
  });
});

app.directive('countdown', [
  'DateFilter',
  '$interval',
  function (DateFilter, $interval) {
    return {
      restrict: 'A',
      scope: { date: '@' },
      link: function (scope, element) {
        var endDate;
        endDate = new Date(scope.date);

        $interval(function () {
          var trueDate;
          trueDate = Math.floor((endDate.getTime() - new Date().getTime()) / 1000);
          return element.text(DateFilter.dhms(trueDate));
        }, 1000);
      }
    };
  }
]);

app.factory('DateFilter', [function () {
  return {
    dhms: function (t) {
      var days, hours, minutes, seconds;
      days = Math.floor(t / 86400);
      t -= days * 86400;
      hours = Math.floor(t / 3600) % 24;
      t -= hours * 3600;
      minutes = Math.floor(t / 60) % 60;
      t -= minutes * 60;
      seconds = t % 60;
      return [
        days + 'д',
        hours + 'ч',
        minutes + 'м',
        seconds + 'с'
      ].join(' ');
    }
  };
}]);
