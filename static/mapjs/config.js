/**
 * 初始化gis相关基础数据
 */
// eslint-disable-next-line no-unused-vars
const iServer = 'http://support.supermap.com.cn:8090/iserver/services/'
export default {
  P: {
    C: [34.1948811600, 108.8725576400],
    Z: 13
  },
  /** 三维场景 */
  sceneUrl: iServer + '3D-CBD/rest/realspace',
  O: [
    {
      label: 'OSM街道图',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    },
    {
      label: 'ArcGIS影像图',
      url:
        'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    },
    {
      label: 'ArcGIS街道图',
      url:
        'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}'
    },
    {
      label: '天地图街道图',
      url:
        'http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=7786923a385369346d56b966bb6ad62f'
    },
    {
      label: '天地图影像图',
      url:
        'http://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=7786923a385369346d56b966bb6ad62f'
    },
    {
      label: '谷歌街道图',
      url:
        'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}'
    },
    {
      label: '谷歌影像图',
      url:
        'http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}'
    },
    {
      label: '高德街道图',
      url:
        'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}'
    },
    {
      label: '高德影像图',
      url:
        'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}'
    },
    {
      label: '百度街道图',
      url:
        'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles={styles}&scaler=1&p=1'
    },
    {
      label: '百度影像图',
      url:
        'http://shangetu{s}.map.bdimg.com/it/u=x={x};y={y};z={z};v=009;type=sate&fm=46'
    }
  ]
}
