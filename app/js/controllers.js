'use strict';

/* Controllers */


function MyCtrl1($scope, Tag, Entry) {
  $scope.newEntry = new Entry({
    minutes: "",
    project: "",
    tags: [],
    description: ""
  });
  $scope.tags = Tag.all();
  var tagnames = [];
  $scope.tags.then(function (val) {
    tagnames = _.pluck(val, '_id');
  });
  $scope.tagLoader = function () { return tagnames; }

  $scope.latestEntries = Entry.all();

  $scope.logNewEntry = function () {
    $scope.newEntry.$save(function () {
      $scope.latestEntries = Entry.all();
      $scope.tags = Tag.all();
      $scope.tags.then(function (val) {
        tagnames = _.pluck(val, '_id');
      });
    });
    $scope.newEntry = new Entry({
      minutes: "",
      project: "",
      tags: [],
      description: ""
    });
  };
}
MyCtrl1.$inject = ['$scope', 'Tag', 'Entry'];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
