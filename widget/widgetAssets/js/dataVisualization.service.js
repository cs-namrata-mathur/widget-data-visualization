/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
'use strict';

(function () {
    angular
        .module('cybersponse')
        .factory('dataVisualizationService', dataVisualizationService);

    dataVisualizationService.$inject = ['$q', '$http', 'Query', 'API', 'WIDGET_BASE_PATH'];

    function dataVisualizationService($q, $http, Query, API, WIDGET_BASE_PATH) {
        var service;
        var config;
        var fileCount = 0;
        var fileLoadDefer = $q.defer();

        service = {
            loadJs: loadJs,
            fetchLiveData: fetchLiveData,
            fetchStaticData: fetchStaticData,
            loadVisualizationType: loadVisualizationType,
            getDateFormat: getDateFormat
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

        function fetchStaticData(_config) {
            config = _config;
            let resource = config.resource;
            var defer = $q.defer();
            var queryObject = {};
            let dataFilters = config.query.filters ? angular.copy(config.query.filters) : {};
            queryObject['filters'] = dataFilters;
            var _queryObj = new Query(queryObject);
            $http.post(API.QUERY + resource + '?$limit=30', _queryObj.getQuery(true)).then(function (response) {
                defer.resolve(response.data);
            }, function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function fetchLiveData(_config) {
            config = _config;
            let resource = config.resource;
            var defer = $q.defer();

            var queryObject = {
                sort: [],
                aggregates: [],
                relationship: true
            };

            switch (config.vizType) {
                case 'sunburst':
                case 'treemap': 
                {
                    queryObject.sort.push({
                        field: config.sunTree.mappingLevel[0] + '.orderIndex',
                        direction: 'ASC'
                    });
                    queryObject.aggregates.push({
                        operator: 'count',
                        field: '*',
                        alias: 'total'
                    });
                    queryObject.aggregates.push({
                        operator: 'groupby',
                        alias: 'orderIndex',
                        field: config.sunTree.mappingLevel[0] + '.orderIndex'
                    });
                    (config.sunTree.mappingLevel).forEach((level, index) => {
                        queryObject.aggregates.push({
                            operator: 'groupby',
                            alias: level,
                            field: level + '.itemValue'
                        });
                        queryObject.aggregates.push({
                            operator: 'groupby',
                            alias: 'l' + index + 'Color',
                            field: level + '.color'
                        });
                    });
                }
                    break;
                case 'wordCloud':
                    {
                        queryObject.aggregates.push({
                            operator: 'count',
                            field: '*',
                            alias: 'value'
                        });
                        queryObject.aggregates.push({
                            operator: 'groupby',
                            alias: 'name',
                            field: config.wordCloud.wordSource + '.itemValue'
                        });
                    }
                    break;
                case 'heatMap':
                    {
                        queryObject.aggregates.push({
                            operator: 'count',
                            field: '*',
                            alias: 'total'
                        });
                        queryObject.aggregates.push({
                            operator: 'groupby',
                            alias: config.heatMap.xAxis,
                            field: config.heatMap.xAxis + '.itemValue'
                        });
                        queryObject.aggregates.push({
                            operator: 'groupby',
                            alias: config.heatMap.yAxis,
                            field: config.heatMap.yAxis + '.itemValue'
                        });
                    }
                    break;
            }

            let dataFilters = config.query.filters ? angular.copy(config.query.filters) : {};
            queryObject['filters'] = dataFilters;
            var _queryObj = new Query(queryObject);
            $http.post(API.QUERY + resource + '?$limit=2147483647', _queryObj.getQuery(true)).then(function (response) {
                defer.resolve(response.data);
            }, function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function loadVisualizationType() {
            return $http.get(`${WIDGET_BASE_PATH.INSTALLED}dataVisualization-1.0.0/widgetAssets/json/vizTypes.json`);
        }

        function getDateFormat(timeScope) {
            var format;
            switch (timeScope) {
                case 'day':
                format = 'yyyy-MM-dd';
                break;

                default:
                case 'month':
                format = 'yyyy-MM-01';
                break;
            }

            return format;
        }

        return service;
    }
})();
