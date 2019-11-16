/**
 * 三维webgl工具类
 */
define(function (require, exports, module) {
    let utils = {};
    /**
     * 初始化场景
     */
    function initScene(cfg) {
        let viewer = new Cesium['Viewer'](cfg.id, {sceneModePicker: false, navigation: false});
        viewer['selectionIndicator'].destroy();
        viewer['infoBox'].destroy();
		let scene = viewer.scene;
        let promise = scene.open(cfg.url);
		cfg.cesium.when(promise,cfg.success);
        return viewer;
    }

    /**
     * 验证必填项
     */
    utils.verifyCfg = function (cfg, fnc) {
        let isVerifyPass = true;
        switch (fnc) {
            case '1':
                if (!cfg.url || !cfg.position) {
                    isVerifyPass = false;
                }
                break;
            case '2':
                if (!cfg.url || !cfg.position) {
                    isVerifyPass = false;
                }
                break;
            default:
                isVerifyPass = true;
                break;
        }
        return isVerifyPass;
    };
    //给外部提供接口
    module.exports = {
        initScene,
        utils
    };
});
