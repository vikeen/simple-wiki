'use strict';

angular.module('simpleWikiApp').controller('PageCreateController', PageCreateController);

function PageCreateController($http, toast) {
  var vm = this;

  vm.newPage = {
    contentType: 'markdown'
  };

  vm.onSubmit = onSubmit;

  activate();

  /*
   * Public API
   */

  function onSubmit() {
    $http.post('/api/pages/', vm.newPage)
      .success(function () {
        toast.simple('Page created');
      })
      .catch(function (err) {
        console.log(err);
        toast.simple('Failed to create page');
      });
  }

  /*
   * Private API
   */

  function activate() {
  }
}
