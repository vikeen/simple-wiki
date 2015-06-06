'use strict';

angular.module('simpleWikiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pages.index', {
        url: '/pages',
        templateUrl: 'app/pages/pages.html',
        controller: 'PagesController',
        controllerAs: 'pagesCtrl'
      });
  });
