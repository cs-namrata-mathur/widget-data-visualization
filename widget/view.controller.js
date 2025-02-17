/* Copyright start
  Copyright (C) 2008 - 2025 Fortinet Inc.
  All rights reserved.
  FORTINET CONFIDENTIAL & FORTINET PROPRIETARY SOURCE CODE
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('dataVisualization100Ctrl', dataVisualization100Ctrl);

  dataVisualization100Ctrl.$inject = ['$scope', 'widgetUtilityService', 'config', '$timeout', '$http', '$q', 'dataVisualizationService'];

  function dataVisualization100Ctrl($scope, widgetUtilityService, config, $timeout, $http, $q, dataVisualizationService) {

    $scope.config = config;
    var _config = angular.copy(config);
    $scope.processing = true;

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
    }

    function initializeChart() {
      $scope.height = angular.element(document.querySelector('#eChart-' + $scope.config.wid))[0].clientWidth;
      angular.element(document.querySelector('#eChart-' + $scope.config.wid)).attr('style', 'position: relative; max-height: 700px; height:' + $scope.height + 'px;');
      // Dispose already rendered chart if available
      $scope.myChart && echarts.dispose($scope.myChart);
      $scope.chartDom = angular.element(document.querySelector('#eChart-' + $scope.config.wid))[0];
      $scope.myChart = echarts.init($scope.chartDom, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      $scope.option = undefined;
      // $scope.viewToggle = false;

      // renderTreemap();
      setFilter();
      dataVisualizationService.fetchData(_config).then(function (result) {
        if (result && result['hydra:member']) {
          if (result['hydra:member'].length === 0) {
            errorMessage = "No records found!";
            renderNoRecordMessage();
          }
          else {
            formMapData(result['hydra:member']);
          }
        }
      }).finally(function () {
        $scope.processing = false;
      });
    }

    /*
     * This method create filter JSON as per selection in configuration to send
     * as a part of request payload.
     */
    var setFilter = function () {
      _config = angular.copy(config);
      var selfFilter = '';
      if ($scope.filterByAssignedToPerson && $scope.filterByMe) {
        selfFilter = {
          field: config.mapping.assignedToPerson,
          operator: 'eq',
          value: localStorageService.get(API.API_3_BASE + API.CURRENT_ACTOR)
        };
      }
      if (config.query.logic === 'OR') {
        _config.query.logic = 'AND';
        _config.query.filters = [];
        if (selfFilter !== '') {
          _config.query.filters.push(selfFilter);
        }
        _config.query.filters.push({
          logic: config.query.logic,
          filters: config.query.filters
        });
      }
      else {
        if (selfFilter !== '') {
          _config.query.filters.push(selfFilter);
        }
      }
    };

    function formMapData(data) {
      // console.log(data);
      const inputJSON = {
        "mapData": data
      }

      // Form Data for Map Rendering
      const formedData = inputJSON.mapData.reduce((obj, record) => {
        // Create Base level object
        const level1 = record[$scope.config.l1PickListField] || 'None';
        if (!obj[level1]) {
          obj[level1] = {};
        }

        // Create next level object if not present
        const level2 = record[$scope.config.l2PickListField] || 'None';
        if (!obj[level1][level2]) {
          obj[level1][level2] = {};
        }

        // Create new level 3 object
        const level3 = record[$scope.config.l3PickListField] || 'None';
        if (!obj[level1][level2][level3]) {
          obj[level1][level2][level3] = {};
        }
        obj[level1][level2][level3]['$count'] = record.total;

        // obj[level1][level2] = { ...obj[level1][level2], ...obj[level1][level2][level3] }
        obj[level1][level2]['$count'] = obj[level1][level2]['$count'] ? (obj[level1][level2]['$count'] + record.total) : record.total;

        obj[level1]['$count'] = obj[level1]['$count'] ? (obj[level1]['$count'] + record.total) : record.total;

        return obj;
      }, {});

      // console.log(formedData);
      if ($scope.config.vizType === 'treemap') {
        renderTreemapData(formedData);
      } else if ($scope.config.vizType === 'sunburst') {
        renderSunburst(formedData);
      }
    }

    function renderSunburst(rawData) {
      function convert(source, target, basePath) {
        for (let key in source) {
          let path = basePath ? basePath + ' > ' + key : key;
          if (!key.match(/^\$/)) {
            target.children = target.children || [];
            const child = {
              name: path
            };
            target.children.push(child);
            convert(source[key], child, path);
          } else {
            target.value = source.$count || 0;
          }
        }
        if (!target.children) {
          target.value = source.$count || 0;
        } else {
          target.children.push({
            name: basePath,
            value: source.$count
          });
        }
      }
      const data = {
        children: []
      };
      convert(rawData, data, '');
      data.children = data.children.filter(children => children.name !== "");
      console.log('---- Converted SunBurst Data-----');
      console.log(data);
      console.log('------------------------');
      $scope.option = {
          // visualMap: {
          //   type: 'continuous',
          //   min: 0,
          //   max: 10,
          //   inRange: {
          //     color: ['#2F93C8', '#AEC48F', '#FFDB5C', '#F98862']
          //   }
          // },
          series: {
            type: 'sunburst',
            // data: data,
            height: "80%",
            width: "80%",
            // data: rawData.data.children,
            data: data.children,
            // radius: [0, '90%'],
            label: {
              rotate: 'tangential', // 'radial'
              formatter: '{b}\n\n{c}'
            },
            labelLayout: { hideOverlap: true },
            emphasis: {
              label: {
                formatter: '\n{b}\n\n{c}'
              }
            },
            downplay: {
              label: {
                formatter: '\n{b}\n\n{c}'
              }
        }
          }
        };

        $scope.option && $scope.myChart.setOption($scope.option);
    }

    function renderTreemapData(rawData) {
      function convert(source, target, basePath) {
        for (let key in source) {
          let path = basePath ? basePath + ' > ' + key : key;
          if (!key.match(/^\$/)) {
            target.children = target.children || [];
            const child = {
              name: path
            };
            target.children.push(child);
            convert(source[key], child, path);
          } else {
            target.value = source.$count || 0;
          }
        }
        if (!target.children) {
          target.value = source.$count || 0;
        } else {
          target.children.push({
            name: basePath,
            value: source.$count
          });
        }
      }
      const data = {
        children: []
      };
      convert(rawData, data, '');
      data.children = data.children.filter(children => children.name !== "");
      console.log('---- Converted Data-----');
      console.log(data);
      console.log('------------------------');
      $scope.myChart.setOption(
        ($scope.option = {
          //title: {
          //  text: 'ECharts Options',
          //  subtext: 'Treemap',
          //  left: 'leafDepth'
          //},
          tooltip: {},
          series: [
            {
              name: 'option',
              type: 'treemap',
              visibleMin: 300,
              data: data.children,
              leafDepth: 2,
              levels: [
                {
                  itemStyle: {
                    borderColor: '#555',
                    borderWidth: 4,
                    gapWidth: 4
                  }
                },
                {
                  colorSaturation: [0.3, 0.6],
                  itemStyle: {
                    borderColorSaturation: 0.7,
                    gapWidth: 2,
                    borderWidth: 2
                  }
                },
                {
                  colorSaturation: [0.3, 0.5],
                  itemStyle: {
                    borderColorSaturation: 0.6,
                    gapWidth: 1
                  }
                },
                {
                  colorSaturation: [0.3, 0.5]
                }
              ]
            }
          ]
        })
      );
      $scope.option && $scope.myChart.setOption($scope.option);
    }

    function renderTreemap() {
      $scope.myChart.showLoading();
      // $.getJSON('widgets/development/customEcharts-1.0.0/widgetAssets/treemapData.json', function (rawData) {
      $http.get('widgets/development/customEcharts-1.0.0/widgetAssets/treemapSOARData.json').then(function (rawData) {
        $scope.myChart.hideLoading();
        function convert(source, target, basePath) {
          for (let key in source) {
            let path = basePath ? basePath + ' > ' + key : key;
            if (!key.match(/^\$/)) {
              target.children = target.children || [];
              const child = {
                name: path
              };
              target.children.push(child);
              convert(source[key], child, path);
            }
          }
          if (!target.children) {
            target.value = source.$count || 1;
          } else {
            target.children.push({
              name: basePath,
              value: source.$count
            });
          }
        }
        const data = {
          children: []
        };
        convert(rawData.data, data, '');
        $scope.myChart.setOption(
          ($scope.option = {
            title: {
              text: 'ECharts Options',
              subtext: 'Treemap',
              left: 'leafDepth'
            },
            tooltip: {},
            series: [
              {
                name: 'option',
                type: 'treemap',
                visibleMin: 300,
                data: data.children,
                leafDepth: 2,
                levels: [
                  {
                    itemStyle: {
                      borderColor: '#555',
                      borderWidth: 4,
                      gapWidth: 4
                    }
                  },
                  {
                    colorSaturation: [0.3, 0.6],
                    itemStyle: {
                      borderColorSaturation: 0.7,
                      gapWidth: 2,
                      borderWidth: 2
                    }
                  },
                  {
                    colorSaturation: [0.3, 0.5],
                    itemStyle: {
                      borderColorSaturation: 0.6,
                      gapWidth: 1
                    }
                  },
                  {
                    colorSaturation: [0.3, 0.5]
                  }
                ]
              }
            ]
          })
        );
      });

      $scope.option && $scope.myChart.setOption($scope.option);
    }



    function init() {
      // To handle backward compatibility for widget
      _handleTranslations();

      let loader = window.AMDLoader; // copied the amd loader properties 
      let define = window.define;
      window.AMDLoader = {};
      window.define = {};
      dataVisualizationService.loadJs(['https://cdnjs.cloudflare.com/ajax/libs/echarts/5.6.0/echarts.min.js', 'https://cdn.jsdelivr.net/npm/echarts-wordcloud/dist/echarts-wordcloud.min.js', 'https://cdn.jsdelivr.net/npm/echarts-gl/dist/echarts-gl.min.js']).then(function () {
        $timeout(function () {
          window.AMDLoader = loader;
          window.define = define;
          // getChartTypes();
          initializeChart();
          // renderChart();
          $scope.processing = false;
        }, 5000);
        // });
      });
    }

    init();
  }
})();
