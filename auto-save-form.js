/*
 Angular Auto Save Form
 (c) 2016 Tiberiu Zuld
 License: MIT
 */

(function () {
  'use strict';

  angular.module('angular-auto-save-form', [])
    .provider('autoSaveForm', autoSaveFormProvider)
    .directive('autoSaveForm', autoSaveForm);

  /** @ngInject */
  function autoSaveFormProvider() {
    var debounce = 500;
    var autoSaveMode = true;

    return {
      setDebounce: function (value) {
        if (angular.isNumber(value)) {
          debounce = value;
        }
      },
      setAutoSaveMode: function (value) {
        if (angular.isDefined(value)) {
          autoSaveMode = value;
        }
      },
      $get: function () {
        return {
          debounce: debounce,
          autoSaveMode: autoSaveMode
        };
      }
    }
  }

  /** @ngInject */
  function autoSaveForm(autoSaveForm) {
    return {
      restrict: 'A',
      link: saveFormLink
    };

    function saveFormLink(scope, element, attributes) {
      var formModel = scope.$eval(attributes.name);
      var saveFormCallback = scope.$eval(attributes.autoSaveForm);
      var saveFormAuto = scope.$eval(attributes.autoSaveFormMode);
      var saveFormDebounce = scope.$eval(attributes.autoSaveFormDebounce);

      if (angular.isUndefined(saveFormAuto)) {
        saveFormAuto = autoSaveForm.autoSaveMode;
      }

      if (saveFormAuto) {
        if (angular.isUndefined(saveFormDebounce)) {
          saveFormDebounce = autoSaveForm.debounce;
        }
        var debounce = _.debounce(getChangedControls, saveFormDebounce);
        scope.$watch(function () {
          return formModel.$dirty && formModel.$valid;
        }, function (newValue) {
          if (newValue) {
            debounce();
          }
        });
      } else {
        element.on('submit', function (event) {
          event.preventDefault();
          getChangedControls(event);
        });
      }

      function getChangedControls(event) {
        if (formModel.$invalid || formModel.$pristine) {
          return;
        }
        formModel.$commitViewValue();
        var controls = {};
        //only way to get form controls if angular doesn't implement $getControls on form object
        angular.forEach(formModel, function (value, key) {
          if (key[0] !== '$' && key[0] !== '.' && value.$dirty) {
            constructControlsObject(key.split(/\./gi), value.$modelValue, controls);
          }
        });

        formModel.$setPristine();
        saveFormCallback(controls, event);
      }

      function constructControlsObject(keys, value, controls) {
        var key = keys.shift();

        if (keys.length) {
          if (!controls.hasOwnProperty(key)) {
            controls[key] = {};
          }
          constructControlsObject(keys, value, controls[key]);
        } else {
          controls[key] = value;
        }
      }
    }
  }
  autoSaveForm.$inject = ["autoSaveForm"];
})();
