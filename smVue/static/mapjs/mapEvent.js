/**
 * 地图功能入口
 */
define(function (require, exports, module) {
  let mapEvent = {};
  let service = require("./config"); //加载地图
  let iMap = require("../libs/supermap/iclient-leaflet/mapUtils.js");

  /**
   * 初始化地图
   * @returns {*}
   */
  mapEvent.initMap = function () {
    let cfg = {
      crs: L.CRS.EPSG3857,
      url: service.mapYXUrl,
      center: [34.265538635253906, 108.16653009033203],
      maxZoom: 18,
      zoom: 4,
      layerId: 'yx'
    };
    mapEvent.map = iMap.initMap(cfg);
    iMap.utils.measure.initMeasure(mapEvent.map);
  };

  /**
   * 切换底图
   * @param tag
   */
  mapEvent.changeMap = function (tag) {
    let lNames = ['yx', 'sl', 'gnm', 'gsm', 'gtm', 'tnm', 'tsm', 'ttm', 'gdnm', 'gdsm', 'geonm', 'geotm'];
    mapEvent.map.eachLayer((layer) => {
      lNames.forEach((item) => {
        if (layer.options.id === item) {
          layer.remove();
        }
      });
    });
    switch (tag) {
      case 0:
        L.supermap.tiledMapLayer(service.mapSLUrl, {id: 'sl', prjCoordSys: {"epsgCode": 3857}}).addTo(mapEvent.map);
        break;
      case 1:
        L.supermap.tiledMapLayer(service.mapYXUrl, {id: 'yx', prjCoordSys: {"epsgCode": 3857}}).addTo(mapEvent.map);
        break;
      case 3:
        L.tileLayer.chinaProvider('Google.Normal.Map', {
          id: 'gnm',
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
      case 4:
        L.tileLayer.chinaProvider('Google.Satellite.Map', {
          id: 'gsm',
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
      case 5:
        L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
          id: 'tnm',
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
      case 7:
        L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
          id: 'tsm',
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
      case 8:
        L.tileLayer.chinaProvider('TianDiTu.Terrain.Map', {
          id: 'ttm',
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
      case 9:
        L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
          id: 'gdnm',
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
      case 10:
        L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
          id: 'gdsm',
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
      case 11:
        L.tileLayer.chinaProvider('Geoq.Normal.Map', {
          id: 'geonm',
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
      case 12:
        L.tileLayer.chinaProvider('Geoq.Normal.Warm', {
          id: 'geotm',
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
    }
  };
  /**
   * 量算
   * @param type
   */
  mapEvent.doMeasure = function (type) {
    if (type) {
      iMap.utils.measure.activateMeasure2DControl(type);
    } else {
      iMap.utils.measure.clear()
    }
  };

  module.exports = mapEvent;
});
