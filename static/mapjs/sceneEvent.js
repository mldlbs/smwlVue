/**
 * 场景功能入口
 */
import iScene from "../libs/supermap/iclient-webgl/sceneUtils"
import service from "./config"

export default {
  iScene,
  service,
  viewer: null,
  scene: null,
  initScene () {
    // Cesium.Credential.CREDENTIAL = new Cesium.Credential("ikdd9qBASQK_zTWmV2HlQmkieb5ejPFqY56RPYCVi8rmXLsLuAj81PlFWQadn_qp86ldSPgcQws7KJjFd_reFw..");
    // 先初始化场景
    const cfg = {
      // eslint-disable-next-line no-undef
      cesium: Cesium,
      id: 'map3d',
      url: service.sceneUrl,
      success: this.initSceneSuccess
    }
    this.viewer = iScene.initScene(cfg)
    this.scene = this.viewer.scene
    // iScene.utils.measure.initMeasure3DControl(cfg.cesium, this.viewer)
  },
  /**
   * 初始化场景成功回调
   */
  initSceneSuccess () {
  },

  /**
   * 注册实体点击事件
   */
  registerSelectEntityEvent () {

  },

  /**
   * 三维量算
   * @param type
   */
  doMeasure (type) {
    if (iScene.utils.measure) {
      if (type) {
        iScene.utils.measure.activateMeasure3DControl(type)
      } else {
        iScene.utils.measure.deactiveAllMeasure3DControl()
      }
    }
  }
}
