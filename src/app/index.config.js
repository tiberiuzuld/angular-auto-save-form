(function () {
  'use strict';

  angular.module('autoSaveFormApp').config(config);

  /** @ngInject */
  function config($logProvider, $compileProvider, autoSaveFormProvider) {
    // Disable debug
    $logProvider.debugEnabled(false);
    $compileProvider.debugInfoEnabled(true);

    autoSaveFormProvider.setDebounce(500);
    autoSaveFormProvider.setAutoSaveMode(true);
    autoSaveFormProvider.setSpinner(true);
    autoSaveFormProvider.setSpinnerPosition('top right');
  }

})();
