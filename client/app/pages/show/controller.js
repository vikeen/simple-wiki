'use strict';

angular.module('simpleWikiApp').controller('PageShowController', PageShowController);

function PageShowController($http, $stateParams) {
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
    $http.get('/api/pages/' + $stateParams.id).success(function (page) {
      vm.page = page;
      vm.page.formattedCreated = _convertDate(vm.page.created);
      vm.page.formattedUpdated = null;

      if (vm.page.updated) {
        vm.page.formattedUpdated = _convertDate(vm.page.updated);
      }
    });
  }

  function _convertDate(date) {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  }
}
