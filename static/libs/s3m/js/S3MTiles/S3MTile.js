/* eslint-disable */
import ContentState from "./Enum/ContentState"
import S3ModelParser from "./S3ModelParser"
import S3MContentParser from "./S3MContentParser"
import { Cartesian3, defaultValue, TileBoundingSphere, BoundingSphere,
    CullingVolume, Request, RequestType, when, destroyObject,
    Check, Matrix4, Resource, defined, RequestScheduler, ShadowMode
} from 'cesium'

    function S3MTile(layer, parent, boundingVolume, fileName, rangeData, renderEntityMap, isLeafTile) {
        this.layer = layer;
        this.parent = parent;
        this.fileName = fileName;
        this.isLeafTile = defaultValue(isLeafTile, false);
        this.boundingVolume = this.createBoundingVolume(boundingVolume, layer.modelMatrix);
        let baseResource = Resource.createIfNeeded(layer._baseResource);
        if(defined(parent)){
            this.baseUri = parent.baseUri;
        }
        else{
            let resource = new Resource(fileName);
            this.baseUri = resource.getBaseUri();
        }
        this.contentResource = baseResource.getDerivedResource({
            url : fileName
        });
        this.serverKey = RequestScheduler.getServerKey(this.contentResource.getUrlComponent());
        this.request = undefined;
        this.cacheNode = undefined;
        this.distanceToCamera = 0;
        this.pixel = 0;
        this.visibilityPlaneMask = 0;
        this.visible = false;
        this.children = [];
        this.lodRangeData = rangeData;
        this.renderEntityMap = renderEntityMap;
        this.contentState = ContentState.UNLOADED;
        this.readerable = false;
        this.touchedFrame = 0;
        this.requestedFrame = 0;
        this.selectedFrame = 0;
        this.priority = 0;
    }

    Object.defineProperties(S3MTile.prototype, {
        renderable : {
            get : function() {
                return defined(this.renderEntityMap);
            }
        }
    });

    let scratchScale = new Cartesian3();

    function createSphere(sphere, transform) {
        let center = Cartesian3.clone(sphere.center);
        let radius = sphere.radius;
        center = Matrix4.multiplyByPoint(transform, center, center);
        let scale = Matrix4.getScale(transform, scratchScale);
        let maxScale = Cartesian3.maximumComponent(scale);
        radius *= maxScale;
        return new TileBoundingSphere(center, radius);
    }

    function createBoundingBox(box, transform) {
        let min = new Cartesian3(box.min.x, box.min.y, box.min.z);
        Matrix4.multiplyByPoint(transform, min, min);
        let max = new Cartesian3(box.max.x, box.max.y, box.max.z);
        Matrix4.multiplyByPoint(transform, max, max);
        let sphere = BoundingSphere.fromCornerPoints(min, max, new BoundingSphere());
        let center = sphere.center;
        let radius = sphere.radius;
        let scale = Matrix4.getScale(transform, scratchScale);
        let maxScale = Cartesian3.maximumComponent(scale);
        radius *= maxScale;
        return new TileBoundingSphere(center, radius);
    }

    S3MTile.prototype.createBoundingVolume = function(parameter, transform) {
        if(this.isLeafTile) {
            return new TileBoundingSphere(parameter.center, parameter.radius);
        }

        if (defined(parameter.sphere)) {
            return createSphere(parameter.sphere, transform);
        }
        else if(defined(parameter.box)) {
            return createBoundingBox(parameter.box, transform);
        }

        return undefined;
    };

    S3MTile.prototype.canTraverse = function() {
        if (this.children.length === 0 || this.isLeafTile) {
            return false;
        }

        if(!defined(this.lodRangeData)) {
            return true;
        }

        return this.pixel > this.lodRangeData;
    };

    function getBoundingVolume (tile, frameState) {
        return tile.boundingVolume;
    }

    S3MTile.prototype.getPixel = function(frameState) {
        let boundingVolume = this.boundingVolume;
        let radius = boundingVolume.radius;
        let center = boundingVolume.center;
        let distance = Cartesian3.distance(frameState.camera.positionWC, center);
        let height = frameState.context.drawingBufferHeight;
        let theta = frameState.camera.frustum._fovy * 0.5;
        let screenYPix = height * 0.5;
        let lamat = screenYPix / Math.tan(theta);
        return lamat * radius / distance;
    };

    S3MTile.prototype.distanceToTile = function(frameState) {
        let boundingVolume = getBoundingVolume(this, frameState);
        return boundingVolume.distanceToCamera(frameState);
    };

    S3MTile.prototype.visibility = function(frameState, parentVisibilityPlaneMask) {
        let boundingVolume = getBoundingVolume(this, frameState);
        return frameState.cullingVolume.computeVisibilityWithPlaneMask(boundingVolume, parentVisibilityPlaneMask);
    };

    S3MTile.prototype.updateVisibility = function(frameState) {
        let parent = this.parent;
        let parentVisibilityPlaneMask = defined(parent) ? parent.visibilityPlaneMask : CullingVolume.MASK_INDETERMINATE;
        this.distanceToCamera = this.distanceToTile(frameState);
        this.pixel = this.getPixel(frameState);
        this.visibilityPlaneMask = this.visibility(frameState, parentVisibilityPlaneMask);
        this.visible = this.visibilityPlaneMask !== CullingVolume.MASK_OUTSIDE;
    };

    function createPriorityFunction(tile) {
        return function() {
            return tile.priority;
        };
    }

    function getContentFailedFunction(tile) {
        return function(error) {
            tile.contentState = ContentState.FAILED;
            tile.contentReadyPromise.reject(error);
        };
    }

    function createChildren(parent, datas) {
        let layer = parent.layer;
        let length = datas.length;
        for(let i = 0;i < length;i++){
            let data = datas[i];
            let boundingVolume = data.boundingVolume;
            let fileName = data.rangeDataList;
            fileName = parent.baseUri + fileName;
            let rangeData = data.rangeList;
            let renderEntitieMap = data.geoMap;
            let tile = new S3MTile(layer, parent, boundingVolume, fileName, rangeData, renderEntitieMap, data.isLeafTile);
            parent.children.push(tile);
            parent.layer._cache.add(tile);
        }
    }

    S3MTile.prototype.requestContent = function() {
        let that = this;
        let layer = this.layer;
        let resource = this.contentResource.clone();

        let request = new Request({
            throttle : true,
            throttleByServer : true,
            type : RequestType.TILES3D,
            priorityFunction : createPriorityFunction(this),
            serverKey : this.serverKey
        });

        this.request = request;
        resource.request = request;

        let promise = resource.fetchArrayBuffer();

        if (!defined(promise)) {
            return false;
        }

        this.contentState = ContentState.LOADING;
        this.contentReadyPromise = when.defer();
        let contentFailedFunction = getContentFailedFunction(this);
        promise.then(function(arrayBuffer) {
            if (that.isDestroyed()) {
                contentFailedFunction();
                return;
            }

            let content = S3ModelParser.parseBuffer(arrayBuffer);
            let data = S3MContentParser.parse(that.layer, content);
            createChildren(that, data);
            that.selectedFrame = 0;
            that.contentState = ContentState.READY;
            that.renderable = true;
            that.contentReadyPromise.resolve(content);
        }).otherwise(function(error) {
            if (request.state === RequestState.CANCELLED) {
                that.contentState = ContentState.UNLOADED;
                return;
            }

            contentFailedFunction(error);
        });

        return true;
    };

    S3MTile.prototype.update = function(frameState) {
        let renderEntityMap = this.renderEntityMap;

        for(let key in  renderEntityMap) {
            if(renderEntityMap.hasOwnProperty(key)) {
                renderEntityMap[key].update(frameState);
            }
        }
    };

    S3MTile.prototype.free = function() {
        for(let i = 0,j = this.children.length;i < j;i++) {
            let child = this.children[i];
            child.destroy();
        }

        this.children.length = 0;
        this.contentState = ContentState.UNLOADED;
    };

    S3MTile.prototype.isDestroyed = function() {
        return false;
    };

    S3MTile.prototype.destroy = function() {
        for(let key in this.renderEntityMap) {
            if(this.renderEntityMap.hasOwnProperty(key)) {
                this.renderEntityMap[key].destroy();
            }
        }

        this.renderEntityMap = undefined;

        for(let i = 0,j = this.children.length;i < j;i++) {
            let child = this.children[i];
            child.destroy();
        }

        this.children.length = 0;

        return destroyObject(this);
    };
export default S3MTile;
