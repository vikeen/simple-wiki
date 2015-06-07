'use strict';

angular.module('simpleWikiApp')
  .controller('PagesController', function ($http) {
    var vm = this;

    activate();

    /*
     * Public API
     */

    /*
     * Private API
     */

    function activate() {
      $http.get('/api/pages').success(function(pages) {
        vm.pages = pages;
      });
    }
  });
