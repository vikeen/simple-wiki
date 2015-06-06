'use strict';

angular.module('simpleWikiApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/pages').success(function (pages) {
      $scope.pages = pages;
    });

    //$http.post('/api/pages', {
    //  name: 'New Page Name'
    //});

    //$http.get('/api/pages/test').success(function (html) {
    //  console.log('render this html page:', html);
    //});

  });
