/**
 * 测量控件api
 * 测距、测面、测高度
 */
define(function (require, exports, module) {
  let measure = {
    handlerDis: {},
    handlerArea: {},
    handlerHeight: {},
    active: false,
  };
  /**
   * 创建测量控件
   */
  measure.initMeasure3DControl = function (Cesium, viewer) {
    //注册测距、测高、测面积控件
    measure.measureDistance(Cesium, viewer);
    measure.measureHeight(Cesium, viewer);
    measure.measureArea(Cesium, viewer);
  };
  /**
   * 测距离
   * @param {Object} cesium
   * @param {Object} viewer
   */
  measure.measureDistance = function (cesium, viewer) {
    measure.handlerDis = new Cesium.MeasureHandler(viewer, cesium.MeasureMode.Distance, 0);
    measure.handlerDis.measureEvt.addEventListener(function (result) {
      let distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
      measure.handlerDis.disLabel.text = '距离:' + distance;
    });
    measure.handlerDis.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
        //document.body.setAttribute("class", "measureCur");
      } else {
        viewer.enableCursorStyle = true;
        //document.body.getAttribute("class").replace("measureCur", "");
      }
    });
  };

  /**
   * 测高度
   * @param {Object} cesium
   * @param {Object} viewer
   */
  measure.measureHeight = function (cesium, viewer) {
    measure.handlerHeight = new Cesium.MeasureHandler(viewer, cesium.MeasureMode.DVH);
    measure.handlerHeight.measureEvt.addEventListener(function (result) {
      let distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
      let vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
      let hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
      measure.handlerHeight.disLabel.text = '空间距离:' + distance;
      measure.handlerHeight.vLabel.text = '垂直高度:' + vHeight;
      measure.handlerHeight.hLabel.text = '水平距离:' + hDistance;
    });
    measure.handlerHeight.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
        //document.body.setAttribute("class", "measureCur");
      } else {
        viewer.enableCursorStyle = true;
        //document.body.getAttribute("class").replace("measureCur", "");
      }
    });
  };

  /**
   * 测面积
   * @param {Object} cesium
   * @param {Object} viewer
   */
  measure.measureArea = function (cesium, viewer) {
    measure.handlerArea = new Cesium.MeasureHandler(viewer, cesium.MeasureMode.Area, 2);
    measure.handlerArea.measureEvt.addEventListener(function (result) {
      let area = result.area > 1000000 ? result.area / 1000000 + 'km²' : result.area + '㎡';
      measure.handlerArea.areaLabel.text = '面积:' + area;
    });
    measure.handlerArea.activeEvt.addEventListener(function (isActive) {
      if (isActive === true) {
        viewer.enableCursorStyle = false;
        viewer._element.style.cursor = '';
        //document.body.setAttribute("class", "measureCur");
      } else {
        viewer.enableCursorStyle = true;
        //document.body.getAttribute("class").replace("measureCur", "");
      }
    });
  };

  /**
   * 激活测量控件
   * @param {Object} type：控件类型（DIS--测距；AREA--面积；HEIGHT--高度）
   */
  measure.activateMeasure3DControl = function (type) {
    measure.deactiveAllMeasure3DControl();
    switch (type) {
      case "DIS":
        measure.handlerDis && measure.handlerDis.activate();
        measure.active = true;
        break;
      case "AREA":
        measure.handlerArea && measure.handlerArea.activate();
        measure.active = true;
        break;
      case "HEIGHT":
        measure.handlerHeight && measure.handlerHeight.activate();
        measure.active = true;
        break;
    }
  };

  /**
   * 销毁测量控件,并清除所有要素
   */
  measure.deactiveAllMeasure3DControl = function () {
    measure.active = false;
    measure.handlerDis && measure.handlerDis.deactivate();
    measure.handlerArea && measure.handlerArea.deactivate();
    measure.handlerHeight && measure.handlerHeight.deactivate();
    measure.handlerDis && measure.handlerDis.clear();
    measure.handlerArea && measure.handlerArea.clear();
    measure.handlerHeight && measure.handlerHeight.clear();
  };

  //给外部暴露接口
  module.exports = measure;
});

