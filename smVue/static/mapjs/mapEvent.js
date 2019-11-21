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
    console.log(tag);
    mapEvent.map.eachLayer((layer) => {
      if (layer.options.id === 'yx' || layer.options.id === 'sl' || layer.options.id === 'gnm') {
        layer.remove();
      }
    });
    switch (tag) {
      case 0:
        L.tileLayer.chinaProvider('Google.Normal.Map', {
          id: 'gnm',
          maxZoom: 18,
          minZoom: 5,
          prjCoordSys: {"epsgCode": 3857}
        }).addTo(mapEvent.map);
        break;
      case 1:
        L.supermap.tiledMapLayer(service.mapSLUrl, {id: 'sl', prjCoordSys: {"epsgCode": 3857}}).addTo(mapEvent.map);
        break;
      case 2:
        L.supermap.tiledMapLayer(service.mapYXUrl, {id: 'yx', prjCoordSys: {"epsgCode": 3857}}).addTo(mapEvent.map);
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
