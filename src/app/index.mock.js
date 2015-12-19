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
      language: 'English',
      gender: 'male'
    };

    var userNormal = {
      name: 'Doe Joe',
      city: 'Paris',
      country: 'France',
      language: 'French',
      gender: 'female'
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
})();
