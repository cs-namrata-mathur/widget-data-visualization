/* Copyright start
  Copyright (C) 2008 - 2025 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('editDataVisualization100Ctrl', editDataVisualization100Ctrl);

  editDataVisualization100Ctrl.$inject = ['$scope', '$uibModalInstance', 'config', 'widgetUtilityService', '$timeout', '$http', 'appModulesService', 'Entity'];

  function editDataVisualization100Ctrl($scope, $uibModalInstance, config, widgetUtilityService, $timeout, $http, appModulesService, Entity) {
    $scope.cancel = cancel;
    $scope.save = save;
    $scope.config = config;
    $scope.loadAttributes = loadAttributes;
    $scope.onChangeModuleType = onChangeModuleType;

    $scope.$watch('config.resource', function (oldValue, newValue) {
      if ($scope.config.resource && oldValue !== newValue) {
        delete $scope.config.query.filters;
        $scope.loadAttributes();
      }
    });

    if ($scope.config.resource) {
      $scope.loadAttributes();
    }

    function _handleTranslations() {
      let widgetNameVersion = widgetUtilityService.getWidgetNameVersion($scope.$resolve.widget, $scope.$resolve.widgetBasePath);

      if (widgetNameVersion) {
        widgetUtilityService.checkTranslationMode(widgetNameVersion).then(function () {
          $scope.viewWidgetVars = {
            // Create your translating static string variables here
          };
        });
      } else {
        $timeout(function () {
          $scope.cancel();
        });
      }
    }

    /*
     * This method loads all initial attributes and lists.
     */
    function loadAttributes() {
      $scope.pickListFields = [];
      $scope.iconFields = [];
      var entity = new Entity($scope.config.resource);
      entity.loadFields().then(function () {
        $scope.fieldsArray = entity.getFormFieldsArray();
        $scope.pickListFields = _.filter($scope.fieldsArray, function (field) {
          return field.type === 'picklist' && field.options;
        });
        // $scope.iconFields = _.filter($scope.fieldsArray, function (field) {
        //   return field.type === 'lookup';
        // });
        // $scope.userField = _.filter($scope.fieldsArray, function (field) {
        //   return field.type !== 'manyToMany' && field.model === 'people';
        // });
        if ($scope.config.pickListField) {
          getPicklistItems();
        }
        $scope.titleFields = _.filter($scope.fieldsArray, function (field) {
          return field.type === 'text';
        });
        $scope.fields = entity.getFormFields();
        angular.extend($scope.fields, entity.getRelationshipFields());
      });
    }

    function onChangeModuleType() {
      delete $scope.config.query;
      delete $scope.config.customModuleField;
      delete $scope.config.customModule;
    }

    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();
      // To Do: Move this call to service
      $http.get('widgets/installed/dataVisualization-1.0.0/widgetAssets/json/vizTypes.json').then(function (response) {
        $scope.config.vizList = response.data.vizTypes;
      });
      appModulesService.load(true).then(function (modules) {
        $scope.modules = modules;
      });
    }

    init();

    function cancel() {
      $uibModalInstance.dismiss('cancel');
    }

    function save() {
      if ($scope.editDataVisualizationForm.$invalid) {
        $scope.editDataVisualizationForm.$setTouched();
        $scope.editDataVisualizationForm.$focusOnFirstError();
        return;
      }
      $uibModalInstance.close($scope.config);
    }

  }
})();
