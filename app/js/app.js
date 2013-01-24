'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [
    'myApp.filters', 
    'myApp.services', 
    'myApp.directives', 
    'myApp.api'
    ]);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

app.constant('API_ENDPOINT', 'http://localhost:8000/api');

app.factory('Tag', function ($apiResource) {
  return $apiResource('tags');
});

app.factory('Entry', function ($apiResource) {
  return $apiResource('entries');
});
