'use strict';

angular.module('simpleWikiApp').directive('swContentPreviewer', SimpleWikiContentPreviewerDirective);

function SimpleWikiContentPreviewerDirective() {
  return {
    restrict: 'E',
    scope: {
      swTitle: '@',
      swSubmitText: '@',
      swModel: '=',
      swOnSubmit: '&'
    },
    templateUrl: 'components/content-previewer/content-previewer.html',
    controller: 'ContentPreviewerController',
    controllerAs: 'contentPreviewerCtrl',
    bindToController: true,
    link: function() {
    }
  };
}
