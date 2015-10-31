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
    var spinner = true;
    var spinnerPosition = 'top right';

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
      setSpinner: function (value) {
        if (angular.isDefined(value)) {
          spinner = value;
        }
      },
      setSpinnerPosition: function (value) {
        if (angular.isDefined(value)) {
          spinnerPosition = value;
        }
      },
      $get: function () {
        return {
          debounce: debounce,
          autoSaveMode: autoSaveMode,
          spinner: spinner,
          spinnerPosition: spinnerPosition
        };
      }
    }
  }

  /** @ngInject */
  function autoSaveForm(autoSaveForm) {
    var spinnerTemplate = '<div class="spinner"></div>';
    return {
      restrict: 'A',
      link: saveFormLink
    };

    function saveFormLink(scope, element, attributes) {
      var formModel = scope.$eval(attributes.name);
      var saveFormCallback = scope.$eval(attributes.autoSaveForm);
      var saveFormAuto = scope.$eval(attributes.autoSaveFormMode);
      var saveFormDebounce = scope.$eval(attributes.autoSaveFormDebounce);
      var saveFormSpinner = scope.$eval(attributes.autoSaveFormSpinner);
      var saveFormSpinnerPosition = scope.$eval(attributes.autoSaveFormSpinnerPosition);
      var saveFormSpinnerElement;

      if (angular.isUndefined(saveFormAuto)) {
        saveFormAuto = autoSaveForm.autoSaveMode;
      }

      if (angular.isUndefined(saveFormSpinner)) {
        saveFormSpinner = autoSaveForm.spinner;
      }

      if (saveFormSpinner) {
        if (angular.isUndefined(saveFormSpinnerPosition)) {
          saveFormSpinnerPosition = autoSaveForm.spinnerPosition;
        }
        element.append(spinnerTemplate);
        saveFormSpinnerElement = angular.element(element[0].lastChild);
        saveFormSpinnerElement.addClass(saveFormSpinnerPosition);
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
            formModel.$valid = false;
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
        var controls = {};
        //only way to get form controls if angular doesn't implement $getControls on form object
        angular.forEach(formModel, checkForm);

        formModel.$setPristine();

        var promise = saveFormCallback(controls, event);
        if (promise && saveFormSpinner) {
          saveFormSpinnerElement.addClass('spin');
          promise.finally(function () {
            saveFormSpinnerElement.removeClass('spin');
          });
        }
        function checkForm(value, key) {
          if (key[0] !== '$' && key[0] !== '.' && value.$dirty) {
            constructControlsObject(key.split(/\./gi), value.$modelValue, controls);
          }
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
  }
})();
