/**
 * 初始化gis相关基础数据
 */
// eslint-disable-next-line no-unused-vars
const host = 'http://support.supermap.com.cn:8090'
const iServer = 'http://support.supermap.com.cn:8090/iserver/services/'
const iServer2 = 'http://222.91.72.102:2664/iserver/services/'
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
  sceneUrl: iServer + '3D-CBD/rest/realspace',
  /** 动态标绘服务 */
  plotUrl: iServer2 + 'plot-JY/rest/plot'
}
