angular.module('myApp.api', [])
  .factory('$apiResource', ['API_ENDPOINT', '$http', function (API_ENDPOINT, $http) {

    function ApiResourceFactory(collectionName) {
      var url = API_ENDPOINT + '/' + collectionName;

      var addThen = function (prom, successcb, errorcb) {
        return prom.then(function (response) {
          var result = new Resource(response.data);
          (successcb || angular.noop)(result, response.status, response.headers, response.config);
          return result;
        }, function (response) {
          (errorcb || angular.noop)(undefined, response.status, response.headers, response.config);
          return undefined;
        });
      };

      var prepareQueryParams = function (query) {
        return angular.isObject(query) && !angular.equals(query, {}) 
                ? { q: JSON.stringify(query) }
                : { };
      };

      var Resource = function (data) {
        angular.extend(this, data);
      };

      Resource.query = function (query, options, successcb, errorcb) {

        // TODO options

        if (angular.isFunction(options)) { 
          errorcb = successcb; 
          successcb = options; 
          options = {}; 
        }

        var params = angular.extend({}, prepareQueryParams(query));
        var prom = $http.get(url, {params:params});
        return addThen(prom, successcb, errorcb);
      }

      Resource.all = function (options, successcb, errorcb) {
        if (angular.isFunction(options)) { 
          errorcb = successcb; 
          successcb = options; 
          options = {}; 
        }
        return Resource.query({}, options, successcb, errorcb);
      };

      Resource.get = function (id, successcb, errorcb) {
        var prom = $http.get(url + '/' + id);
        return addThen(prom, successcb, errorcb);
      };

      Resource.prototype.$save = function (successcb, errorcb) {
        var prom = $http.post(url, this);
        return addThen(prom, successcb, errorcb);
      };

      return Resource;
    }

    return ApiResourceFactory;
  }]);
