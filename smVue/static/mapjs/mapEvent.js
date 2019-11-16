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
      crs: L.CRS.EPSG4326,
      url: service.mapYXUrl,
      center: [34.265538635253906, 108.16653009033203],
      maxZoom: 18,
      zoom: 4,
      layerId: 'yx'
    };
    mapEvent.map = iMap.initMap(cfg);
  };

  /**
   * 切换底图
   * @param tag
   */
  mapEvent.changeMap = function (tag) {
    mapEvent.map.eachLayer((layer) => {
      if (layer.options.id === 'yx' || layer.options.id === 'sl') {
        layer.remove();
      }
    });
    switch (tag) {
      case 0:
        L.supermap.tiledMapLayer(service.mapSLUrl, {id: 'sl'}).addTo(mapEvent.map);
        break;
      case 1:
        L.supermap.tiledMapLayer(service.mapYXUrl, {id: 'yx'}).addTo(mapEvent.map);
        break;
    }
  };

  module.exports = mapEvent;
});
