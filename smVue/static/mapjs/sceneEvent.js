// 加载场景功能入口
define(function (require, exports, module) {
  let sceneEvent = {};
  let iScene = require("../libs/supermap/iclient-webgl/sceneUtils.js");
  let service = require("./config.js");
  let viewer, scene;

  sceneEvent.initScene = function () {
    //Cesium.Credential.CREDENTIAL = new Cesium.Credential("ikdd9qBASQK_zTWmV2HlQmkieb5ejPFqY56RPYCVi8rmXLsLuAj81PlFWQadn_qp86ldSPgcQws7KJjFd_reFw..");
    //先初始化场景
    let cfg = {
      cesium: Cesium,
      id: "map3d",
      url: service.sceneUrl,
      success: sceneEvent.initSceneSuccess
    };
    viewer = iScene.initScene(cfg);
    scene = viewer.scene;
    iScene.utils.measure.initMeasure3DControl(cfg.cesium, viewer);
  };
  /**
   * 初始化场景成功回调
   */
  sceneEvent.initSceneSuccess = function () {
    let camera = scene.camera;

  };

  /**
   * 注册实体点击事件
   */
  sceneEvent.registerSelectEntityEvent = function () {

  };

  /**
   * 三维量算
   * @param type
   */
  sceneEvent.doMeasure = function (type) {
    if (iScene.utils.measure) {
      if (type) {
        iScene.utils.measure.activateMeasure3DControl(type);
      } else {
        iScene.utils.measure.deactiveAllMeasure3DControl();
      }
    }
  };

  module.exports = sceneEvent;
});
