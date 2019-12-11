/**
 * 初始化gis相关基础数据
 */
const host = 'http://support.supermap.com.cn:8090'
const iServer = host + '/iserver/services/'
export default {
  /** 影像底图 */
  mapYXUrl: iServer + 'map-world/rest/maps/World',
  /** 矢量底图 */
  mapSLUrl: iServer + 'map-china400/rest/maps/China',
  /** 矢量底图 */
  mapDPUrl: iServer + 'map-china400/rest/maps/ChinaDark',
  /** 数据服务 */
  dataUrl: iServer + 'data-world/rest/data',
  /** 三维场景 */
  sceneUrl: 'http://www.supermapol.com/realspace/services/3D-CBD/rest/realspace'
}
