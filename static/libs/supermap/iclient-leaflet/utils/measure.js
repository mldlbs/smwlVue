/**
 * 地图量算 leaflet
 * @author gzq
 * 2019.10.30
 */
export default {
  map: null,
  vecLayers: null,
  points: [],
  polygon: null,
  polyline: null,
  initMeasure (map) {
    this.map = map
    // eslint-disable-next-line no-undef
    this.vecLayers = L.layerGroup().addTo(this.map)
    this.points = []
    this.polygon = null
  },
  activatethis2DControl (type) {
    this.clear()
    switch (type) {
      case 'DIS':
        this.map.on('click', this.dis.click)
        this.map.on('mousemove', this.dis.mousemove)
        this.map.on('contextmenu', this.dis.dblclick)
        break
      case 'AREA':
        this.map.on('click', this.area.click)
        this.map.on('mousemove', this.area.mousemove)
        this.map.on('contextmenu', this.area.dblclick)
        break
    }
  },
  dis: {
    distance: 0,
    end: null,
    calculate (start, end) {
      this.dis.distance += start.distanceTo(end)
    },
    click (e) {
      // 添加点信息
      if (this.dis.end) {
        // eslint-disable-next-line no-undef
        this.polyline = L.polyline([this.dis.end, e.latlng], { color: 'red' })
        this.vecLayers.addLayer(this.polyline)
        this.dis.calculate(this.dis.end, e.latlng)
      }
      this.dis.end = e.latlng
    },
    dblclick (e) {
      this.polyline.bindPopup('总距离：' + this.dis.distance + '千米', { closeButton: false }).openPopup(e.latlng)
      this.map.off('click').off('dblclick').off('mousemove')
    },
    mousemove (e) {
      if (this.polyline) {
        this.vecLayers.removeLayer(this.polyline)
      }
      if (this.dis.end) {
        // eslint-disable-next-line no-undef
        this.polyline = L.polyline([this.dis.end, e.latlng], { color: 'red' })
        this.vecLayers.addLayer(this.polyline)
      }
    }
  },
  area: {
    acreage: 0,
    start: null,
    end: null,
    points: [],
    calculate (polygon) {
      // eslint-disable-next-line no-undef
      this.area.acreage += turf.area(polygon.toGeoJSON())
    },
    click (e) {
      this.area.points.push(e.latlng)
      if (this.area.start) {
        if (this.area.end) {
          if (this.polygon) {
            this.vecLayers.removeLayer(this.polygon)
          }
          // eslint-disable-next-line no-undef
          this.polygon = L.polygon(this.area.points, { color: 'red' })
          this.vecLayers.addLayer(this.polygon)
          this.area.calculate(this.polygon)
        }
        this.area.end = e.latlng
      } else {
        this.area.start = e.latlng
      }
    },
    dblclick (e) {
      this.polygon.bindPopup('总面积：' + this.area.acreage + '平方米', { closeButton: false }).openPopup(e.latlng)
      this.map.off('click').off('dblclick').off('mousemove')
    },
    mousemove (e) {
      const p = this.area.points.concat()
      p.push(e.latlng)
      if (this.area.end) {
        if (this.polygon) {
          this.vecLayers.removeLayer(this.polygon)
        }
        // eslint-disable-next-line no-undef
        this.polygon = L.polygon(p, { color: 'red' })
        this.vecLayers.addLayer(this.polygon)
      }
    }
  },

  clear () {
    if (this.vecLayers) {
      this.vecLayers.clearLayers()
    }
    this.dis.end = null
    this.area.points = []
    this.area.start = null
    this.area.end = null
    if (this.map) {
      this.map.off('click').off('dblclick').off('mousemove')
    }
  }
}
