/**
 * 地图（数据）查询功能 leaflet
 * @author
 * 2016.8.9
 */
export default {
  /**
   * 数据服务查询
   * @param cfg
   */
  queryBySql (cfg) {
    if (this.verifyCfg(cfg, 'queryBySql')) {
      // eslint-disable-next-line no-undef
      const sqlParam = new SuperMap.GetFeaturesBySQLParameters({
        queryParameter: {
          name: cfg.dataSetName + '@' + cfg.dataSourceName,
          attributeFilter: cfg.sql
        },
        datasetNames: [cfg.dataSourceName + ':' + cfg.dataSetName],
        toIndex: -1
      })
      // eslint-disable-next-line no-undef
      L.supermap
        .featureService(cfg.url)
        .getFeaturesBySQL(sqlParam, cfg.success)
    } else {
      // eslint-disable-next-line no-console
      console.log('参数不完整')
    }
  },

  /**
   * 缓冲区查询
   * @param cfg
   */
  queryByBuffer (cfg) {
    if (this.verifyCfg(cfg, 'queryByBuffer')) {
      // eslint-disable-next-line no-undef
      const bufferParam = new SuperMap.GetFeaturesByBufferParameters({
        datasetNames: [cfg.dataSourceName + ':' + cfg.dataSetName],
        bufferDistance: 0.001,
        geometry: cfg.geometry,
        toIndex: -1
      })
      // eslint-disable-next-line no-undef
      L.supermap
        .featureService(cfg.url)
        .getFeaturesByBuffer(bufferParam, cfg.success)
    }
  },

  /**
   * 地图距离查询
   * @param cfg
   */
  queryByDistance (cfg) {
    if (this.verifyCfg(cfg, 'queryByDistance')) {
      // eslint-disable-next-line no-undef
      const param = new SuperMap.QueryByDistanceParameters({
        queryParams: cfg.queryParams,
        distance: 0.0001,
        geometry: cfg.geometry
      })
      // eslint-disable-next-line no-undef
      L.supermap
        .queryService(cfg.url)
        .queryByDistance(param, cfg.success)
    }
  },

  /**
   * 查询所有图层
   * @param cfg
   */
  querySpecialLayers (cfg) {
    if (this.verifyCfg(cfg, 'querySpecialLayers')) {
      // eslint-disable-next-line no-undef
      L.supermap
        .layerInfoService(cfg.url)
        .getLayersInfo(cfg.success)
    }
  },

  /**
   * 验证必填项
   */
  verifyCfg (cfg, fnc) {
    let isVerifyPass = true
    switch (fnc) {
      case 'queryBySql':
        if (!cfg.url || !cfg.dataSetName || !cfg.dataSourceName || !cfg.success) {
          isVerifyPass = false
        }
        break
      case 'queryByBuffer':
        if (!cfg.url || !cfg.dataSetName || !cfg.dataSourceName || !cfg.success || !cfg.geometry) {
          isVerifyPass = false
        }
        break
      case 'queryByDistance':
        if (!cfg.url || !cfg.queryParams || !cfg.success || !cfg.geometry) {
          isVerifyPass = false
        }
        break
      case 'querySpecialLayers':
        if (!cfg.url || !cfg.success) {
          isVerifyPass = false
        }
        break
      default:
        isVerifyPass = true
        break
    }
    return isVerifyPass
  }
}
