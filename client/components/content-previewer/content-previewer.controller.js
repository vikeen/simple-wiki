'use strict';

angular.module('simpleWikiApp').controller('ContentPreviewerController', ContentPreviewerController);

function ContentPreviewerController() {
  var vm = this;

  vm.contentTypes = {
    markdown: 'Markdown'
  };

  vm.onSubmit = onSubmit;

  activate();

  /*
   * Public API
   */

  function onSubmit(form) {
    vm.swOnSubmit()();
  }

  /*
   * Private API
   */

  function activate() {
  }
}
