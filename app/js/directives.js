'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('tags', [function () {
    return {
      require: '?ngModel',
      compile: function (tElm, tAttrs) {
        return function (scope, elm, attrs, controller) {
          var opts = angular.extend({}, scope.$eval(attrs.tags)),
              tagSrc = scope.$eval(attrs.tagsource);
          opts.multiple = true;
          opts.tags = tagSrc;
          
          if (controller) {
            controller.$render = function () {
              elm.select2('data', _.map(controller.$modelValue, function (tag) {
                return {id: tag, text: tag};
              }));
            };

            elm.bind("change", function () {
              scope.$apply(function () {
                controller.$setViewValue(_.pluck(elm.select2('data'), 'id'));
              });
            });
          }

          attrs.$observe('disabled', function (value) {
            elm.select2(value && 'disable' || 'enable');
          });

          elm.val(scope.$eval(attrs.ngModel));

          setTimeout(function () {
            elm.select2(opts);
          });
        };
      }
    };
  }]);
