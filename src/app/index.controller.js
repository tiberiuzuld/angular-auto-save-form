(function () {
  'use strict';

  angular.module('autoSaveFormApp').controller('IndexController', IndexController);

  /** @ngInject */
  function IndexController($http) {
    var vm = this;

    vm.languages = ['English', 'German', 'French'];
    vm.saveInProgress = false;
    vm.normalSaveInProgress = false;

    $http.get('getData').then(function (response) {
      vm.user = response.data;
    });

    $http.get('getDataNormal').then(function (response) {
      vm.userNormal = response.data;
    });

    vm.updateForm = function (formControls) {
      vm.savedObject = angular.toJson(formControls);
      return $http.post('/updateData', formControls);
    };

    vm.updateNormalForm = function (formControls) {
      vm.savedObject = angular.toJson(formControls);
      return $http.post('/updateDataNormal', formControls);
    }
  }
})();
