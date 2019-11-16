/* eslint-disable */
/**
 * 二维leaflet工具类
 */
define(function (require, exports, module) {
  let utils = {};
  utils.query = require('./utils/query.js');
  utils.theme = require('./utils/themeLayer.js');

  /**
   * 初始化地图
   * @returns {*}
   */
  function initMap(cfg) {
    let baseMap = L.map('map2d', {
      crs: cfg.crs,
      center: cfg.center,
      maxZoom: cfg.maxZoom,
      zoom: cfg.zoom,
      attributionControl: false
    });
    //SuperMap.SecurityManager.destroyToken(conf.tokenMapUrl);
    //SuperMap.SecurityManager.registerToken(conf.tokenMapUrl, "ikdd9qBASQK_zTWmV2HlQmkieb5ejPFqY56RPYCVi8rmXLsLuAj81PlFWQadn_qp86ldSPgcQws7KJjFd_reFw..");
    L.supermap.tiledMapLayer(cfg.url, {id: cfg.layerId}).addTo(baseMap);
    return baseMap;
  }

  /**
   * 地图 marker
   * @param cfg
   */
  utils.icon = function (cfg) {
    return L.icon({
      iconUrl: cfg.url,
      iconSize: cfg.iconSize || [38, 95],
    });
  };
  /**
   * 添加 marker
   * @param cfg
   */
  /* utils.addMarker = function(cfg){
     if (utils.verifyCfg(cfg, 'addMarker')) {
       let layer = L.marker(cfg.position, {icon: cfg.icon, id: cfg.markId, county: cfg.county, type: cfg.type}).addTo(map);
     }
   };*/

  /**
   * 添加 marker
   * @param cfg
   */
  utils.addLayer = function (cfg) {
    if (utils.verifyCfg(cfg, 'addLayer')) {
      cfg.layerGroup.clearLayers();
      L.supermap.tiledMapLayer(cfg.url).addTo(cfg.layerGroup);
    }
  };

  /**
   * 添加 marker
   * @param cfg
   */
  utils.addLayerGroups = function (cfg) {
    if (utils.verifyCfg(cfg, 'addLayerGroups')) {
      cfg.layerGroup.clearLayers();
      L.supermap.tiledMapLayer(cfg.url, {cacheEnabled: false, layersID: cfg.layersID}).addTo(cfg.layerGroup);
    }
  };
  /**
   * 验证必填项
   */
  utils.verifyCfg = function (cfg, fnc) {
    let isVerifyPass = true;
    switch (fnc) {
      case 'addMarker':
        if (!cfg.url || !cfg.position) {
          isVerifyPass = false;
        }
        break;
      case 'addLayer':
        if (!cfg.url || !cfg.layerGroup) {
          isVerifyPass = false;
        }
        break;
      case 'addLayerGroups':
        if (!cfg.url || !cfg.layerGroup) {
          isVerifyPass = false;
        }
        break;
      default:
        isVerifyPass = true;
        break;
    }
    return isVerifyPass;
  };


  module.exports = {
    initMap: initMap,
    utils: utils,
  };
});

