/* eslint-disable */
/**
 * 地图（数据）查询功能 leaflet
 * @author
 * 2016.8.9
 */
define(function (require, exports, module) {

  let query = {};

  /**
   * 数据服务查询
   * @param cfg
   */
  query.queryBySql = function (cfg) {
    if (query.verifyCfg(cfg, 'queryBySql')) {
      let sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: {
          name: cfg.dataSetName + "@" + cfg.dataSourceName,
          attributeFilter: cfg.sql,
        },
        datasetNames: [cfg.dataSourceName + ":" + cfg.dataSetName],
        toIndex: -1
      });
      L.supermap
        .featureService(cfg.url)
        .getFeaturesBySQL(sqlParam, cfg.success);
    } else {
      console.log("参数不完整")
    }
  };

  /**
   * 缓冲区查询
   * @param cfg
   */
  query.queryByBuffer = function (cfg) {
    if (query.verifyCfg(cfg, 'queryByBuffer')) {
      let bufferParam = new SuperMap.GetFeaturesByBufferParameters({
        datasetNames: [cfg.dataSourceName + ":" + cfg.dataSetName],
        bufferDistance: 0.001,
        geometry: cfg.geometry,
        toIndex: -1
      });
      L.supermap
        .featureService(cfg.url)
        .getFeaturesByBuffer(bufferParam, cfg.success);
    }
  };

  /**
   * 地图距离查询
   * @param cfg
   */
  query.queryByDistance = function (cfg) {
    if (query.verifyCfg(cfg, 'queryByDistance')) {
      let param = new SuperMap.QueryByDistanceParameters({
        queryParams: cfg.queryParams,
        distance: 0.0001,
        geometry: cfg.geometry,
      });
      L.supermap
        .queryService(cfg.url)
        .queryByDistance(param, cfg.success);
    }
  };

  /**
   * 查询所有图层
   * @param cfg
   */
  query.querySpecialLayers = function (cfg) {
    if (query.verifyCfg(cfg, 'querySpecialLayers')) {
      L.supermap
        .layerInfoService(cfg.url)
        .getLayersInfo(cfg.success);
    }
  };

  /**
   * 验证必填项
   */
  query.verifyCfg = function (cfg, fnc) {
    let isVerifyPass = true;
    switch (fnc) {
      case 'queryBySql':
        if (!cfg['url'] || !cfg['dataSetName'] || !cfg['dataSourceName'] || !cfg['success']) {
          isVerifyPass = false;
        }
        break;
      case 'queryByBuffer':
        if (!cfg['url'] || !cfg['dataSetName'] || !cfg['dataSourceName'] || !cfg['success'] || !cfg['geometry']) {
          isVerifyPass = false;
        }
        break;
      case 'queryByDistance':
        if (!cfg['url'] || !cfg['queryParams'] || !cfg['success'] || !cfg['geometry']) {
          isVerifyPass = false;
        }
        break;
      case 'querySpecialLayers':
        if (!cfg['url'] || !cfg['success']) {
          isVerifyPass = false;
        }
        break;
      default:
        isVerifyPass = true;
        break;
    }
    return isVerifyPass;
  };
  module.exports = query;
});
