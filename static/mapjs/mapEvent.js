/* eslint-disable */
/**
 * 地图功能入口
 */
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.chinaProvider';
import Mcfg from "./config";

export default {
  initMap() {
    const map = L.map("map2d", {
      attributionControl: false
    }).setView(Mcfg.P.C, Mcfg.P.Z);
    const baseLayer6 = L.tileLayer(Mcfg.O[6].url);//谷歌影像图
    map.addLayer(baseLayer6);//地图默认加载的底图
  }
}
