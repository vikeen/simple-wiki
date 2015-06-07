'use strict';

angular.module('simpleWikiApp')
  .controller('PageCreateController', function ($scope, $http) {
    var vm = this;

    vm.newPage = {
      contentType: 'markdown'
    };

    vm.contentTypes = {
      markdown: 'Markdown'
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
