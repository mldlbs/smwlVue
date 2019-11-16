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
    module.exports = sceneEvent;
});
