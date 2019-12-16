import service from '../mapjs/config'
import { plot, StylePanel } from '../libs/supermap/iclient-leaflet/utils/plot'
export default {
  symbolData: null,
  event: plot.event,
  /**
   * 标绘
   * @param item
   */
  doPlot (item) {
    plot.doPlot({ url: service.plotUrl, item })
  },

  /**
   * 取消标绘
   */
  unPlot () {
    plot.unPlot()
  },
  /**
   * 保存态势图
   */
  savePlot () {
    plot.saveSimulationMap()
  },
  /**
   * 加载态势图
   */
  loadPlot () {
    plot.loadSimulationMap()
  },
  /**
   * 创建动画
   * @param cfg
   */
  createAnimation (cfg) {
    plot.createAnimation(cfg.type)
  },
  /**
   * 删除全部动画
   */
  deleteAllAnimation () {
    plot.deleteAllAnimation()
  },
  /**
   * 复位/停止
   */
  reset () {
    plot.reset()
  },
  /**
   * 停止
   */
  stop () {
    plot.stop()
  },

  /**
   * 暂停
   */
  pause () {
    plot.pause()
  },

  /**
   * 播放动画
   */
  play () {
    plot.play()
  },

  /**
   * 删除选中标号
   */
  deleteSymbol () {
    plot.deleteSymbol()
  },

  /**
   * 属性集合
   * @param cfg
   */
  collectionPropertyGridRows (cfg) {
    const rows = StylePanel.collectionPropertyGridRows(cfg.features)
    cfg.callback(rows)
  }
}
