/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';

(function () {
    angular
        .module('cybersponse')
        .factory('dataVisualizationService', dataVisualizationService);

    dataVisualizationService.$inject = ['$q', '$http', 'currentDateMinusService', 'Query', 'API', 'Entity'];

    function dataVisualizationService($q, $http, currentDateMinusService, Query, API, Entity) {
        var service;
        var config;
        var fileCount = 0;
        var fileLoadDefer = $q.defer();

        service = {
            loadJs: loadJs,
            fetchData: fetchData
        };

        // Load CDN JS files
        function loadJs(fileList) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = fileList[fileCount];
            document.getElementsByTagName('head')[0].appendChild(script);
            script.onload = function () {
                if (fileCount === fileList.length - 1) {
                    fileLoadDefer.resolve();
                } else {
                    fileCount++;
                    loadJs(fileList).then(function () {
                    });
                }
            }
            return fileLoadDefer.promise;
        }

        function fetchData(_config) {
            config = _config;
            let resource = config.resource;
            var defer = $q.defer();

            var queryObject = {
                sort: [{
                    field: config.l1PickListField + '.orderIndex',
                    direction: 'ASC'
                }],
                aggregates: [
                    {
                        'operator': 'count',
                        'field': '*',
                        'alias': 'total'
                    }
                ],
                relationship: true
            };
            // Push level 1 picklist in aggregation
            queryObject.aggregates.push({
                'operator': 'groupby',
                'alias': config.l1PickListField,
                'field': config.l1PickListField + '.itemValue'
            });
            queryObject.aggregates.push({
                'operator': 'groupby',
                'alias': 'l1Color',
                'field': config.l1PickListField + '.color'
            });
            queryObject.aggregates.push({
                'operator': 'groupby',
                'alias': 'orderIndex',
                'field': config.l1PickListField + '.orderIndex'
            });
            // Push level 2 picklist in aggregation
            queryObject.aggregates.push({
                'operator': 'groupby',
                'alias': config.l2PickListField,
                'field': config.l2PickListField + '.itemValue'
            });
            queryObject.aggregates.push({
                'operator': 'groupby',
                'alias': 'l2Color',
                'field': config.l2PickListField + '.color'
            });
            // Push level 3 picklist in aggregation
            queryObject.aggregates.push({
                'operator': 'groupby',
                'alias': config.l3PickListField,
                'field': config.l3PickListField + '.itemValue'
            });
            queryObject.aggregates.push({
                'operator': 'groupby',
                'alias': 'l3Color',
                'field': config.l3PickListField + '.color'
            });

            let dataFilters = config.query.filters ? angular.copy(config.query.filters) : {};
            queryObject["filters"] = dataFilters;// [dataFilters];
            var _queryObj = new Query(queryObject);
            $http.post(API.QUERY + resource + '?$limit=2147483647', _queryObj.getQuery(true)).then(function (response) {
                // return response;
                defer.resolve(response.data);
            }, function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        return service;
    }
})();
