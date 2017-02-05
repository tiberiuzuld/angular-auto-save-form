/*
 Angular Auto Save Form
 (c) 2017 Tiberiu Zuld
 License: MIT
 */

(function () {
  'use strict';

  autoSaveForm.$inject = ["$parse", "autoSaveForm", "$log"];
  angular.module('angular-auto-save-form', [])
    .provider('autoSaveForm', autoSaveFormProvider)
    .directive('autoSaveForm', autoSaveForm)
    .directive('autoSaveFormProperty', autoSaveFormProperty);

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
  function autoSaveForm($parse, autoSaveForm, $log) {
    var spinnerTemplate = '<div class="spinner"></div>';

    function saveFormLink(scope, element, attributes) {
      var formModel = scope.$eval(attributes.name);
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
        cycleForm(formModel);

        var invoker = $parse(attributes.autoSaveForm);
        var promise = invoker(scope, {controls: controls, $event: event});
        if (promise) {
          if (saveFormSpinner) {
            saveFormSpinnerElement.addClass('spin');
          }
          promise
            .then(function () {
              formModel.$setPristine();
            }, $log.error)
            .finally(function () {
              if (saveFormSpinner) {
                saveFormSpinnerElement.removeClass('spin');
              }
            });
        } else {
          formModel.$setPristine();
        }

        function cycleForm(formModel) {
          angular.forEach(formModel, checkForm);
        }

        function checkForm(value, key) {
          if (key[0] !== '$' && key[0] !== '.' && value.$dirty) {
            if (value.hasOwnProperty('$submitted')) { //check nestedForm
              cycleForm(value);
            } else {
              var keys = key.split(/\./);
              if (scope.autoSaveFormProperties && scope.autoSaveFormProperties[keys[0]]) {
                keys = scope.autoSaveFormProperties[keys[0]].split(/\./);
              }
              constructControlsObject(keys, value.$modelValue, controls);
            }
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

    return {
      restrict: 'A',
      link: saveFormLink
    };
  }

  /** @ngInject */
  function autoSaveFormProperty() {

    function saveFormLink(scope, element, attributes) {
      if (attributes.autoSaveFormProperty) {
        if (angular.isUndefined(scope.autoSaveFormProperties)) {
          scope.autoSaveFormProperties = {};
        }
        var keys = attributes.autoSaveFormProperty.split(/\./);
        scope.autoSaveFormProperties[keys.splice(0, 1)] = keys.join('.');
      }
    }

    return {
      restrict: 'A',
      link: saveFormLink
    };
  }
})();
