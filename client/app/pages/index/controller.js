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

        vm.pages.map(function(page) {
          page.formattedCreated = _convertDate(page.created);
          page.formattedUpdated = null;

          if (page.updated) {
            page.formattedUpdated = _convertDate(page.updated);
          }

          return page;
        })
      });
    }

    function _convertDate(date) {
      return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
    }
  });
