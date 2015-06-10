'use strict';

angular.module('simpleWikiApp').service('toast', ToastService);

function ToastService($mdToast) {
  var delay = 3000,
    position = 'bottom right';

  return {
    simple: simple
  };

  function simple(message, options) {
    options = options || {};

    $mdToast.show(
      $mdToast.simple()
        .content(message)
        .position(options.position || position)
        .hideDelay(options.delay || delay)
    );
  }
}
