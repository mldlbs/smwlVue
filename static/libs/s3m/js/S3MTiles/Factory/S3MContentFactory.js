/* eslint-disable */
import S3MCacheFileRenderEntity from './S3MCacheFileRenderEntity'
    let S3MContentFactory = {
        'OSGBCacheFile' : function(options) {
            return new S3MCacheFileRenderEntity(options);
        }
    };
export default S3MContentFactory;
