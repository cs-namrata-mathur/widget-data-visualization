/* Copyright start
  MIT License
  Copyright (c) 2025 Fortinet Inc
  Copyright end */
  'use strict';

(function() {
  angular
    .module('cybersponse')
    .constant('dataVisualization_VIZ_MAP_TYPES', { 
      'HEAT_MAP': 'heatMap',
      'SUNBURST': 'sunburst',
      'TREE_MAP': 'treemap',
      'WORD_CLOUD': 'wordCloud'
    });
})();