"use strict";

angular.module('simpleWikiApp')
  .filter('markdown', function () {
    return function (string) {
      if (string && string.length > 0) {
        return marked(string);
      }
      return '';
    };
  });
