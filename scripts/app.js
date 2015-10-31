(function () {
  'use strict';

  angular.module('autoSaveFormApp', ['angular-auto-save-form', 'ngMockE2E', 'mayDelay']);
})();

(function () {
  'use strict';

  angular.module('autoSaveFormApp').run(IndexMocks);

  /** @ngInject */
  function IndexMocks($httpBackend) {
    var delay = 500;
    var user = {
      name: 'Jon Doe',
      city: 'New York',
      country: 'United States of America',
      language: 'English'
    };

    var userNormal = {
      name: 'Doe Joe',
      city: 'Paris',
      country: 'France',
      language: 'French'
    };

    $httpBackend.whenPOST(/updateDataNormal/).respond(function (method, url, data) {
      return [200, data];
    }, delay);

    $httpBackend.whenPOST(/updateData/).respond(function (method, url, data) {
      return [200, data];
    }, delay);

    $httpBackend.whenGET(/getDataNormal/).respond(userNormal);

    $httpBackend.whenGET(/getData/).respond(user);
  }
  IndexMocks.$inject = ["$httpBackend"];
})();

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
  IndexController.$inject = ["$http"];
})();

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
  config.$inject = ["$logProvider", "$compileProvider", "autoSaveFormProvider"];

})();
