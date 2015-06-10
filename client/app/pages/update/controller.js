'use strict';

angular.module('simpleWikiApp').controller('PageUpdateController', PageUpdateController);

function PageUpdateController($http, $stateParams, toast) {
  var vm = this;

  vm.contentTypes = {
    markdown: 'Markdown'
  };
  vm.page = {};

  vm.onSubmit = onSubmit;

  activate();

  /*
   * Public API
   */

  function onSubmit() {
    $http.put('/api/pages/' + vm.page.id, vm.page)
      .success(function () {
        toast.simple('Update successful');
      })
      .catch(function() {
        toast.simple('Update failed');
      });
  }

  /*
   * Private API
   */

  function activate() {
    $http.get('/api/pages/' + $stateParams.id)
      .success(function (page) {
        vm.page = page;
      });
  }
}
