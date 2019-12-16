/**
 *  主要功能入口，初始化菜单，页面标题等
 */
import mEvent from './mapEvent'
import sEvent from './sceneEvent'

export default {
  mEvent,
  sEvent,
  addMarkersAndEntities (items) {
    mEvent.addMarkers(items)
  }
}
