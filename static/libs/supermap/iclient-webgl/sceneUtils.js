/**
 * 三维webgl工具类
 */
import measure from "./utils/measure"

export default {
  measure,
  /**
   * 初始化场景
   */
  initScene (cfg) {
    // eslint-disable-next-line no-undef
    const viewer = new Cesium.Viewer(cfg.id, { sceneModePicker: false, navigation: false })
    viewer.selectionIndicator.destroy()
    viewer.infoBox.destroy()
    const scene = viewer.scene
    const promise = scene.open(cfg.url)
    cfg.cesium.when(promise, cfg.success)
    return viewer
  },

  /**
   * 验证必填项
   */
  verifyCfg (cfg, fnc) {
    let isVerifyPass = true
    switch (fnc) {
      case '1':
        if (!cfg.url || !cfg.position) {
          isVerifyPass = false
        }
        break
      case '2':
        if (!cfg.url || !cfg.position) {
          isVerifyPass = false
        }
        break
      default:
        isVerifyPass = true
        break
    }
    return isVerifyPass
  }
}
