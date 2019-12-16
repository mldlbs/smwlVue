/* eslint-disable */
/**
 * 地图功能入口
 */
import iMap from "../libs/supermap/iclient-leaflet/mapUtils"
import {initPlot} from "../libs/supermap/iclient-leaflet/utils/plot"
import service from "./config"
import plot from "../modules/plot"

// eslint-disable-next-line no-unused-vars
let bLayer, pulses, mLayer, vecLayers, markers, pLayer
export default {
  plot,
  /**
   * 初始化地图
   * @returns {*}
   */
  initMap () {
    this.map = iMap.initMap({ center: [38, 106], maxZoom: 18, zoom: 4 })
    this.addLayers()
    iMap.setBaseMap({ url: service.mapSLUrl, id: 'sl', layerGroup: bLayer })

    // iMap.utils.measure.initMeasure(this.map)
    this.map.on('click', (e) => {
      // eslint-disable-next-line no-console
      console.log(e.latlng)
    })
  },

  /**
   * 初始化动态标绘
   */
  initPlot: function (cfg) {
    initPlot({
      layerGroup: this.map,
      url: service.plotUrl,
      setPlotPanel: cfg.setPlotPanel,
      setStylePanel: cfg.setStylePanel
    })
  },

  /**
   * 添加所有图层
   */
  addLayers () {
    bLayer = L.layerGroup().addTo(this.map).setZIndex(100) // 底图图层
    vecLayers = L.layerGroup().addTo(this.map).setZIndex(200) // 矢量图层
    markers = L.layerGroup().addTo(this.map).setZIndex(300) // marker 图层
    pulses = L.layerGroup().addTo(this.map).setZIndex(350) // 闪烁点图层
    pLayer = L.layerGroup().addTo(this.map).setZIndex(360) // 标绘图层
    mLayer = L.supermap.turfLayer({
      attribution: '',
      style () {
        return {
          color: 'rgb(255,0,0)',
          opacity: 1,
          fillColor: 'rgb(255,0,0)',
          fillOpacity: 0.1,
          weight: 6
        }
      }
    }).addTo(this.map).setZIndex(400) // 量算图层
    // iMap.utils.measure.initMeasure(this.map, mLayer, vecLayers);
  },

  /**
   * 切换底图
   * @param tag
   */
  changeMap (tag) {
    switch (tag) {
      case 0:
        iMap.setBaseMap({ url: service.mapSLUrl, id: 'sl', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
      case 1:
        iMap.setBaseMap({ url: service.mapYXUrl, id: 'yx', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
      case 3:
        iMap.setBaseOnlineMap({ id: 'gnm', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
      case 4:
        iMap.setBaseOnlineMap({ id: 'gsm', prjCoordSys: { 'epsgCode': 4326 }, layerGroup: bLayer })
        break
      case 5:
        iMap.setBaseOnlineMap({ id: 'tnm', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
      case 7:
        iMap.setBaseOnlineMap({ id: 'tsm', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
      case 8:
        iMap.setBaseOnlineMap({ id: 'ttm', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
      case 9:
        iMap.setBaseOnlineMap({ id: 'gdnm', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
      case 10:
        iMap.setBaseOnlineMap({ id: 'gdsm', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
      case 11:
        iMap.setBaseOnlineMap({ id: 'geonm', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
      case 12:
        iMap.setBaseOnlineMap({ id: 'geonw', prjCoordSys: { 'epsgCode': 3857 }, layerGroup: bLayer })
        break
    }
  },

  /**
   * 添加 Markers
   * @param items
   */
  addMarkers (items) {
    items.forEach((item) => {
      if (!iMap.utils.getMarker({ id: item.id, layerGroup: markers })) {
        const cfg = {
          position: item.position,
          icon: iMap.utils.icon({ url: item.icon, iconSize: [24, 36] }),
          id: item.id,
          props: item,
          layerGroup: markers,
          content: item.content
        }
        /** 添加标记气泡 */
        iMap.utils.addMarker(cfg)
        /* if (cfg.clickEvent) {
          layer.on('click', cfg.clickEvent);
        } */
      }
    })
  },
  /**
   * 量算
   * @param type
   */
  doMeasure (type) {
    if (type) {
      iMap.utils.measure.activateMeasure2DControl(type)
    } else {
      iMap.utils.measure.clear()
    }
  }
}
