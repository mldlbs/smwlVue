/**
 * 测量控件api
 * 测距、测面、测高度
 */
export default {
  handlerDis: {},
  handlerArea: {},
  handlerHeight: {},
  active: false,
  /**
   * 创建测量控件
   */
  initthis3DControl (Cesium, viewer) {
    // 注册测距、测高、测面积控件
    this.thisDistance(Cesium, viewer)
    this.thisHeight(Cesium, viewer)
    this.thisArea(Cesium, viewer)
  },
  /**
   * 测距离
   * @param {Object} cesium
   * @param {Object} viewer
   */
  thisDistance (cesium, viewer) {
    // eslint-disable-next-line new-cap,no-undef
    this.handlerDis = new Cesium.thisHandler(viewer, cesium.thisMode.Distance, 0)
    this.handlerDis.thisEvt.addEventListener(function (result) {
      const distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm'
      this.handlerDis.disLabel.text = '距离:' + distance
    })
    this.handlerDis.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        // document.body.setAttribute("class", "thisCur");
      } else {
        viewer.enableCursorStyle = true
        // document.body.getAttribute("class").replace("thisCur", "");
      }
    })
  },

  /**
   * 测高度
   * @param {Object} cesium
   * @param {Object} viewer
   */
  thisHeight (cesium, viewer) {
    // eslint-disable-next-line new-cap,no-undef
    this.handlerHeight = new Cesium.thisHandler(viewer, cesium.thisMode.DVH)
    this.handlerHeight.thisEvt.addEventListener(function (result) {
      const distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm'
      const vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm'
      const hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm'
      this.handlerHeight.disLabel.text = '空间距离:' + distance
      this.handlerHeight.vLabel.text = '垂直高度:' + vHeight
      this.handlerHeight.hLabel.text = '水平距离:' + hDistance
    })
    this.handlerHeight.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        // document.body.setAttribute("class", "thisCur");
      } else {
        viewer.enableCursorStyle = true
        // document.body.getAttribute("class").replace("thisCur", "");
      }
    })
  },

  /**
   * 测面积
   * @param {Object} cesium
   * @param {Object} viewer
   */
  thisArea (cesium, viewer) {
    // eslint-disable-next-line new-cap,no-undef
    this.handlerArea = new Cesium.thisHandler(viewer, cesium.thisMode.Area, 2)
    this.handlerArea.thisEvt.addEventListener(function (result) {
      const area = result.area > 1000000 ? result.area / 1000000 + 'km²' : result.area + '㎡'
      this.handlerArea.areaLabel.text = '面积:' + area
    })
    this.handlerArea.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false
        viewer._element.style.cursor = ''
        // document.body.setAttribute("class", "thisCur");
      } else {
        viewer.enableCursorStyle = true
        // document.body.getAttribute("class").replace("thisCur", "");
      }
    })
  },

  /**
   * 激活测量控件
   * @param {Object} type：控件类型（DIS--测距；AREA--面积；HEIGHT--高度）
   */
  activatethis3DControl (type) {
    this.deactiveAllthis3DControl()
    switch (type) {
      case 'DIS':
        this.handlerDis && this.handlerDis.activate()
        this.active = true
        break
      case 'AREA':
        this.handlerArea && this.handlerArea.activate()
        this.active = true
        break
      case 'HEIGHT':
        this.handlerHeight && this.handlerHeight.activate()
        this.active = true
        break
    }
  },

  /**
   * 销毁测量控件,并清除所有要素
   */
  deactiveAllthis3DControl () {
    this.active = false
    this.handlerDis && this.handlerDis.deactivate()
    this.handlerArea && this.handlerArea.deactivate()
    this.handlerHeight && this.handlerHeight.deactivate()
    this.handlerDis && this.handlerDis.clear()
    this.handlerArea && this.handlerArea.clear()
    this.handlerHeight && this.handlerHeight.clear()
  }
}
