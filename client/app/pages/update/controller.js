'use strict';

angular.module('simpleWikiApp')
  .controller('PageUpdateController', function ($http, $stateParams) {
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

    function onSubmit(form) {
      $http.put('/api/pages/' + vm.page.id, vm.page).success(function(updatePage) {
        console.log('page update successful!');
      });
    }

    /*
     * Private API
     */

    function activate() {
      $http.get('/api/pages/' + $stateParams.id).success(function(page) {
        vm.page = page;
      });
    }
  });
