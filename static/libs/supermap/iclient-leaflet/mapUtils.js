/*eslint-disable*/
/**
 * 二维leaflet工具类
 */
import {tiledMapLayer} from '@supermap/iclient-leaflet';
import measure from './utils/measure'
import query from './utils/query'
import themeLayer from './utils/themeLayer'
import {init} from './utils/plot'

export default {
  measure,
  query,
  themeLayer,
  /**
   * 初始化地图
   * @returns {*}
   */
  initMap (cfg) {
    // SuperMap.SecurityManager.destroyToken(conf.tokenMapUrl);
    // SuperMap.SecurityManager.registerToken(conf.tokenMapUrl, "ikdd9qBASQK_zTWmV2HlQmkieb5ejPFqY56RPYCVi8rmXLsLuAj81PlFWQadn_qp86ldSPgcQws7KJjFd_reFw..");
    return L.map('map2d', {
      // crs: cfg.crs,
      center: cfg.center,
      maxZoom: cfg.maxZoom,
      zoom: cfg.zoom,
      attributionControl: false
    })
  },

  /**
   * 地图 marker
   * @param cfg
   */
  icon (cfg) {
    return L.icon({
      iconUrl: cfg.url,
      iconSize: cfg.iconSize || [38, 95]
    })
  },

  /**
   * 添加 marker
   * @param cfg
   */
  addMarker (cfg) {
    if (this.verifyCfg(cfg, 'addMarker')) {
      return L.marker(cfg.position, {
        icon: cfg.icon,
        id: cfg.id
      }).addTo(cfg.layerGroup)
    } else {
      console.log('参数不完整！')
    }
  },
  /**
   * 获取 marker
   * @param cfg
   */
  getMarker (cfg) {
    if (this.verifyCfg(cfg, 'getMarker')) {
      cfg.layerGroup.eachLayer(function (layer) {
        if (layer.options.id === cfg.id) {
          if (cfg.callback) {
            cfg.callback(layer)
          }
          return layer
        }
      })
    }
  },

  /**
   * 添加 marker
   * @param cfg
   */
  addLayer (cfg) {
    if (this.verifyCfg(cfg, 'addLayer')) {
      cfg.layerGroup.clearLayers()
      tiledMapLayer(cfg.url).addTo(cfg.layerGroup)
    }
  },

  /**
   * 添加 图层
   * @param cfg
   */
  addLayerGroups (cfg) {
    if (this.verifyCfg(cfg, 'addLayerGroups')) {
      cfg.layerGroup.clearLayers()
      tiledMapLayer(cfg.url, { cacheEnabled: false, layersID: cfg.layersID }).addTo(cfg.layerGroup)
    }
  },

  /**
   * 切换底图
   * @param cfg
   */
  setBaseMap (cfg) {
    if (this.verifyCfg(cfg, 'setBaseMap')) {
      cfg.layerGroup.clearLayers()
      tiledMapLayer(cfg.url, { id: cfg.id, prjCoordSys: cfg.prjCoordSys }).addTo(cfg.layerGroup)
    }
  },

  /**
   * 切换底图
   * @param cfg
   */
  setBaseOnlineMap (cfg) {
    if (this.verifyCfg(cfg, 'setBaseOnlineMap')) {
      cfg.layerGroup.clearLayers()
      switch (cfg.id) {
        case 'gnm':
          L.tileLayer.chinaProvider('Google.Normal.Map', {
            id: cfg.id,
            prjCoordSys: cfg.prjCoordSys
          }).addTo(cfg.layerGroup)
          break
        case 'gsm':
          L.tileLayer.chinaProvider('Google.Satellite.Map', {
            id: cfg.id,
            prjCoordSys: cfg.prjCoordSys
          }).addTo(cfg.layerGroup)
          break
        case 'tnm':
          L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
            id: cfg.id,
            prjCoordSys: cfg.prjCoordSys
          }).addTo(cfg.layerGroup)
          break
        case 'tsm':
          L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
            id: cfg.id,
            prjCoordSys: cfg.prjCoordSys
          }).addTo(cfg.layerGroup)
          break
        case 'ttm':
          L.tileLayer.chinaProvider('TianDiTu.Terrain.Map', {
            id: cfg.id,
            prjCoordSys: cfg.prjCoordSys
          }).addTo(cfg.layerGroup)
          break
        case 'gdnm':
          L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
            id: cfg.id,
            prjCoordSys: cfg.prjCoordSys
          }).addTo(cfg.layerGroup)
          break
        case 'gdsm':
          L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
            id: cfg.id,
            prjCoordSys: cfg.prjCoordSys
          }).addTo(cfg.layerGroup)
          break
        case 'geonm':
          L.tileLayer.chinaProvider('Geoq.Normal.Map', {
            id: cfg.id,
            prjCoordSys: cfg.prjCoordSys
          }).addTo(cfg.layerGroup)
          break
        case 'geonw':
          L.tileLayer.chinaProvider('Geoq.Normal.Warm', {
            id: cfg.id,
            prjCoordSys: cfg.prjCoordSys
          }).addTo(cfg.layerGroup)
          break
      }
    }
  },

  /**
   * 验证必填项
   */
  verifyCfg (cfg, fnc) {
    let isVerifyPass = true
    switch (fnc) {
      case 'addMarker':
        if (!cfg.id || !cfg.position) {
          isVerifyPass = false
        }
        break
      case 'getMarker':
        if (!cfg.id || !cfg.layerGroup) {
          isVerifyPass = false
        }
        break
      case 'addLayer':
        if (!cfg.url || !cfg.layerGroup) {
          isVerifyPass = false
        }
        break
      case 'addLayerGroups':
        if (!cfg.url || !cfg.layerGroup) {
          isVerifyPass = false
        }
        break
      case 'setBaseMap':
        if (!cfg.url || !cfg.id || !cfg.layerGroup) {
          isVerifyPass = false
        }
        break
      case 'setBaseOnlineMap':
        if (!cfg.id || !cfg.layerGroup) {
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
