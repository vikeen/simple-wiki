'use strict';

angular.module('simpleWikiApp')
  .controller('PagesController', function ($http) {
    var vm = this;

    vm.viewingLimit = 5;
    vm.viewingLimitIncrement = 10;

    vm.incrementViewingLimit = incrementViewingLimit;

    activate();

    /*
     * Public API
     */

    function incrementViewingLimit() {
      vm.viewingLimit += vm.viewingLimitIncrement;
    }

    /*
     * Private API
     */

    function activate() {
      $http.get('/api/pages').success(function(pages) {
        vm.pages = pages;
      });
    }
  });
