'use strict';

angular.module('simpleWikiApp')
  .controller('PageShowController', function ($http, $stateParams) {
    var vm = this;

    vm.page = {};

    activate();

    /*
     * Public API
     */

    /*
     * Private API
     */

    function activate() {
      $http.get('/api/pages/' + $stateParams.title).success(function(page) {
        vm.page = page;
      })
    }
  });
