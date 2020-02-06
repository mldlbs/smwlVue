/* eslint-disable */
import ContentState from './DDSTexture'
import MaterialPass from './MaterialPass'
import S3MContentFactory from './Factory/S3MContentFactory'
import VertexCompressOption from './Enum/VertexCompressOption'
import { Cartesian3, Color, TextureWrap, Matrix4, BoundingSphere, defined, ShadowMode } from 'cesium'
    function S3MContentParser(){

    }

    function parseMaterial(context, content) {
        let materialTable = {};
        let materials = content.materials.material;
        for(let i = 0,j = materials.length;i < j;i++){
            let material = materials[i].material;
            let materialCode = material.id;
            let materialPass = new MaterialPass();
            materialTable[materialCode] = materialPass;
            let ambient = material.ambient;
            materialPass.ambientColor = new Color(ambient.r, ambient.g, ambient.b, ambient.a);
            let diffuse = material.diffuse;
            materialPass.diffuseColor = new Color(diffuse.r, diffuse.g, diffuse.b, diffuse.a);
            let specular = material.specular;
            materialPass.specularColor = new Color(specular.r, specular.g, specular.b, specular.a);
            materialPass.shininess = material.shininess;
            materialPass.bTransparentSorting = material.transparentsorting;
            let textureStates = material.textureunitstates;
            let len = textureStates.length;
            for(let k = 0;k < len;k++){
                let textureState = textureStates[k].textureunitstate;
                let textureCode = textureState.id;
                let wrapS = textureState.addressmode.u === 0 ? TextureWrap.REPEAT : TextureWrap.CLAMP_TO_EDGE;
                let wrapT = textureState.addressmode.v === 0 ? TextureWrap.REPEAT : TextureWrap.CLAMP_TO_EDGE;
                materialPass.texMatrix = Matrix4.unpack(textureState.texmodmatrix);
                let textureInfo = content.texturePackage[textureCode];
                if(defined(textureInfo) && textureInfo.imageBuffer.byteLength > 0){
                    textureInfo.wrapS = wrapS;
                    textureInfo.wrapT = wrapT;
                    let texture = new DDSTexture(context, textureCode, textureInfo);
                    materialPass.textures.push(texture);
                }
            }
        }
        return materialTable;
    }

    function calcBoundingVolume(vertexPackage, transform) {
        let boundingSphere = new BoundingSphere();
        let v1 = new Cartesian3();
        let positionAttr = vertexPackage.vertexAttributes[0];
        let dim = positionAttr.componentsPerAttribute;
        let isCompress = defined(vertexPackage.nCompressOptions) && (vertexPackage.nCompressOptions & VertexCompressOption.SVC_Vertex) === VertexCompressOption.SVC_Vertex;
        let normConstant = 1.0;
        let minVertex;
        let vertexTypedArray;
        if(isCompress){
            normConstant = vertexPackage.vertCompressConstant;
            minVertex = new Cartesian3(vertexPackage.minVerticesValue.x, vertexPackage.minVerticesValue.y, vertexPackage.minVerticesValue.z);
            vertexTypedArray = new Uint16Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 2);
        }
        else{
            vertexTypedArray = new Float32Array(positionAttr.typedArray.buffer, positionAttr.typedArray.byteOffset, positionAttr.typedArray.byteLength / 4);
        }
        let vertexArray = [];
        for(let t = 0; t < vertexPackage.verticesCount; t++){
            Cartesian3.fromArray(vertexTypedArray, dim * t, v1);
            if(isCompress){
                v1 = Cartesian3.multiplyByScalar(v1, normConstant, v1);
                v1 = Cartesian3.add(v1, minVertex, v1);
            }
            vertexArray.push(Cartesian3.clone(v1));
        }
        BoundingSphere.fromPoints(vertexArray, boundingSphere);
        BoundingSphere.transform(boundingSphere, transform, boundingSphere);
        vertexArray.length = 0;
        return boundingSphere;
    }

    function parseGeodes(layer, content, materialTable, pagelodNode, pagelod) {
        let geoMap = {};
        let geodeList = pagelodNode.geodes;
        for(let i = 0,j = geodeList.length;i < j;i++){
            let geodeNode = geodeList[i];
            let geoMatrix = geodeNode.matrix;
            let modelMatrix = Matrix4.multiply(layer.modelMatrix, geoMatrix, new Matrix4());
            let boundingSphere;
            if(defined(pagelod.boundingVolume)) {
                boundingSphere = new BoundingSphere(pagelod.boundingVolume.sphere.center, pagelod.boundingVolume.sphere.radius);
                BoundingSphere.transform(boundingSphere, layer.modelMatrix, boundingSphere);
            }
            let skeletonNames = geodeNode.skeletonNames;
            for(let m = 0,n = skeletonNames.length;m < n; m++){
                let geoName = skeletonNames[m];
                let geoPackage = content.geoPackage[geoName];
                let vertexPackage = geoPackage.vertexPackage;
                let arrIndexPackage = geoPackage.arrIndexPackage;
                let pickInfo = geoPackage.pickInfo;
                let material;
                if(arrIndexPackage.length > 0) {
                    material = materialTable[arrIndexPackage[0].materialCode];
                }
                let geodeBoundingVolume = defined(boundingSphere) ? boundingSphere : calcBoundingVolume(vertexPackage, modelMatrix);
                geoMap[geoName] = S3MContentFactory[layer.fileType]({
                    layer : layer,
                    vertexPackage : vertexPackage,
                    arrIndexPackage : arrIndexPackage,
                    pickInfo : pickInfo,
                    modelMatrix : modelMatrix,
                    boundingVolume : geodeBoundingVolume,
                    material : material
                });
            }
        }
        if(!defined(pagelod.boundingVolume)) {
            let arr = [];
            for(let key in geoMap) {
                if(geoMap.hasOwnProperty(key)) {
                    arr.push(geoMap[key].boundingVolume);
                }
            }
            pagelod.boundingVolume = BoundingSphere.fromBoundingSpheres(arr);
        }
        pagelod.geoMap = geoMap;
    }

    function parsePagelods(layer, content, materialTable) {
        let groupNode = content.groupNode;
        let pagelods = [];
        for(let i = 0, j = groupNode.pageLods.length;i < j; i++){
            let pagelod = {};
            let pagelodNode = groupNode.pageLods[i];
            pagelod.rangeMode = pagelodNode.rangeMode;
            pagelod.rangeDataList = pagelodNode.childTile;
            pagelod.rangeList = pagelodNode.rangeList;
            let center = pagelodNode.boundingSphere.center;
            let radius = pagelodNode.boundingSphere.radius;
            if(pagelod.rangeDataList !== ''){
                pagelod.boundingVolume = {
                    sphere : {
                        center : new Cartesian3(center.x, center.y, center.z),
                        radius : radius
                    }
                };
            }
            else{
                pagelod.isLeafTile = true;
            }
            parseGeodes(layer, content, materialTable, pagelodNode, pagelod);
            pagelods.push(pagelod);
        }
        return pagelods;
    }

    S3MContentParser.parse = function(layer, content) {
        if(!defined(content)) {
            return ;
        }
        let materialTable = parseMaterial(layer.context, content);
        let pagelods = parsePagelods(layer, content, materialTable);
        return pagelods;
    };

export default S3MContentParser;
