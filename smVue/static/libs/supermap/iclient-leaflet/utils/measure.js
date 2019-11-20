/* eslint-disable */
/**
 * 地图量算 leaflet
 * @author gzq
 * 2019.10.30
 */
define(function (require, exports, module) {
  let measure = {
    map: null, vecLayers: null,
    points: [],
    polygon: null,
    polyline: null

  };
  measure.initMeasure = function (map) {
    measure.map = map;
    measure.vecLayers = L.layerGroup().addTo(measure.map);
    measure.points = [];
    measure.polygon = null;
  };
  measure.activateMeasure2DControl = function (type) {
    measure.clear();
    switch (type) {
      case 'DIS':
        measure.map.on('click', measure.dis.click);
        measure.map.on('mousemove', measure.dis.mousemove);
        measure.map.on('contextmenu', measure.dis.dblclick);
        break;
      case 'AREA':
        measure.map.on('click', measure.area.click);
        measure.map.on('mousemove', measure.area.mousemove);
        measure.map.on('contextmenu', measure.area.dblclick);
        break;
    }
  };
  measure.dis = {
    distance: 0,
    end: null,
    calculate: function (start, end) {
      measure.dis.distance += start.distanceTo(end);
    },
    click: function (e) {
      // 添加点信息
      if (measure.dis.end) {
        measure.polyline = L.polyline([measure.dis.end, e.latlng], {color: "red"});
        measure.vecLayers.addLayer(measure.polyline);
        measure.dis.calculate(measure.dis.end, e.latlng);
      }
      measure.dis.end = e.latlng;
    },
    dblclick: function (e) {
      measure.polyline.bindPopup('总距离：' + measure.dis.distance + '千米', {closeButton: false}).openPopup(e.latlng);
      measure.map.off('click').off('dblclick').off('mousemove');
    },
    mousemove: function (e) {
      if (measure.polyline) {
        measure.vecLayers.removeLayer(measure.polyline);
      }
      if (measure.dis.end) {
        measure.polyline = L.polyline([measure.dis.end, e.latlng], {color: "red"});
        measure.vecLayers.addLayer(measure.polyline);
      }
    }
  };

  measure.area = {
    acreage: 0,
    start: null,
    end: null,
    points: [],
    calculate: function (polygon) {
      measure.area.acreage += turf.area(polygon.toGeoJSON());
    },
    click: function (e) {
      measure.area.points.push(e.latlng);
      if (measure.area.start) {
        if (measure.area.end) {
          if (measure.polygon) {
            measure.vecLayers.removeLayer(measure.polygon);
          }
          measure.polygon = L.polygon(measure.area.points, {color: "red"});
          measure.vecLayers.addLayer(measure.polygon);
          measure.area.calculate(measure.polygon);
        }
        measure.area.end = e.latlng;
      } else {
        measure.area.start = e.latlng;
      }
    },
    dblclick: function (e) {
      measure.polygon.bindPopup('总面积：' + measure.area.acreage + '平方米', {closeButton: false}).openPopup(e.latlng);
      measure.map.off('click').off('dblclick').off('mousemove');
    },
    mousemove: function (e) {
      let p = measure.area.points.concat();
      p.push(e.latlng);
      if (measure.area.end) {
        if (measure.polygon) {
          measure.vecLayers.removeLayer(measure.polygon);
        }
        measure.polygon = L.polygon(p, {color: "red"});
        measure.vecLayers.addLayer(measure.polygon);
      }
    }
  };

  measure.clear = function () {
    if (measure.vecLayers) {
      measure.vecLayers.clearLayers();
    }
    measure.dis.end = null;
    measure.area.points = [];
    measure.area.start = null;
    measure.area.end = null;
    if (measure.map) {
      measure.map.off('click').off('dblclick').off('mousemove');
    }
  };
  module.exports = measure;
});