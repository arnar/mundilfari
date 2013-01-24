'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', ['version', function(version) {
    return function(text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }]).
  filter('momentCalendar', [function () {
    return function(date) {
      return moment(date).calendar();
    }
  }]);
