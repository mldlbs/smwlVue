/* eslint-disable */
/**
 * 专题图 leaflet
 * @author
 * 2016.8.9
 */
export default {
  /**
   * 分段专题服务查询
   * @param cfg
   */
  initSectionTheme (cfg) {
    if (this.verifyCfg(cfg, 'initSectionTheme')) {
      const themeService = L.supermap.themeService(cfg.url)
      const items = []
      cfg.themeRanges.forEach((v) => {
        const c = v.color.split(',')
        items.push(new SuperMap.ThemeRangeItem({
          start: v.start,
          end: v.end,
          style: new SuperMap.ServerStyle({
            fillForeColor: new SuperMap.ServerColor(parseInt(c[0]), parseInt(c[1]), parseInt(c[2])),
            lineColor: new SuperMap.ServerColor(167, 167, 167),
            lineWidth: 0.01
          })
        }))
      })
      const themeRange = new SuperMap.ThemeRange({
        rangeExpression: cfg.tag,
        rangeMode: SuperMap.RangeMode.EQUALINTERVAL,
        items
      })
      const themeParameters = new SuperMap.ThemeParameters({
        datasetNames: [cfg.dataSetName],
        dataSourceNames: [cfg.dataSourceName],
        joinItems: null,
        themes: [themeRange]
      })
      themeService.getThemeInfo(themeParameters, cfg.success)
    } else {
      console.log('参数不完整')
    }
  },

  /**
   * 单值专题服务查询
   * @param cfg
   */
  initIndividualTheme (cfg) {
    if (this.verifyCfg(cfg, 'initIndividualTheme')) {
      const defultStyle = new SuperMap.ServerStyle({
        fillForeColor: new SuperMap.ServerColor(248, 203, 249),
        lineColor: new SuperMap.ServerColor(255, 255, 255),
        lineWidth: 0.1
      })
      const themeService = L.supermap.themeService(cfg.url)
      const items = []
      cfg.themeUniques.forEach((v) => {
        const c = v.color.split(',')
        items.push(new SuperMap.ThemeUniqueItem({
          unique: v.unique,
          style: new SuperMap.ServerStyle({
            fillForeColor: new SuperMap.ServerColor(parseInt(c[0]), parseInt(c[1]), parseInt(c[2])),
            lineColor: new SuperMap.ServerColor(167, 167, 167),
            lineWidth: 0.01
          })
        }))
      })
      const themeUnique = new SuperMap.ThemeUnique({
        uniqueExpression: cfg.tag,
        items,
        defaultStyle: defultStyle

      })
      const themeParameters = new SuperMap.ThemeParameters({
        datasetNames: [cfg.dataSetName],
        dataSourceNames: [cfg.dataSourceName],
        themes: [themeUnique]
      })
      themeService.getThemeInfo(themeParameters, cfg.success)
    } else {
      console.log('参数不完整')
    }
  },

  /**
   * 单值专题服务查询
   * @param cfg
   */
  initGridTheme (cfg) {
    if (this.verifyCfg(cfg, 'initGridTheme')) {
      const themeService = L.supermap.themeService(cfg.url)
      const items = []
      cfg.themeRanges.forEach((v) => {
        const c = v.color.split(',')
        items.push(new SuperMap.ThemeGridRangeItem({
          start: v.start,
          end: v.end,
          color: new SuperMap.ServerColor(parseInt(c[0]), parseInt(c[1]), parseInt(c[2]))
        }))
      })
      const themeRange = new SuperMap.ThemeGridRange({
        reverseColor: false,
        rangeMode: SuperMap.RangeMode.EQUALINTERVAL,
        items
      })
      const themeParameters = new SuperMap.ThemeParameters({
        datasetNames: [cfg.dataSetName],
        dataSourceNames: [cfg.dataSourceName],
        joinItems: null,
        themes: [themeRange]
      })
      themeService.getThemeInfo(themeParameters, cfg.success)
    } else {
      console.log('参数不完整')
    }
  },

  /**
   * 验证必填项
   */
  verifyCfg (cfg, fnc) {
    let isVerifyPass = true
    switch (fnc) {
      case 'initSectionTheme':
        if (!cfg.url || !cfg.dataSetName || !cfg.dataSourceName || !cfg.success || !cfg.themeRanges || !cfg.tag) {
          isVerifyPass = false
        }
        break
      case 'initIndividualTheme':
        if (!cfg.url || !cfg.dataSetName || !cfg.dataSourceName || !cfg.success || !cfg.themeUniques || !cfg.tag) {
          isVerifyPass = false
        }
        break
      case 'initGridTheme':
        if (!cfg.url || !cfg.dataSetName || !cfg.dataSourceName || !cfg.success || !cfg.themeRanges) {
          isVerifyPass = false
        }
        break
      default:
        isVerifyPass = true
        break
    }
    return isVerifyPass
  }
}
