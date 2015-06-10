'use strict';

angular.module('simpleWikiApp').controller('MainController', MainController);

function MainController($http) {
  var vm = this;

  vm.pages = {};

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
}
