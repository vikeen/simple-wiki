'use strict';

angular.module('simpleWikiApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pages:index', {
        url: '/pages',
        templateUrl: 'app/pages/index/view.html',
        controller: 'PagesController',
        controllerAs: 'pagesCtrl'
      })
      .state('pages:create', {
        url: '/pages/create',
        templateUrl: 'app/pages/create/view.html',
        controller: 'PageCreateController',
        controllerAs: 'pageCreateCtrl'
      })
      .state('pages:show', {
        url: '/pages/:title',
        templateUrl: 'app/pages/show/view.html',
        controller: 'PageShowController',
        controllerAs: 'pageShowCtrl'
      })
      .state('pages:update', {
        url: '/pages/:title/edit',
        templateUrl: 'app/pages/update/view.html',
        controller: 'PageUpdateController',
        controllerAs: 'pageUpdateCtrl'
      });
  });
