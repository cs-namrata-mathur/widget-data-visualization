/* Copyright start 
  MIT License 
  Copyright (c) 2025 Fortinet Inc 
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('dataVisualization100Ctrl', dataVisualization100Ctrl);

  dataVisualization100Ctrl.$inject = ['$scope', 'widgetUtilityService', 'config', '$timeout', 'dataVisualizationService', 'Entity', 'CommonUtils'];

  function dataVisualization100Ctrl($scope, widgetUtilityService, config, $timeout, dataVisualizationService, Entity, CommonUtils) {

    $scope.config = config;
    var _config = angular.copy(config);

    function _handleTranslations() {
      widgetUtilityService.checkTranslationMode($scope.$parent.model.type).then(function () {
        $scope.viewWidgetVars = {
          // Create your translating static string variables here
        };
      });
    }

    function initializeChart() {
      $scope.height = angular.element(document.getElementById('eChart-' + $scope.config.wid))[0].clientWidth;
      angular.element(document.getElementById('eChart-' + $scope.config.wid)).attr('style', 'position: relative; max-height: 700px; height:' + $scope.height + 'px;');
      // Dispose already rendered chart if available
      $scope.myChart && echarts.dispose($scope.myChart);
      $scope.chartDom = angular.element(document.getElementById('eChart-' + $scope.config.wid))[0];
      $scope.myChart = echarts.init($scope.chartDom, 'dark', {
        renderer: 'canvas',
        useDirtyRect: false
      });
      $scope.option = undefined;
      setFilter();
      if ($scope.config.moduleType === 'Single Module') {
        processStaticChartData();
      } else {
        processLiveChartData();
      }
    }

    function processLiveChartData() {
      dataVisualizationService.fetchLiveData(_config).then(function (result) {
        if (result && result['hydra:member']) {
          if (result['hydra:member'].length === 0) {
            errorMessage = 'No records found!';
            renderNoRecordMessage();
          }
          else {
            formMapData(result['hydra:member']);
          }
        }
      }).catch(function(error) {
        console.log(error);
      });
    }

    function processStaticChartData() {
      dataVisualizationService.fetchStaticData(_config).then(function (result) {
        if (result && result['hydra:member']) {
          if (result['hydra:member'].length === 0) {
            errorMessage = 'No records found!';
            renderNoRecordMessage();
          }
          else {
            var data = result['hydra:member'][0][$scope.config.objectField];
            if (!data) {
              data = {};
            } else {
              renderSelectedChart(data);
            }
          }
        }
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

    function _createNestedObject(obj, record, keys) {
      let current = obj;
      for (const key of keys) {
        if (!current[record[key]]) {
          current[record[key]] = {};
        }
        current[record[key]]['$count'] = current[record[key]]['$count'] ? current[record[key]]['$count'] + record.total : record.total;
        current = current[record[key]]; 
      }
      return obj;
    }

    function formMapData(data) {
      const inputJSON = {
        'mapData': data
      }

      let formedData;
      if (['wordCloud', 'heatMap'].indexOf(config.vizType) > -1) {
         formedData = data;
      } else {
        // Form Data for Map Rendering
        formedData = inputJSON.mapData.reduce((obj, record) => {
          obj = _createNestedObject(obj, record, $scope.config.sunTree.mappingLevel);

          return obj;
        }, {});
      }

      renderSelectedChart(formedData);
    }

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
      }
      else if ($scope.config.vizType === 'treemap') {
       target.children.push({
         name: basePath,
         value: source.$count
       });
      }
    }

    function renderSunburst(rawData) {
      const data = {
        children: []
      };
      convert(rawData, data, '');
      data.children = data.children.filter(children => children.name !== '');
      $scope.option = {
        textStyle: {
          overflow: 'break'
        },
        series: {
          type: 'sunburst',
          height: '80%',
          width: '80%',
          data: data.children,
          label: {
            rotate: 'tangential', // 'tangential', // 'radial'
            formatter: '{b}\n\n{c}',
            //position: 'inside',
            overflow: 'breakAll', // 'brake',
            ellipsis: '...'
            // align: 'center'
          },
          labelLayout: { hideOverlap: true },
          // emphasis: {
          //   label: {
          //     formatter: '\n{b}\n\n{c}'
          //   }
          // },
          // downplay: {
          //   label: {
          //     formatter: '\n{b}\n\n{c}'
          //   }
          // }
        }
      };

      $scope.option && $scope.myChart.setOption($scope.option);
      $scope.generatingChart = false;
    }

    function renderTreemapData(rawData) {
      const data = {
        children: []
      };
      convert(rawData, data, '');
      data.children = data.children.filter(children => children.name !== '');
      $scope.myChart.setOption(
        ($scope.option = {
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
      $scope.generatingChart = false;
    }

    function renderWordCloud(rawData) {
      // Configure the chart
      $scope.option = {
        title: {
          text: $scope.config.title,
          left: 'center'
        },
        tooltip: {
          show: true
        },
        series: [{
          type: 'wordCloud',
          shape: 'circle', // Shapes: 'circle', 'cardioid', 'diamond', 'triangle-forward', etc.
          sizeRange: [12, 50], // Font size range
          rotationRange: [-90, 90], // Rotation range of words
          textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
              ].join(',') + ')';
            }
          },
          data: rawData
        }]
      };

      // Render the chart
      $scope.option && $scope.myChart.setOption($scope.option);
      $scope.generatingChart = false;
    }

    function renderHeatmap(rawData) {
      let heatMap = {
        moduleName: '',
        xAxis: [],
        yAxis: [],
        data: []
      };
      let entity = new Entity($scope.config.resource);
      entity.loadFields().then(function() {
        $scope.fields = entity.getFormFields();
        heatMap.moduleName = entity.descriptions.plural ? entity.descriptions.plural : entity.descriptions.singular;
        if ($scope.fields[_config.heatMap.xAxis] && ('picklist' === $scope.fields[_config.heatMap.xAxis].type)) {
          ($scope.fields[_config.heatMap.xAxis].options).forEach(option => {
            heatMap.xAxis.push(option.itemValue);
          });
        } else if ($scope.fields[_config.heatMap.xAxis] && ('datetime' === $scope.fields[_config.heatMap.xAxis].type)) {

        }
        if ($scope.fields[_config.heatMap.yAxis] && ('picklist' === $scope.fields[_config.heatMap.yAxis].type)) {
          ($scope.fields[_config.heatMap.yAxis].options).forEach(option => {
            heatMap.yAxis.push(option.itemValue);
          });
        } else if ($scope.fields[_config.heatMap.yAxis] && ('datetime' === $scope.fields[_config.heatMap.yAxis].type)) {

        }
        let max = 0;
        heatMap.data = rawData.map(function(data) {
          max = data['total'] > max ? data['total'] : max;
          return [heatMap.xAxis.indexOf(data[_config.heatMap.xAxis]), heatMap.yAxis.indexOf(data[_config.heatMap.yAxis]), data['total'] || '-'];
        });

        $scope.option = {
          tooltip: {
            position: 'top'
          },
          grid: {
            height: '50%',
            top: '10%'
          },
          xAxis: {
            type: 'category',
            data: heatMap.xAxis,
            splitArea: {
              show: true
            }
          },
          yAxis: {
            type: 'category',
            data: heatMap.yAxis,
            splitArea: {
              show: true
            }
          },
          visualMap: {
            min: 0,
            max: max,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
          },
          series: [
            {
              name: heatMap.moduleName,
              type: 'heatmap',
              data: heatMap.data,
              label: {
                show: true
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };

        $scope.option && $scope.myChart.setOption($scope.option);
        $scope.generatingChart = false;
      });
    }

    function renderSelectedChart(formedData) {
      switch ($scope.config.vizType) {
        case 'treemap':
          renderTreemapData(formedData);
          break;
        case 'sunburst':
          renderSunburst(formedData);
          break;
        case 'wordCloud':
          renderWordCloud(formedData);
          break;
        case 'heatMap': 
          renderHeatmap(formedData);
          break;
      }
    }

    $scope.init = function() {
      // To handle backward compatibility for widget
      _handleTranslations();

      let loader = window.AMDLoader; // copied the amd loader properties 
      let define = window.define;
      window.AMDLoader = {};
      window.define = {};
      $scope.generatingChart = true;
      dataVisualizationService.loadJs(['https://cdnjs.cloudflare.com/ajax/libs/echarts/5.6.0/echarts.min.js', 'https://cdn.jsdelivr.net/npm/echarts-wordcloud/dist/echarts-wordcloud.min.js', 'https://cdn.jsdelivr.net/npm/echarts-gl/dist/echarts-gl.min.js']).then(function () {
        $timeout(function() {
          window.AMDLoader = loader;
          window.define = define;
          initializeChart();
        }, 1000);
      });
    }

    $scope.init();
  }
})();
