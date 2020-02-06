/**
 * 场景功能入口
 */
/* eslint-disable */
import {
  Viewer,
  Cartesian3,
  // Color,
  Camera,
  // Rectangle,
  // TileMapServiceImageryProvider
  ShadowMode
} from 'cesium'
import * as THREE from 'three'
import 'cesium/Build/Cesium/Widgets/widgets.css'
import S3MTilesLayer from '../libs/s3m/js/S3MTiles/S3MTilesLayer'
import service from './config'

window.CESIUM_BASE_URL = '/libs/Cesium/'
// eslint-disable-next-line no-unused-vars
const minWGS84 = [115.23, 39.55]
// eslint-disable-next-line no-unused-vars
const maxWGS84 = [116.23, 41.55]
export default {
  service,
  viewer: null,
  scene: null,
  tScene: null,
  tCamera: null,
  initScene () {
    // eslint-disable-next-line no-undef,no-unused-vars
    try {
      this.viewer = new Viewer('map3d', {
        useDefaultRenderLoop: false,
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
        navigationInstructionsInitiallyVisible: false,
        allowTextureFilterAnisotropic: false,
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
        targetFrameRate: 60,
        resolutionScale: 0.1,
        orderIndependentTranslucency: true,
        automaticallyTrackDataSourceClocks: false,
        dataSources: null,
        clock: null,
        terrainShadows: ShadowMode.DISABLED
      })
      this.viewer._cesiumWidget._creditContainer.style.display = 'none'
      // Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(106, 32, 109, 34)
      // viewer.scene.debugShowFramesPerSecond = true
      this.scene = this.viewer.scene
      const layer = new S3MTilesLayer({
        context: this.scene._context,
        url: '../data/CBD/cbd.scp'
      })
      this.scene.primitives.add(layer)
      layer.readyPromise.then(function () {
        console.log(layer);
        /* Camera.setView({
          destination: Cartesian3(-2182469.166141913, 4386579.0994979935, 4069925.783807108),
          orientation: {
            heading: 5.213460518239332,
            pitch: -0.5150671720144846
          }
        }) */
      }).otherwise(function (error) {
        console.log(error)
      })
    } catch (exception) {}
  },
  initThree () {
    const fov = 45
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height
    const near = 1
    const far = 10 * 1000 * 1000
    // eslint-disable-next-line no-unused-vars
    this.tScene = new THREE.Scene()
    // eslint-disable-next-line no-unused-vars
    const tCamera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    const tRenderer = new THREE.WebGLRenderer({ alpha: true })
    document.getElementById('Three').appendChild(tRenderer.domElement)
  },
  loop () {
     requestAnimationFrame(() => this.loop())
     this.viewer.render()
  },
  /**
   * 初始化场景成功回调
   */
  initSceneSuccess () {
  }
}
