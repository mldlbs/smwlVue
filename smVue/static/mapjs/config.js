/**
 * 初始化gis相关基础数据
 */
define(function (require, exports, module) {
  let host = "http://support.supermap.com.cn:8090";
  let iServer = host + "/iserver/services/";

  module.exports = {
    /**影像底图*/
    mapYXUrl: iServer + "map-world/rest/maps/World",
    /**矢量底图*/
    mapSLUrl: iServer + "map-china400/rest/maps/China",
    /**数据服务*/
    dataUrl: iServer + "data-world/rest/data",
    /**三维场景*/
    sceneUrl: "http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace",
  };
});
