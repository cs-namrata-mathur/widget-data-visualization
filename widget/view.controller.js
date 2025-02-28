/* Copyright start 
  MIT License 
  Copyright (c) 2025 Fortinet Inc 
  Copyright end */
'use strict';
(function () {
  angular
    .module('cybersponse')
    .controller('dataVisualization100Ctrl', dataVisualization100Ctrl);

  dataVisualization100Ctrl.$inject = ['$scope', 'widgetUtilityService', 'config', '$timeout', 'dataVisualizationService', 'Entity', 'dataVisualization_VIZ_MAP_TYPES'];

  function dataVisualization100Ctrl($scope, widgetUtilityService, config, $timeout, dataVisualizationService, Entity, dataVisualization_VIZ_MAP_TYPES) {

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
      $scope.myChart = echarts.init($scope.chartDom, null, {
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
      if ([dataVisualization_VIZ_MAP_TYPES.WORD_CLOUD, dataVisualization_VIZ_MAP_TYPES.HEAT_MAP].indexOf(config.vizType) > -1) {
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
      else if ($scope.config.vizType === dataVisualization_VIZ_MAP_TYPES.TREE_MAP) {
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

    /**
     * @description this function converts epoch time to Month Year of Month Day format as per user selection
     * 
     * @param {any} rawData this is a array of objects where every object has 1/2 keys have value epoch time
     * @param {any} heatMapConfig this parameter is used to update xAxis & yAxis data
     * @param {any} axis it could be either 'xAxis' or 'yAxis'
     */
    function _updateEpochToDate(rawData, heatMapConfig, axis) {
      rawData.forEach(data => {
        let dateToConvert, tempDate;
        // Convert date to Month Year format
        if(_config.heatMap[axis].dateFormat === '%b %y') {
          dateToConvert = new Date(data[_config.heatMap[axis].field] * 1000);
          tempDate = dateToConvert.toLocaleString('default', { month: 'short' }).substring(0, 3) + ' ' + dateToConvert.getFullYear();
          if (heatMapConfig[axis].indexOf(tempDate) === -1) {
            heatMapConfig[axis].push(tempDate);
          }
        } else if (_config.heatMap[axis].dateFormat === '%b %e') {
          // Convert date to Month Day Format
          dateToConvert = new Date(data[_config.heatMap[axis].field] * 1000);
          tempDate = dateToConvert.toLocaleString('default', { month: 'short' }).substring(0, 3) + ' ' + dateToConvert.getDate();
          if (heatMapConfig[axis].indexOf(tempDate) === -1) {
            heatMapConfig[axis].push(tempDate);
          }
        }
        data[_config.heatMap[axis].field] = tempDate;
      });
    }

    /**
     * @description this function adds up the total of objects having same xAxis & yAxis values
     * 
     * @param {any} rawData this is a array of object
     * @returns  array of object with collaborative total of objects having same xAxis & yAxis values
    */
    function _constructHeatmapDatetimeData(rawData) {
      const map = new Map();
      let xAxisField = _config.heatMap.xAxis.field;
      let yAxisField = _config.heatMap.yAxis.field;

      rawData.forEach((data) => {
          const key = `${data[xAxisField]}-${data[yAxisField]}`;
          if (map.has(key)) {
              map.get(key).total += data.total;
          } else {
            let template = {};
            template[xAxisField] = data[xAxisField];
            template[yAxisField] = data[yAxisField];
            template.total = data.total;
            map.set(key, template);
          }
      });

      return Array.from(map.values());
    }

    function renderHeatmap(rawData) {
      let heatMapConfig = {
        moduleName: '',
        xAxis: [],
        yAxis: [],
        data: []
      };
      let entity = new Entity($scope.config.resource);
      entity.loadFields().then(function() {
        $scope.fields = entity.getFormFields();
        heatMapConfig.moduleName = entity.descriptions.plural ? entity.descriptions.plural : entity.descriptions.singular;
        if ($scope.fields[_config.heatMap.xAxis.field] && ('picklist' === $scope.fields[_config.heatMap.xAxis.field].type)) {
          ($scope.fields[_config.heatMap.xAxis.field].options).forEach(option => {
            heatMapConfig.xAxis.push(option.itemValue);
          });
        } else if ($scope.fields[_config.heatMap.xAxis.field] && ('datetime' === $scope.fields[_config.heatMap.xAxis.field].type)) {
          _updateEpochToDate(rawData, heatMapConfig, 'xAxis');
        }
        if ($scope.fields[_config.heatMap.yAxis.field] && ('picklist' === $scope.fields[_config.heatMap.yAxis.field].type)) {
          ($scope.fields[_config.heatMap.yAxis.field].options).forEach(option => {
            heatMapConfig.yAxis.push(option.itemValue);
          });
        } else if ($scope.fields[_config.heatMap.yAxis.field] && ('datetime' === $scope.fields[_config.heatMap.yAxis.field].type)) {
          _updateEpochToDate(rawData, heatMapConfig, 'yAxis');
        }
        let max = 0;
        let formedData = rawData;
        if (_config.heatMap.xAxis.dateField || _config.heatMap.yAxis.dateField) {
          formedData = _constructHeatmapDatetimeData(rawData);
        }
        heatMapConfig.data = formedData.map(function(data) {
          max = data['total'] > max ? data['total'] : max;
          return [heatMapConfig.xAxis.indexOf(data[_config.heatMap.xAxis.field]), heatMapConfig.yAxis.indexOf(data[_config.heatMap.yAxis.field]), data['total'] || '-'];
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
            data: heatMapConfig.xAxis,
            splitArea: {
              show: true
            }
          },
          yAxis: {
            type: 'category',
            data: heatMapConfig.yAxis,
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
              name: heatMapConfig.moduleName,
              type: 'heatmap',
              data: heatMapConfig.data,
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
        case dataVisualization_VIZ_MAP_TYPES.TREE_MAP:
          renderTreemapData(formedData);
          break;
        case dataVisualization_VIZ_MAP_TYPES.SUNBURST:
          renderSunburst(formedData);
          break;
        case dataVisualization_VIZ_MAP_TYPES.WORD_CLOUD:
          renderWordCloud(formedData);
          break;
        case dataVisualization_VIZ_MAP_TYPES.HEAT_MAP: 
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
