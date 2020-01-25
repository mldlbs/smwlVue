/**
 * 场景功能入口
 */

// import iScene from '../libs/supermap/iclient-webgl/sceneUtils'
// eslint-disable-next-line no-unused-vars
import {
  Viewer,
  Camera,
  Rectangle
  // TileMapServiceImageryProvider,
  // ShadowMode
} from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import service from './config'

window.CESIUM_BASE_URL = '/libs/Cesium/'

export default {
  service,
  viewer: null,
  scene: null,
  initScene () {
    // eslint-disable-next-line no-undef,no-unused-vars
    let viewer
    try {
      viewer = new Viewer('map3d', {
        useDefaultRenderLoop: true,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        baseLayerPicker: false,
        navigationHelpButton: false,
        animation: false,
        // creditContainer: 'specified',
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        scene3DOnly: true,
        selectionIndicator: true,
        infoBox: false,
        // navigationInstructionsInitiallyVisible: false,
        // allowTextureFilterAnisotropic: false,
        /*   contextOptions: {
          webgl: {
            alpha: false,
            antialias: true,
            preserveDrawingBuffer: true,
            failIfMajorPerformanceCaveat: false,
            depth: true,
            stencil: false,
            anialias: false
          }
        }, */
        // targetFrameRate: 60,
        // resolutionScale: 0.1,
        // orderIndependentTranslucency: true,
        // creditContainer: 'hidecredit',
        /* imageryProvider: TileMapServiceImageryProvider({
          url: 'Assets/imagery/NaturalEarthII/',
          maximumLevel: 5
        }), */
        // automaticallyTrackDataSourceClocks: false,
        // dataSources: null,
        clock: null
        // terrainShadows: ShadowMode.DISABLED
      })
      viewer._cesiumWidget._creditContainer.style.display = 'none'
      Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(106, 32, 109, 34)
      // viewer.scene.debugShowFramesPerSecond = true
    } catch (exception) {}
  },
  /**
   * 初始化场景成功回调
   */
  initSceneSuccess () {
  }
}
