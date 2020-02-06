/* eslint-disable */
import { Color, ShadowMode } from 'cesium'
    function MaterialPass(){
        this.ambientColor = new Color();
        this.diffuseColor = new Color();
        this.specularColor = new Color(0.0, 0.0, 0.0, 0.0);
        this.shininess = 50.0;
        this.bTransparentSorting = false;
        this.textures = [];
    }

    MaterialPass.prototype.isDestroyed = function() {
        return false;
    };

    MaterialPass.prototype.destroy = function(){
        return destroyObject(this);
    };
export default MaterialPass;
