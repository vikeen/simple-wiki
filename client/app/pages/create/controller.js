'use strict';

angular.module('simpleWikiApp')
  .controller('PageCreateController', function ($http) {
    var vm = this;

    vm.newPage = {

    };

    vm.onSubmit = onSubmit;

    activate();

    /*
     * Public API
     */

    function onSubmit(form) {
      if (form.$valid) {
        $http.post('/api/pages/', vm.newPage).success(function() {
          console.log('page creation successful!');
        });
      }
    }

    /*
     * Private API
     */

    function activate() {}
  });
