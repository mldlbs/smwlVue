/*eslint-disable*/
/**
 * 动态标绘 leaflet
 * @author gzq
 * 2019.10.30
 */
const Object = {
  url: '',
  pLayer: {},
  pDraw: {},
  pEdit: {},
  plotting: {},
  goAnimationManager: {},
  event: null
}

/**
 * 标绘配置文件
 */
const pConf = {
  group: ['标号', '解除锁定', '对象可见性', '常用:点', '主线', '衬线', '填充', '注记', '子标号'],
  displayName: ['锁定', '可见性', 'LibID', 'Code'],
  displayLineStyleName: ['线宽', '线颜色', '线型', '线透明度'],
  displaySurroundLineName: ['衬线类型', '衬线宽', '衬线颜色', '衬线透明度'],
  displayFillStyleName: ['填充', '填充色', '填充透明度', '渐变填充方式', '填充背景色', '填充背景透明度', '渐变填充角度', '渐变填充水平偏移', '渐变填充竖直偏移'],
  displayNameDot: ['旋转角度', '随图缩放', '镜像', '标号级别', '位置点偏移', '偏移线类型', '宽高锁定', '标号Width', '标号Height'],
  displayTextContentName: ['注记内容', '注记位置', '注记大小', '注记颜色', '注记字体', '注记距离', '字间距', '字宽百分比', '字体描边', '描边色', '描边宽度', '文字背景', '背景色', '文字阴影', '阴影色', '阴影偏移量X', '阴影偏移量Y'],
  groupNew: ['组合类型', '箭头类型', '沿线类型', '边框属性', '半径', '轨道设置', '节点设置', '连线类型', '折线设置'],
  displayNameNew: ['箭头', '箭身', '箭尾', '起始', '终止', '路径线', '贝塞尔曲线', '显示箭头', '避让', '标注框边框', '圆角边框', '对象标注边框', '半径类型', '半径角度', '注记一', '注记二', '卫星轨道', '节点类型', '节点旋转角度', '对象间连线', '折线显示', '文字对齐方式'],
  fontName: ['字体描边', '描边色', '描边宽度', '文字背景', '背景色', '文字阴影', '阴影色', '阴影偏移量X', '阴影偏移量Y', '字间距', '字宽百分比']
}

/**
 * 初始化标绘控件
 * @param cfg
 */
export function initPlot(cfg) {
  Object.pLayer = L.supermap.plotting.plottingLayer('Plot', cfg.url)// 标绘图层
  Object.pLayer.addTo(cfg.layerGroup)
  Object.pDraw = L.supermap.plotting.drawControl(Object.pLayer)
  Object.pDraw.addTo(cfg.layerGroup)
  Object.pEdit = L.supermap.plotting.editControl()
  Object.pEdit.addTo(cfg.layerGroup)
  initPlotPanel(cfg)
  initStylePanel(cfg)
  Object.plotting = L.supermap.plotting.getControl(cfg.layerGroup, cfg.url)
  Object.goAnimationManager = Object.plotting.getGOAnimationManager()
  /* setInterval(() => {
    plot.execute()
  }, 100) */
}

/**
 * 标绘工具
 * @type {{}}
 */
export const plot = {
  /**
   * 标绘
   * @param cfg
   */
  doPlot (cfg) {
    if (Object.pDraw !== null) {
      Object.pDraw.handler.disable();
      Object.pDraw.handler.libID = cfg.item.libID
      Object.pDraw.handler.code = cfg.item.symbolCode
      Object.pDraw.handler.serverUrl = cfg.url
      Object.pDraw.handler.enable()
    }
  },

  /**
   * 取消标绘
   */
  unPlot () {
    if (Object.pDraw !== null) {
      Object.pDraw.handler.disable()
    }
  },

  /**
   * 保存态势图
   */
  saveSimulationMap (cfg) {
    this.unPlot()
    Object.plotting.getSitDataManager().saveAsSmlFile(cfg.smlFileName || 'situationMap2', function (res) {
      // eslint-disable-next-line no-console
      console.log(res)
    })
  },

  /**
   * 加载态势图
   */
  loadSimulationMap (cfg) {
    Object.plotting.getSitDataManager().openSmlFileOnServer(cfg.smlFileName || 'situationMap2', function (evt) {
      Object.pDraw.setDrawingLayer(evt.sitDataLayers[0])
    })
  },

  /**
   * 删除选中标号
   */
  deleteSymbol () {
    Object.pEdit.deleteSelectedFeatures()
  },

  /**
   * 清空绘制
   */
  clearLayer (cfg) {
    this.unPlot()
    // 需要清除数据
  }
}

/**
 * 播放动画
 * @type {{}}
 */
export const Animation = {
  /**
   * 播放动画
   */
  play () {
    if (Object.goAnimationManager.goAnimations === null) {
      return
    }
    for (let i = 0; i < Object.goAnimationManager.goAnimations.length; i++) {
      Object.goAnimationManager.goAnimations[i].play()
    }
  },

  /**
   * 暂停
   */
  pause () {
    if (Object.goAnimationManager.goAnimations === null) {
      return
    }
    for (let i = 0; i < Object.goAnimationManager.goAnimations.length; i++) {
      Object.goAnimationManager.goAnimations[i].pause()
    }
  },

  /**
   * 停止
   */
  stop () {
    if (Object.goAnimationManager.goAnimations === null) {
      return
    }
    for (let i = 0; i < Object.goAnimationManager.goAnimations.length; i++) {
      Object.goAnimationManager.goAnimations[i].stop()
    }
  },

  /**
   * 复位
   */
  reset () {
    if (Object.goAnimationManager.goAnimations === null) {
      return
    }
    for (let i = 0; i < Object.goAnimationManager.goAnimations.length; i++) {
      Object.goAnimationManager.goAnimations[i].reset()
    }
  },
  /**
   * 执行动画
   */
  execute () {
    Object.goAnimationManager.execute()
  },

  /**
   * 删除动画
   * @param cfg
   */
  deleteSelectedFeaturesAnimation (cfg) {
    if (Object.goAnimationManager.goAnimations === null) {
      return
    }
    if (Object.pEdit.getSelectedFeatures().length === 0) {
      return
    }
    const selectFeature = Object.pEdit.getSelectedFeatures()[0]
    const animations = Object.goAnimationManager.findGOAnimationsByFeature(selectFeature)
    for (let i = 0; i < animations.length; i++) {
      Object.goAnimationManager.removeGOAnimation(animations[i])
    }
  },

  /**
   * 删除全部动画
   */
  deleteAllAnimation (cfg) {
    if (Object.goAnimationManager.goAnimations === null) {
      return
    }
    Object.goAnimationManager.reset()
    Object.goAnimationManager.removeAllGOAnimation()
  },

  /**
   * 创建动画
   */
  createAnimation (cfg) {
    if (Object.pEdit.getSelectedFeatures().length === 0) {
      return
    }
    const obj = selectAnimationType(cfg.type)
    const feature = Object.pEdit.getSelectedFeatures()[0]
    const goAnimationNameUUid = SuperMap.this.PlottingUtil.generateUuid()
    const goAnimationName = obj.selectValue + goAnimationNameUUid

    const goAnimation = Object.goAnimationManager.createGOAnimation(obj.animationType, goAnimationName, feature)
    switch (goAnimation.getGOAnimationType()) {
      case SuperMap.this.GOAnimationType.ANIMATION_ATTRIBUTE: { // 属性动画
        // goAnimation.startTime=0;//开始时间
        // goAnimation.duration=5;//间隔时间
        // goAnimation.repeat = true;//重复播放
        goAnimation.lineColorAnimation = true// 线色动画
        goAnimation.startLineColor = '#ff0000'// 开始线色
        goAnimation.endLineColor = '#1a1817'// 结束线色

        goAnimation.lineWidthAnimation = true// 线宽动画
        goAnimation.startLineWidth = 1// 开始线宽
        goAnimation.endLineWidth = 5// 结束线宽

        goAnimation.surroundLineColorAnimation = true// 衬线动画
        goAnimation.startSurroundLineColor = '#ffff00'// 开始衬线色
        goAnimation.endSurroundLineColor = '#009933'// 结束衬线色

        goAnimation.surroundLineWidthAnimation = true// 衬线宽
        goAnimation.startSurroundLineWidth = 2// 开始衬线宽
        goAnimation.endSurroundLineWidth = 4// 结束衬线宽
        break
      }
      case SuperMap.this.GOAnimationType.ANIMATION_BLINK: { // 闪烁动画
        // goAnimation.startTime = 5;
        // goAnimation.duration = 5;
        // goAnimation.repeat = true;//重复播放
        // 闪烁类型：次数闪烁
        goAnimation.blinkStyle = SuperMap.this.BlinkAnimationBlinkStyle.Blink_Number
        goAnimation.blinkNumber = 5// 闪烁次数
        // 闪烁类型：频率闪烁
        // goAnimation.blinkStyle = SuperMap.this.BlinkAnimationBlinkStyle.Blink_Frequency;
        // goAnimation.blinkInterval = 500;//闪烁频率
        // 闪烁颜色交替类型:无颜色交替
        // goAnimation.replaceStyle =  SuperMap.this.BlinkAnimationReplaceStyle.Replace_NoColor;
        // 闪烁颜色交替类型：有颜色交替
        goAnimation.replaceStyle = SuperMap.this.BlinkAnimationReplaceStyle.Replace_Color
        goAnimation.startColor = '#00ff00'
        goAnimation.endColor = '#ff0000'
        break
      }
      case SuperMap.this.GOAnimationType.ANIMATION_GROW: { // 生长动画
        // goAnimation.startTime =10;
        // goAnimation.duration = 5;
        // goAnimation.repeat = true;
        goAnimation.startScale = 0
        goAnimation.endScale = 1
        break
      }
      case SuperMap.this.GOAnimationType.ANIMATION_ROTATE: { // 旋转动画
        // goAnimation.startTime = 15;
        // goAnimation.duration = 5;
        // goAnimation.repeat = true;
        goAnimation.rotateDirection = SuperMap.this.RotateDirection.AntiClockWise// 逆时针旋转
        // goAnimation.rotateDirection = SuperMap.this.RotateDirection.ClockWise;//顺时针旋转
        goAnimation.startAngle = 0
        goAnimation.endAngle = 90
        break
      }
      case SuperMap.this.GOAnimationType.ANIMATION_SCALE: { // 比例动画
        // goAnimation.startTime = 20;
        // goAnimation.duration = 5;
        // goAnimation.repeat = true;
        goAnimation.startScale = 1
        goAnimation.endScale = 2
        break
      }
      case SuperMap.this.GOAnimationType.ANIMATION_SHOW: { // 显隐动画
        // goAnimation.startTime=25;//开始时间
        // goAnimation.duration=5;//间隔时间
        // goAnimation.repeat = true;//重复播放
        goAnimation.finalDisplay = true
        goAnimation.showEffect = true
        break
      }
      case SuperMap.this.GOAnimationType.ANIMATION_WAY: { // 路径动画
        // goAnimation.startTime = 30;//开始时间
        // goAnimation.duration = 5;//间隔时间
        // goAnimation.repeat = true;//是否重复播放
        const arypts = []
        const pt = L.latLng(44, 88)
        const pt1 = L.latLng(30, 91)
        const pt2 = L.latLng(37, 102)
        const pt3 = L.latLng(30, 106)
        const pt4 = L.latLng(34, 109)
        const pt5 = L.latLng(35, 114)
        const pt6 = L.latLng(40, 116)

        arypts.push(pt)
        arypts.push(pt1)
        arypts.push(pt2)
        arypts.push(pt3)
        arypts.push(pt4)
        arypts.push(pt5)
        arypts.push(pt6)
        goAnimation.setWayPoints(arypts)

        // 路径类型：折线类型
        goAnimation.pathType = SuperMap.this.WayPathType.POLYLINE
        // 路径类型：曲线路径
        // goAnimation.pathType=SuperMap.this.WayPathType.CURVE;

        goAnimation.pathColor = '#005eff'
        goAnimation.pathWidth = 3
        // 是否是切线方向
        goAnimation.tangentDirection = true
        goAnimation.setShowPath(true)
        break
      }
    }
    console.log(goAnimation)
  }
}

/**
 * 属性面板
 * @type {{}}
 */
export const StylePanel = {
  /**
   * 编辑完属性
   * @param rowIndex
   * @param rowData
   * @param changes
   */
  afterModifySelectFeature(rowIndex, rowData, changes) {
  },
  /**
   * 更新选择的要素
   * @param updated
   * @param selectfeatures
   */
  updateSelectFeature(updated, selectfeatures) {
    const transaction = new SuperMap.Plot.Transaction()
    Object.plotting.getTransManager().add(transaction)
    for (let i = 0; i < selectfeatures.length; i++) {
      const transInfo = new SuperMap.Plot.TransactionInfo()
      transInfo.layerId = selectfeatures[i].layer._leaflet_id
      transInfo.uuid = selectfeatures[i].uuid
      if (updated != null) {
        switch ('锁定') {
          case pConf.displayName[0]:
            transInfo.functionName = 'setLocked'
            transInfo.undoParams = [selectfeatures[i].getLocked()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setLocked(fromCheckboxValue(updated.value))
            break
          case pConf.displayName[1]:
            transInfo.propertyName = 'display'
            transInfo.undoValue = selectfeatures[i].style.display
            transInfo.redoValue = updated.value
            selectfeatures[i].setStyle({display: updated.value})
            break
          case pConf.displayLineStyleName[0]:
            transInfo.propertyName = 'weight'
            transInfo.undoValue = selectfeatures[i].style.weight
            transInfo.redoValue = parseInt(updated.value)
            if (selectfeatures[i].symbolType === SuperMap.this.SymbolType.LITERATESIGN) {
              selectfeatures[i].route.applyTextStyle({weight: parseInt(updated.value)})
            } else {
              selectfeatures[i].setStyle({weight: parseInt(updated.value)})
            }
            break
          case pConf.displayLineStyleName[1]:
            transInfo.propertyName = 'color'
            transInfo.undoValue = [selectfeatures[i].style.color]
            transInfo.redoValue = [updated.value]
            if (selectfeatures[i].symbolType === SuperMap.this.SymbolType.LITERATESIGN) {
              selectfeatures[i].route.applyTextStyle({color: updated.value})
            } else {
              selectfeatures[i].setStyle({color: updated.value})
            }
            break
          case pConf.displayLineStyleName[2]:
            transInfo.propertyName = 'lineSymbolID'
            transInfo.undoValue = selectfeatures[i].style.lineSymbolID
            transInfo.redoValue = updated.value
            if (selectfeatures[i].symbolType === SuperMap.this.SymbolType.LITERATESIGN) {
              selectfeatures[i].route.applyTextStyle({lineSymbolID: updated.value})
            } else {
              selectfeatures[i].setStyle({lineSymbolID: updated.value})
            }
            break
          case pConf.displayLineStyleName[3]: {
            let opacity = parseFloat(updated.value) < 0 ? 0 : parseFloat(updated.value)
            opacity = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value)
            transInfo.propertyName = 'opacity'
            transInfo.undoValue = selectfeatures[i].style.opacity
            transInfo.redoValue = opacity
            if (selectfeatures[i].symbolType === SuperMap.this.SymbolType.LITERATESIGN) {
              selectfeatures[i].route.applyTextStyle({opacity})
            } else {
              selectfeatures[i].setStyle({opacity})
            }
          }
            break
          case pConf.displaySurroundLineName[0]:
            transInfo.functionName = 'setSurroundLineType'
            transInfo.undoParams = [selectfeatures[i].getSurroundLineType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setSurroundLineType(parseInt(updated.value))
            break
          case pConf.displaySurroundLineName[1]:
            transInfo.propertyName = 'surroundLineWidth'
            transInfo.undoValue = selectfeatures[i].style.surroundLineWidth
            transInfo.redoValue = parseInt(updated.value)
            selectfeatures[i].setStyle({surroundLineWidth: parseInt(updated.value)})
            break
          case pConf.displaySurroundLineName[2]:
            transInfo.propertyName = 'surroundLineColor'
            transInfo.undoValue = selectfeatures[i].style.surroundLineColor
            transInfo.redoValue = updated.value
            selectfeatures[i].setStyle({surroundLineColor: updated.value})
            break
          case pConf.displaySurroundLineName[3]: {
            let opacity = parseFloat(updated.value) < 0 ? 0 : parseFloat(updated.value)
            opacity = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value)
            transInfo.propertyName = 'surroundLineColorOpacity'
            transInfo.undoValue = selectfeatures[i].style.surroundLineColorOpacity
            transInfo.redoValue = opacity
            selectfeatures[i].setStyle({surroundLineColorOpacity: opacity})
          }
            break
          case pConf.displayFillStyleName[0]:
            transInfo.propertyName = 'fillSymbolID'
            transInfo.undoValue = selectfeatures[i].style.fillSymbolID
            transInfo.redoValue = parseFloat(updated.value)
            selectfeatures[i].style.fillSymbolID = parseFloat(updated.value)
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayFillStyleName[1]:
            transInfo.propertyName = 'fillColor'
            transInfo.undoValue = selectfeatures[i].style.fillColor
            transInfo.redoValue = updated.value
            selectfeatures[i].style.fillColor = updated.value
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayFillStyleName[2]: {
            let opacity = parseFloat(updated.value) < 0 ? 0 : parseFloat(updated.value)
            opacity = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value)
            transInfo.propertyName = 'fillOpacity'
            transInfo.undoValue = selectfeatures[i].style.fillOpacity
            transInfo.redoValue = opacity
            selectfeatures[i].style.fillOpacity = opacity
            selectfeatures[i].setStyle(selectfeatures[i].style)
          }
            break
          case pConf.displayFillStyleName[3]:
            transInfo.propertyName = 'fillGradientMode'
            transInfo.undoValue = selectfeatures[i].style.fillGradientMode
            transInfo.redoValue = updated.value
            selectfeatures[i].style.fillGradientMode = updated.value
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayFillStyleName[4]:
            transInfo.propertyName = 'fillBackColor'
            transInfo.undoValue = selectfeatures[i].style.fillBackColor
            transInfo.redoValue = updated.value
            selectfeatures[i].style.fillBackColor = updated.value
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayFillStyleName[5]:
            let opacity = parseFloat(updated.value) < 0 ? 0 : parseFloat(updated.value)
            opacity = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value)
            transInfo.propertyName = 'fillBackOpacity'
            transInfo.undoValue = selectfeatures[i].style.fillBackOpacity
            transInfo.redoValue = opacity
            selectfeatures[i].style.fillBackOpacity = opacity
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayFillStyleName[6]:
            let angle = parseFloat(updated.value) < 0 ? 0 : parseFloat(updated.value)
            angle = parseFloat(updated.value) >= 360 ? 0 : parseFloat(updated.value)
            transInfo.propertyName = 'fillAngle'
            transInfo.undoValue = selectfeatures[i].style.fillAngle
            transInfo.redoValue = angle
            selectfeatures[i].style.fillAngle = angle
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayFillStyleName[7]:
            let X = parseFloat(updated.value) < -1 ? -1 : parseFloat(updated.value)
            X = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value)
            transInfo.propertyName = 'fillCenterOffsetX'
            transInfo.undoValue = selectfeatures[i].style.fillCenterOffsetX
            transInfo.redoValue = X
            selectfeatures[i].style.fillCenterOffsetX = X
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayFillStyleName[8]:
            let Y = parseFloat(updated.value) < -1 ? -1 : parseFloat(updated.value)
            Y = parseFloat(updated.value) > 1 ? 1 : parseFloat(updated.value)
            transInfo.propertyName = 'fillCenterOffsetY'
            transInfo.undoValue = selectfeatures[i].style.fillCenterOffsetY
            transInfo.redoValue = Y
            selectfeatures[i].style.fillCenterOffsetY = Y
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayNameDot[0]:
            transInfo.functionName = 'setRotate'
            transInfo.undoParams = [selectfeatures[i].getRotate()]
            transInfo.redoParams = [parseFloat(updated.value)]
            selectfeatures[i].setRotate(parseFloat(updated.value))
            break
          case pConf.displayNameDot[1]:
            transInfo.functionName = 'setScaleByMap'
            transInfo.undoParams = [selectfeatures[i].getScaleByMap()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setScaleByMap(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameDot[2]:
            transInfo.functionName = 'setNegativeImage'
            transInfo.undoParams = [selectfeatures[i].getNegativeImage()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setNegativeImage(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameDot[3]:
            transInfo.functionName = 'setSymbolRank'
            transInfo.undoParams = [selectfeatures[i].getSymbolRank()]
            transInfo.redoParams = [updated.value]
            selectfeatures[i].setSymbolRank(updated.value)
            break
          case pConf.displayNameDot[4]:
            transInfo.functionName = 'setPositionOffset'
            transInfo.undoParams = [selectfeatures[i].getPositionOffset()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setPositionOffset(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameDot[5]:
            transInfo.functionName = 'setPositionOffsetType'
            transInfo.undoParams = [selectfeatures[i].getPositionOffsetType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setPositionOffsetType(parseInt(updated.value))
            break
          case pConf.displayNameDot[6]:
            transInfo.functionName = 'setWidthHeightLimit'
            transInfo.undoParams = [selectfeatures[i].getWidthHeightLimit()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setWidthHeightLimit(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameDot[7]:
            transInfo.functionName = 'setSymbolSize'
            transInfo.undoParams = [selectfeatures[i].getSymbolSize().w]
            transInfo.redoParams = [parseFloat(updated.value), selectfeatures[i].getSymbolSize().h]
            selectfeatures[i].setSymbolSize(updated.value, selectfeatures[i].getSymbolSize().h)
            break
          case pConf.displayNameDot[8]:
            transInfo.functionName = 'setSymbolSize'
            transInfo.undoParams = [selectfeatures[i].getSymbolSize().h]
            transInfo.redoParams = [selectfeatures[i].getSymbolSize().w, parseFloat(updated.value)]
            selectfeatures[i].setSymbolSize(selectfeatures[i].getSymbolSize().w, updated.value)
            break
          case pConf.displayTextContentName[0]:
            /* ?? */
            if (selectfeatures[i].symbolType === SuperMap.this.SymbolType.SYMBOLTEXT) {
              transInfo.functionName = 'updateSymbolText'
              transInfo.undoParams = [selectfeatures[i].symbolTexts[0].clone(), 0]
              selectfeatures[i].symbolTexts[0].textContent = updated.value
              selectfeatures[i].updateSymbolText(selectfeatures[i].symbolTexts[0], 0)
              transInfo.redoParams = [selectfeatures[i].symbolTexts[0], 0]
            } else if (selectfeatures[i].symbolType === SuperMap.this.SymbolType.SYMBOLTEXT1 ||
              selectfeatures[i].symbolType === SuperMap.this.SymbolType.PATHTEXT) {
              transInfo.functionName = 'setTextContent'
              transInfo.undoParams = [selectfeatures[i].getTextContent()]
              const updatedValueStr = updated.value
              const textContent = updatedValueStr.split(',')
              transInfo.redoParams = [textContent]
              selectfeatures[i].setTextContent(textContent)
            } else {
              transInfo.functionName = 'setTextContent'
              transInfo.undoParams = [selectfeatures[i].getTextContent()]
              transInfo.redoParams = [updated.value]
              selectfeatures[i].setTextContent(updated.value)
            }
            break
          case pConf.displayTextContentName[0] + '2':
            selectfeatures[i].symbolTexts[1].textContent = updated.value
            selectfeatures[i].redraw()
            break
          case pConf.displayTextContentName[1]:
            if (selectfeatures[i].symbolType === SuperMap.this.SymbolType.PATHTEXT) {
              transInfo.functionName = 'setRelLineText'
              transInfo.undoParams = [selectfeatures[i].getRelLineText()]
              transInfo.redoParams = [parseInt(updated.value)]
              selectfeatures[i].setRelLineText(parseInt(updated.value))
            } else {
              transInfo.functionName = 'setTextPosition'
              transInfo.undoParams = [selectfeatures[i].getTextPosition()]
              transInfo.redoParams = [parseInt(updated.value)]
              selectfeatures[i].setTextPosition(parseInt(updated.value))
            }
            break
          case pConf.displayTextContentName[2]:
            transInfo.propertyName = 'fontSize'
            transInfo.undoValue = selectfeatures[i].style.fontSize
            transInfo.redoValue = parseFloat(updated.value)
            selectfeatures[i].setStyle({fontSize: parseFloat(updated.value)})
            break
          case pConf.displayTextContentName[3]:
            transInfo.propertyName = 'fontColor'
            transInfo.undoValue = selectfeatures[i].style.fontColor
            transInfo.redoValue = updated.value
            selectfeatures[i].setStyle({fontColor: updated.value})
            break
          case pConf.displayTextContentName[4]:
            transInfo.propertyName = 'fontFamily'
            transInfo.undoValue = selectfeatures[i].style.fontFamily
            transInfo.redoValue = updated.value
            selectfeatures[i].setStyle({fontFamily: updated.value})
            break
          case pConf.displayTextContentName[5]:
            if (selectfeatures[i].symbolType === SuperMap.this.SymbolType.SYMBOLTEXT1) {
              selectfeatures[i].space = updated.value
            } else {
              transInfo.functionName = 'setSpace'
              transInfo.undoParams = [selectfeatures[i].getSpace()]
              transInfo.redoParams = [parseInt(updated.value)]
              selectfeatures[i].setSpace(parseInt(updated.value))
            }
            break
          case pConf.displayTextContentName[6]:
            transInfo.propertyName = 'fontSpace'
            transInfo.undoValue = selectfeatures[i].style.fontSpace
            transInfo.redoValue = parseInt(updated.value)
            selectfeatures[i].style.fontSpace = parseInt(updated.value)
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[7]:
            transInfo.propertyName = 'fontPercent'
            transInfo.undoValue = selectfeatures[i].style.fontPercent
            transInfo.redoValue = parseInt(updated.value)
            selectfeatures[i].style.fontPercent = parseInt(updated.value)
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[8]:
            transInfo.propertyName = 'fontStroke'
            transInfo.undoValue = selectfeatures[i].style.fontStroke
            transInfo.redoValue = fromCheckboxValue(updated.value)
            selectfeatures[i].style.fontStroke = fromCheckboxValue(updated.value)
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[9]:
            transInfo.propertyName = 'fontStrokeColor'
            transInfo.undoValue = selectfeatures[i].style.fontStrokeColor
            transInfo.redoValue = updated.value
            selectfeatures[i].style.fontStrokeColor = updated.value
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[10]:
            transInfo.propertyName = 'fontStrokeWidth'
            transInfo.undoValue = selectfeatures[i].style.fontStrokeWidth
            transInfo.redoValue = parseInt(updated.value)
            selectfeatures[i].style.fontStrokeWidth = parseInt(updated.value)
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[11]:
            transInfo.propertyName = 'fontBackground'
            transInfo.undoValue = selectfeatures[i].style.fontBackground
            transInfo.redoValue = fromCheckboxValue(updated.value)
            selectfeatures[i].style.fontBackground = fromCheckboxValue(updated.value)
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[12]:
            transInfo.propertyName = 'fontBackgroundColor'
            transInfo.undoValue = selectfeatures[i].style.fontBackgroundColor
            transInfo.redoValue = updated.value
            selectfeatures[i].style.fontBackgroundColor = updated.value
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[13]:
            transInfo.propertyName = 'fontShadow'
            transInfo.undoValue = selectfeatures[i].style.fontShadow
            transInfo.redoValue = fromCheckboxValue(updated.value)
            selectfeatures[i].style.fontShadow = fromCheckboxValue(updated.value)
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[14]:
            transInfo.propertyName = 'fontShadowColor'
            transInfo.undoValue = selectfeatures[i].style.fontShadowColor
            transInfo.redoValue = updated.value
            selectfeatures[i].style.fontShadowColor = updated.value
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[15]:
            transInfo.propertyName = 'fontShadowOffsetX'
            transInfo.undoValue = selectfeatures[i].style.fontShadowOffsetX
            transInfo.redoValue = parseInt(updated.value)
            selectfeatures[i].style.fontShadowOffsetX = parseInt(updated.value)
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayTextContentName[16]:
            transInfo.propertyName = 'fontShadowOffsetY'
            transInfo.undoValue = selectfeatures[i].style.fontShadowOffsetY
            transInfo.redoValue = parseInt(updated.value)
            selectfeatures[i].style.fontShadowOffsetY = parseInt(updated.value)
            selectfeatures[i].setStyle(selectfeatures[i].style)
            break
          case pConf.displayNameNew[0]:
            transInfo.functionName = 'setArrowHeadType'
            transInfo.undoParams = [selectfeatures[i].getArrowHeadType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setArrowHeadType(parseInt(updated.value))
            break
          case pConf.displayNameNew[1]:
            transInfo.functionName = 'setArrowBodyType'
            transInfo.undoParams = [selectfeatures[i].getArrowBodyType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setArrowBodyType(parseInt(updated.value))
            break
          case pConf.displayNameNew[2]:
            transInfo.functionName = 'setArrowTailType'
            transInfo.undoParams = [selectfeatures[i].getArrowTailType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setArrowTailType(parseInt(updated.value))
            break
          case pConf.displayNameNew[3]:
            transInfo.functionName = 'setStartArrowType'
            transInfo.undoParams = [selectfeatures[i].getStartArrowType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setStartArrowType(parseInt(updated.value))
            break
          case pConf.displayNameNew[4]:
            transInfo.functionName = 'setEndArrowType'
            transInfo.undoParams = [selectfeatures[i].getEndArrowType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setEndArrowType(parseInt(updated.value))
            break
          case pConf.displayNameNew[5]:
            transInfo.functionName = 'setShowPathLine'
            transInfo.undoParams = [selectfeatures[i].getShowPathLine()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setShowPathLine(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameNew[6]:
            transInfo.functionName = 'setCurveLine'
            transInfo.undoParams = [selectfeatures[i].getIsCurveLine()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setCurveLine(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameNew[7]:
            transInfo.functionName = 'setShowPathLineArrow'
            transInfo.undoParams = [selectfeatures[i].getShowPathLineArrow()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setShowPathLineArrow(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameNew[8]:
            transInfo.functionName = 'setAvoidLine'
            transInfo.undoParams = [selectfeatures[i].getIsAvoidLine()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setAvoidLine(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameNew[9]:
            transInfo.functionName = 'setTextBoxType'
            transInfo.undoParams = [selectfeatures[i].getTextBoxType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setTextBoxType(parseInt(updated.value))
            break
          case pConf.displayNameNew[10]:
            transInfo.functionName = 'setRoundBox'
            transInfo.undoParams = [selectfeatures[i].getRoundBox()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setRoundBox(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameNew[11]:
            transInfo.functionName = 'setFrame'
            transInfo.undoParams = [selectfeatures[i].getFrame()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setFrame(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameNew[12]:
            transInfo.functionName = 'setRadiusLineType'
            transInfo.undoParams = [selectfeatures[i].getRadiusLineType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setRadiusLineType(parseInt(updated.value))
            break
          case pConf.displayNameNew[13]:
            transInfo.functionName = 'setRadiusTextPos'
            transInfo.undoParams = [selectfeatures[i].getRadiusTextPos()]
            transInfo.redoParams = [updated.value]
            selectfeatures[i].setRadiusTextPos(updated.value)
            break
          case pConf.displayNameNew[14]:
            transInfo.functionName = 'setRadiusText'
            transInfo.undoParams = [selectfeatures[i].radiusText[0], 0]
            transInfo.redoParams = [updated.value, 0]
            selectfeatures[i].setRadiusText(updated.value, 0)
            break
          case pConf.displayNameNew[15]:
            transInfo.functionName = 'setRadiusText'
            transInfo.undoParams = [selectfeatures[i].radiusText[1], 1]
            transInfo.redoParams = [updated.value, 1]
            selectfeatures[i].setRadiusText(updated.value, 1)
            break
          case pConf.displayNameNew[16]:
            transInfo.functionName = 'setVisible'
            transInfo.undoParams = [selectfeatures[i].getVisible()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setVisible(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameNew[17]:
            transInfo.functionName = 'setType'
            transInfo.undoParams = [selectfeatures[i].routeNode.type]
            transInfo.redoParams = [updated.value]
            selectfeatures[i].setType(updated.value)
            break
          case pConf.displayNameNew[18]:
            transInfo.functionName = 'setRotate'
            transInfo.undoParams = [selectfeatures[i].getRotate()]
            transInfo.redoParams = [parseFloat(updated.value)]
            selectfeatures[i].setRotate(parseFloat(updated.value))
            break
          case pConf.displayNameNew[19]:
            transInfo.functionName = 'setLineRelationType'
            transInfo.undoParams = [selectfeatures[i].getLineRelationType()]
            transInfo.redoParams = [parseInt(updated.value)]
            selectfeatures[i].setLineRelationType(parseInt(updated.value))
            break
          case pConf.displayNameNew[20]:
            transInfo.functionName = 'setPolylineConnectLocationPoint'
            transInfo.undoParams = [selectfeatures[i].getPolylineConnectLocationPoint()]
            transInfo.redoParams = [fromCheckboxValue(updated.value)]
            selectfeatures[i].setPolylineConnectLocationPoint(fromCheckboxValue(updated.value))
            break
          case pConf.displayNameNew[21]:
            transInfo.functionName = 'setFontAlign'
            transInfo.undoParams = [selectfeatures[i].style.labelAlign]
            transInfo.redoParams = [fontAlignTypeValue(updated.value)]
            selectfeatures[i].setFontAlign(fontAlignTypeValue(updated.value))
            break
        }
        if (updated.group === pConf.group[8]) {
          if (updated.name === pConf.displayName[2]) {
            if (updated.value !== null) {
              transInfo.propertyName = 'libID'
              transInfo.undoValue = selectfeatures[i].getSubSymbols()[updated.index].libID
              transInfo.redoValue = parseInt(updated.value)
              selectfeatures[i].subSymbols[0].libID = parseInt(updated.value)
            }
          }
          if (updated.name === pConf.displayName[3]) {
            const code = parseInt(updated.value)
            if (selectfeatures[i].symbolType === SuperMap.this.SymbolType.NODECHAIN && code != null) {
              const symbolLibManager = L.supermap.plotting.symbolLibManager(serverUrl)
              const subCode = symbolLibManager.findSymbolByCode(code)
              if (subCode.length !== 0 && subCode[0].symbolType === 'SYMBOL_DOT') {
                transInfo.functionName = 'setSubSymbol'
                if (selectfeatures[i].getSubSymbols()[updated.index]) {
                  transInfo.undoParams = [selectfeatures[i].getSubSymbols()[updated.index].code, updated.index, subCode[0].libID]
                } else {
                  transInfo.undoParams = [-1, updated.index]
                }
                transInfo.redoParams = [code, updated.index, subCode[0].libID]
                selectfeatures[i].setSubSymbol(code, updated.index, subCode[0].libID)
              }
            } else if (code !== null) {
              transInfo.functionName = 'setSubSymbol'
              if (selectfeatures[i].getSubSymbols()[updated.index]) {
                transInfo.undoParams = [selectfeatures[i].getSubSymbols()[updated.index].code, updated.index, selectfeatures[i].getSubSymbols()[updated.index].libID]
              } else {
                transInfo.undoParams = [-1, updated.index]
              }
              transInfo.redoParams = [code, updated.index]
              selectfeatures[i].setSubSymbol(code, updated.index)
            }
          }
        }
      }
      transaction.transInfos.push(transInfo)
    }
  },
  /**
   * 标号
   * @param features
   * @returns {[]|*[]}
   */
  collectionPropertyGridRows(features) {
  let rows = []
  if (features.length === 0) {
    return []
  }
  const dotSelectFeatures = []
  const algoSelectFeatures = []
  const sameFeatures = []
  const otherFeatures = []
  let selectfeatures = null
  for (let i = 0; i < features.length; i++) {
    if (features[i].libID === features[0].libID && features[i].code === features[0].code) {
      sameFeatures.push(features[i])// 是否是同一个标号
    }
  }
  if (sameFeatures.length !== features.length) {
    for (let i = 0; i < features.length; i++) {
      if (features[i].symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL) {
        dotSelectFeatures.push(features[i])// 是否全是不同点标号
      } else if (features[i].symbolType === SuperMap.Plot.SymbolType.ALGOSYMBOL) {
        algoSelectFeatures.push(features[i]) // 是否全是不同线面标号
      } else {
        otherFeatures.push(features[i])
      }
    }
  }
  if (sameFeatures.length === features.length) {
    selectfeatures = features
  } else if (dotSelectFeatures.length === features.length) {
    selectfeatures = dotSelectFeatures
  } else if (algoSelectFeatures.length === features.length) {
    selectfeatures = algoSelectFeatures
  } else if (dotSelectFeatures.length > 0 && algoSelectFeatures.length > 0 && otherFeatures.length === 0) {
    selectfeatures = features
  } else if (otherFeatures.length > 0) {
    selectfeatures = features
  }
  const selectfeature = selectfeatures[0]

  if (selectfeatures.length === sameFeatures.length) {
    rows = [
      {'name': '标号几何ID', 'value': selectfeature.symbolType, 'group': '标号'},
      {'name': '标号库ID', 'value': selectfeature.libID, 'group': '标号'},
      {'name': '标号Code', 'value': selectfeature.code, 'group': '标号'},
      {'name': '标号名字', 'value': selectfeature.symbolName, 'group': '标号'}
    ]
  }
  const lockedObj = {}
  lockedObj.name = pConf.displayName[8]
  lockedObj.value = checkboxValueToString(selectfeature.getLocked())
  lockedObj.group = pConf.group[10]
  lockedObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}
  rows.push(lockedObj)
  if (selectfeature.getLocked()) {
    return rows
  }

  const annotationRows = getAnnotationRows(selectfeature)
  const relLineTextRows = getRelLineTextRows(selectfeature.relLineText)
  const symbolRankRows = getSymbolRankRows(selectfeature)
  const surroundLineTypeRows = getSurroundLineTypeRows(selectfeature.symbolType)
  const displayRows = getDisplayRows()
  const showRows = getShowRows()
  const fillGradinetRows = getFillGradientModeRows()
  const arrowTypeStart = getArrowTypeRows(selectfeature)
  const arrowTypeEnd = getArrowTypeRows(selectfeature)
  const radiusTypeRows = getRadiusTypeRows(selectfeature)
  const lineStyleRows = getLineStyleRows()
  const routeNodeTypeRows = getRouteNodeTypeRows()
  const positionOffsetTypeRows = getPositionOffsetTypeRows() // 偏移线类型
  const textBoxTypeRows = getTextBoxTypeRows()
  const lineMarkingTypeRows = getLineMarkingTypeRows()
  const arrowHeadTypeRows = getArrowHeadTypeRows()
  const arrowBodyTypeRows = getArrowBodyTypeRows()
  const arrowTailTypeRows = getArrowTailTypeRows()
  const lineRelationTypeRows = getLineRelationTypeRows()
  const subSymbolsTypeRows = getSubSymbolsTypeRows(selectfeature)
  // 基本0：
  // 可见性
  const visibilityObj = {}
  visibilityObj.name = pConf.displayName[9]
  visibilityObj.value = displayToString(selectfeature.style.display)
  visibilityObj.group = pConf.group[0]
  visibilityObj.editor = {
    'type': 'combobox',
    'options': {'valueField': 'value', 'textField': 'text', 'data': displayRows}
  }
  // 线形2：
  // 线宽
  const lineWidthObj = {}
  lineWidthObj.name = pConf.displayLineStyleName[0]
  lineWidthObj.value = selectfeature.style.weight
  lineWidthObj.group = pConf.group[2]
  lineWidthObj.editor = 'text'
  // 线色
  const lineColorObj = {}
  lineColorObj.name = pConf.displayLineStyleName[1]
  lineColorObj.value = selectfeature.style.color
  lineColorObj.group = pConf.group[2]
  lineColorObj.editor = 'colorpicker'
  // 线透明度
  const lineOpaqueRateObj = {}
  lineOpaqueRateObj.name = pConf.displayLineStyleName[2]
  lineOpaqueRateObj.value = selectfeature.style.opacity
  lineOpaqueRateObj.group = pConf.group[2]
  lineOpaqueRateObj.editor = 'text'
  // 线型
  const lineStyleObj = {}
  lineStyleObj.name = pConf.displayLineStyleName[3]
  if (selectfeature.style.dashArray === '') {
    lineStyleObj.value = '实线'
  } else {
    lineStyleObj.value = lineStyleToString(selectfeature.style.lineSymbolID)
  }
  lineStyleObj.group = pConf.group[2]
  lineStyleObj.editor = {
    'type': 'combobox',
    'options': {'valueField': 'value', 'textField': 'text', 'data': lineStyleRows}
  }
  // 填充3：
  // 填充
  const fillObj = {}
  fillObj.name = pConf.displayFillStyleName[0]
  // fillObj['VALUE'] = checkboxValueToString(selectfeature.style.fill);
  fillObj.group = pConf.group[3]
  fillObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}

  // 填充色
  const fillforeColorObj = {}
  fillforeColorObj.name = pConf.displayFillStyleName[1]
  fillforeColorObj.value = selectfeature.style.fillColor
  fillforeColorObj.group = pConf.group[3]
  fillforeColorObj.editor = 'colorpicker'
  // 填充透明度
  const fillOpaqueRateObj = {}
  fillOpaqueRateObj.name = pConf.displayFillStyleName[2]
  fillOpaqueRateObj.value = selectfeature.style.fillOpacity
  fillOpaqueRateObj.group = pConf.group[3]
  fillOpaqueRateObj.editor = 'text'
  // 渐变填充
  const fillGradientModeObj = {}
  fillGradientModeObj.name = pConf.displayFillStyleName[3]
  fillGradientModeObj.value = fillGradientModeToString(selectfeature.style.fillGradientMode)
  fillGradientModeObj.group = pConf.group[3]
  fillGradientModeObj.editor = {
    'type': 'combobox',
    'options': {'valueField': 'value', 'textField': 'text', 'data': fillGradinetRows}
  }
  const fillBackColorObj = {}
  fillBackColorObj.name = pConf.displayFillStyleName[4]
  fillBackColorObj.value = selectfeature.style.fillBackColor
  fillBackColorObj.group = pConf.group[3]
  fillBackColorObj.editor = 'colorpicker'
  const fillBackOpacityObj = {}
  fillBackOpacityObj.name = pConf.displayFillStyleName[5]
  fillBackOpacityObj.value = selectfeature.style.fillBackOpacity
  fillBackOpacityObj.group = pConf.group[3]
  fillBackOpacityObj.editor = 'text'

  // 注记4：
  // 注记
  const textContentObj = {}
  textContentObj.name = pConf.displayTextContentName[0]
  if (selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT) {
    textContentObj.value = selectfeature.symbolTexts[0].textContent
  } else if (selectfeature.symbolType === SuperMap.Plot.SymbolType.ALGOSYMBOL &&
    selectfeature.textContent !== '') {
    textContentObj.value = selectfeature.textContent
  } else {
    textContentObj.value = selectfeature.getTextContent()
  }
  textContentObj.group = pConf.group[4]
  textContentObj.editor = 'text'
  if (selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT && selectfeature.symbolTexts.length === 2) {
    const textContentObj2 = {}
    textContentObj2.name = pConf.displayTextContentName[0] + '2'
    textContentObj2.value = selectfeature.symbolTexts[1].textContent
    textContentObj2.group = pConf.group[4]
    textContentObj2.editor = 'text'
  }
  // 注记位置
  const markPosObj = {}
  markPosObj.name = pConf.displayTextContentName[1]
  if (selectfeature.symbolType === SuperMap.Plot.SymbolType.PATHTEXT) {
    markPosObj.value = relLineTextToString(selectfeature.relLineText)
    markPosObj.group = pConf.group[4]
    markPosObj.editor = {
      'type': 'combobox',
      'options': {'valueField': 'value', 'textField': 'text', 'data': relLineTextRows}
    }
  } else if (this.checkType(selectfeature) === true) {
    markPosObj.value = annotationToString(selectfeature.getTextPosition())
    markPosObj.group = pConf.group[4]
    markPosObj.editor = {
      'type': 'combobox',
      'options': {'valueField': 'value', 'textField': 'text', 'data': annotationRows}
    }
  }
  // 注记字体大小
  const fontSizeObj = {}
  fontSizeObj.name = pConf.displayTextContentName[2]
  fontSizeObj.value = selectfeature.style.fontSize
  fontSizeObj.group = pConf.group[4]
  fontSizeObj.editor = 'text'
  // 注记字体颜色
  const fontColorObj = {}
  fontColorObj.name = pConf.displayTextContentName[3]
  fontColorObj.value = selectfeature.style.fontColor
  fontColorObj.group = pConf.group[4]
  fontColorObj.editor = 'colorpicker'
  // 注记字体名称
  const fontFamilyObj = {}
  fontFamilyObj.name = pConf.displayTextContentName[4]
  fontFamilyObj.value = selectfeature.style.fontFamily
  fontFamilyObj.group = pConf.group[4]
  fontFamilyObj.editor = 'text'
  // 注记与标号的间距
  const fontSpaceObj = {}
  fontSpaceObj.name = pConf.displayTextContentName[5]
  fontSpaceObj.value = selectfeature.space
  fontSpaceObj.group = pConf.group[4]
  fontSpaceObj.editor = 'text'
  // 标注框边框
  const textBoxTypeObj = {}
  textBoxTypeObj.name = pConf.displayNameNew[11]
  textBoxTypeObj.group = pConf.group[4]
  if (selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXTBOX) {
    textBoxTypeObj.value = textBoxTypeToString(selectfeature.textBoxType)
    textBoxTypeObj.editor = {
      'type': 'combobox',
      'options': {'valueField': 'value', 'textField': 'text', 'data': textBoxTypeRows}
    }
  } else if (selectfeature.symbolType === SuperMap.Plot.SymbolType.LINEMARKING) {
    textBoxTypeObj.value = lineMarkingTypeToString(selectfeature.textBoxType)
    textBoxTypeObj.editor = {
      'type': 'combobox',
      'options': {'valueField': 'value', 'textField': 'text', 'data': lineMarkingTypeRows}
    }
  }
  // 圆角边框
  const roundBoxObj = {}
  roundBoxObj.name = pConf.displayNameNew[12]
  roundBoxObj.group = pConf.group[4]
  if (selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXTBOX) {
    roundBoxObj.value = checkboxValueToString(selectfeature.getRoundBox())
    roundBoxObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}
  }
  // 对象标注框
  const symbolTextFrameObj = {}
  symbolTextFrameObj.name = pConf.displayNameNew[14]
  symbolTextFrameObj.value = checkboxValueToString(selectfeature.addFrame)
  symbolTextFrameObj.group = pConf.group[4]
  symbolTextFrameObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}
  // 衬线6：
  // 衬线
  const surroundLineTypeObj = {}
  surroundLineTypeObj.name = pConf.displaySurroundLineName[0]
  if (this.checkType(selectfeature) === true) {
    surroundLineTypeObj.value = surroundLineTypeToString(selectfeature.symbolType, selectfeature.getSurroundLineType())
  }
  surroundLineTypeObj.group = pConf.group[6]
  surroundLineTypeObj.editor = {
    'type': 'combobox',
    'options': {'valueField': 'value', 'textField': 'text', 'data': surroundLineTypeRows}
  }
  // 衬线宽
  const surroundLineWidthObj = {}
  surroundLineWidthObj.name = pConf.displaySurroundLineName[1]
  surroundLineWidthObj.value = selectfeature.style.surroundLineWidth
  surroundLineWidthObj.group = pConf.group[6]
  surroundLineWidthObj.editor = 'text'
  // 衬线色
  const surroundLineColorObj = {}
  surroundLineColorObj.name = pConf.displaySurroundLineName[2]
  surroundLineColorObj.value = selectfeature.style.surroundLineColor
  surroundLineColorObj.group = pConf.group[6]
  surroundLineColorObj.editor = 'colorpicker'
  // 衬线透明度
  const surroundLineColorOpaObj = {}
  surroundLineColorOpaObj.name = pConf.displaySurroundLineName[3]
  surroundLineColorOpaObj.value = selectfeature.style.surroundLineColorOpacity
  surroundLineColorOpaObj.group = pConf.group[6]
  surroundLineColorOpaObj.editor = 'text'
  // 文字9：
  // 字体描边
  const fontStrokeObj = {}
  fontStrokeObj.name = pConf.fontName[0]
  fontStrokeObj.value = checkboxValueToString(selectfeature.style.fontStroke)
  fontStrokeObj.group = pConf.group[9]
  fontStrokeObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}
  const fontStrokeColorObj = {}
  fontStrokeColorObj.name = pConf.fontName[1]
  fontStrokeColorObj.value = selectfeature.style.fontStrokeColor
  fontStrokeColorObj.group = pConf.group[9]
  fontStrokeColorObj.editor = 'colorpicker'
  const fontStrokeWidthObj = {}
  fontStrokeWidthObj.name = pConf.fontName[2]
  fontStrokeWidthObj.value = selectfeature.style.fontStrokeWidth
  fontStrokeWidthObj.group = pConf.group[9]
  fontStrokeWidthObj.editor = 'text'
  const fontBackObj = {}
  fontBackObj.name = pConf.fontName[3]
  fontBackObj.value = checkboxValueToString(selectfeature.style.fontBackground)
  fontBackObj.group = pConf.group[9]
  fontBackObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}
  const fontBackColorObj = {}
  fontBackColorObj.name = pConf.fontName[4]
  fontBackColorObj.value = selectfeature.style.fontBackgroundColor
  fontBackColorObj.group = pConf.group[9]
  fontBackColorObj.editor = 'colorpicker'
  const fontShadowObj = {}
  fontShadowObj.name = pConf.fontName[5]
  fontShadowObj.value = checkboxValueToString(selectfeature.style.fontShadow)
  fontShadowObj.group = pConf.group[9]
  fontShadowObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}
  const fontShadowColorObj = {}
  fontShadowColorObj.name = pConf.fontName[6]
  fontShadowColorObj.value = selectfeature.style.fontShadowColor
  fontShadowColorObj.group = pConf.group[9]
  fontShadowColorObj.editor = 'colorpicker'
  const fontShadowOffsetXObj = {}
  fontShadowOffsetXObj.name = pConf.fontName[7]
  fontShadowOffsetXObj.value = selectfeature.style.fontShadowOffsetX
  fontShadowOffsetXObj.group = pConf.group[9]
  fontShadowOffsetXObj.editor = 'text'
  const fontShadowOffsetYObj = {}
  fontShadowOffsetYObj.name = pConf.fontName[8]
  fontShadowOffsetYObj.value = selectfeature.style.fontShadowOffsetY
  fontShadowOffsetYObj.group = pConf.group[9]
  fontShadowOffsetYObj.editor = 'text'
  const fontSpaceObj1 = {}
  fontSpaceObj1.name = pConf.fontName[9]
  fontSpaceObj1.value = selectfeature.style.fontSpace
  fontSpaceObj1.group = pConf.group[9]
  fontSpaceObj1.editor = 'text'
  const fontPercentObj = {}
  fontPercentObj.name = pConf.fontName[10]
  fontPercentObj.value = selectfeature.style.fontPercent
  fontPercentObj.group = pConf.group[9]
  fontPercentObj.editor = 'text'
  if (selectfeature.symbolType !== SuperMap.Plot.SymbolType.ROUTENODE &&
    selectfeature.symbolType !== SuperMap.Plot.SymbolType.LITERATESIGN) {
    rows.push(visibilityObj)
  }
  if (selectfeature.symbolType !== SuperMap.Plot.SymbolType.TEXTSYMBOL &&
    selectfeature.symbolType !== SuperMap.Plot.SymbolType.SYMBOLTEXT) {
    rows.push(lineWidthObj)
    rows.push(lineColorObj)
    if (selectfeature.symbolType !== SuperMap.Plot.SymbolType.GROUPOBJECT &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.AIRROUTE &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.NAVYROUTE &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.MISSILEROUTE &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.NAVYDEPLOYMENT &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.AIRDEPLOYMENT) {
      rows.push(lineStyleObj)
      rows.push(lineOpaqueRateObj)
    }
  }

  /* if (checkType(selectfeature) === true && selectfeature.symbolType !== SuperMap.this.SymbolType.TEXTSYMBOL) {
     rows.push(fillObj);
     rows.push(fillGradientModeObj);
     if (selectfeature.style.fillGradientMode !== "NONE") {
       rows.push(fillforeColorObj);
       rows.push(fillOpaqueRateObj);
       rows.push(fillBackColorObj);
       rows.push(fillBackOpacityObj);
     } else if (selectfeature.style.fillGradientMode === "NONE" && selectfeature.style.fill) {
       rows.push(fillforeColorObj);
       rows.push(fillOpaqueRateObj);
     }
   } */

  if (this.checkType(selectfeature) === true &&
    selectfeature.symbolType !== SuperMap.Plot.SymbolType.TEXTSYMBOL &&
    selectfeature.symbolType !== SuperMap.Plot.SymbolType.LITERATESIGN) {
    rows.push(surroundLineTypeObj)
    rows.push(surroundLineColorObj)
    rows.push(surroundLineColorOpaObj)
    rows.push(surroundLineWidthObj)
  }
  const sfl = selectfeatures.length
  if (sfl === sameFeatures.length || sfl === dotSelectFeatures.length || sfl === algoSelectFeatures.length) {
    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXTBOX ||
      selectfeature.symbolType === SuperMap.Plot.SymbolType.LINEMARKING
    ) {
      rows.push(textBoxTypeObj)
      if (selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXTBOX) {
        rows.push(roundBoxObj)
      }
    }
    // 判断武警库线面标号带注记
    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.ALGOSYMBOL &&
      selectfeature.textContent !== '') {
      rows.push(textContentObj)
    } else if (selectfeature.symbolType !== SuperMap.Plot.SymbolType.ROUTENODE &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.LITERATESIGN &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.AIRDEPLOYMENT &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.NAVYDEPLOYMENT &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.GROUPOBJECT &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.ALGOSYMBOL &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.BRACESYMBOL &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.LINERELATION &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.INTERFERENCEBEAM &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.SATELLITETIMEWINDOWS &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.RUNWAY &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.CURVEEIGHT &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.ARROWLINE &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.CONCENTRICCIRCLE &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.COMBINATIONALCIRCLE &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.FREECURVE &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.NODECHAIN &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.AVOIDREGION &&
      selectfeature.symbolType !== SuperMap.Plot.SymbolType.FLAGGROUP
    ) {
      rows.push(textContentObj)
      if (selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT && selectfeature.symbolTexts.length === 2) {
        // rows.push(textContentObj2);
      }
      rows.push(fontSizeObj)
      rows.push(fontColorObj)
      rows.push(fontPercentObj)
      rows.push(fontFamilyObj)

      if (selectfeature.symbolType !== SuperMap.Plot.SymbolType.PATHTEXT) {
        rows.push(fontSpaceObj1)
        rows.push(fontStrokeObj)
        if (selectfeature.style.fontStroke === true) {
          rows.push(fontStrokeColorObj)
          rows.push(fontStrokeWidthObj)
        }
        rows.push(fontBackObj)
        rows.push(fontBackColorObj)
        rows.push(fontShadowObj)
        if (selectfeature.style.fontShadow === true) {
          rows.push(fontShadowColorObj)
          rows.push(fontShadowOffsetXObj)
          rows.push(fontShadowOffsetYObj)
        }
      }
    }

    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL) {
      // 军标大小1：
      const dotSymbolWidthObj = {}
      dotSymbolWidthObj.name = pConf.displayName[4]
      dotSymbolWidthObj.value = selectfeature.getSymbolSize().w
      dotSymbolWidthObj.group = pConf.group[1]
      dotSymbolWidthObj.editor = 'text'

      const dotSymbolHeightObj = {}
      dotSymbolHeightObj.name = pConf.displayName[5]
      dotSymbolHeightObj.value = selectfeature.getSymbolSize().h
      dotSymbolHeightObj.group = pConf.group[1]
      dotSymbolHeightObj.editor = 'text'

      // 旋转角度
      const dotSymbolRotateObj = {}
      dotSymbolRotateObj.name = pConf.displayName[0]
      dotSymbolRotateObj.value = selectfeature.getRotate()
      dotSymbolRotateObj.group = pConf.group[0]
      dotSymbolRotateObj.editor = 'text'

      // 随图缩放
      const dotScaleByMap = {}
      dotScaleByMap.name = pConf.displayName[1]
      if (selectfeature.symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL) {
        dotScaleByMap.value = checkboxValueToString(selectfeature.getScaleByMap())
      }
      dotScaleByMap.group = pConf.group[0]
      dotScaleByMap.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}

      // 镜像
      const dotSymbolNegativeImageObj = {}
      dotSymbolNegativeImageObj.name = pConf.displayName[2]
      dotSymbolNegativeImageObj.value = checkboxValueToString(selectfeature.getNegativeImage())
      dotSymbolNegativeImageObj.group = pConf.group[0]
      dotSymbolNegativeImageObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}

      // 标号级别
      const dotSymbolRankObj = {}
      dotSymbolRankObj.name = pConf.displayName[3]
      dotSymbolRankObj.value = symbolRankToString(selectfeature.getSymbolRank())
      dotSymbolRankObj.group = pConf.group[0]
      dotSymbolRankObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': symbolRankRows}
      }

      // 位置点偏移
      const dotPositionOffset = {}
      dotPositionOffset.name = pConf.displayName[6]
      dotPositionOffset.value = checkboxValueToString(selectfeature.getPositionOffset())
      dotPositionOffset.group = pConf.group[0]
      dotPositionOffset.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}

      // 偏移线类型
      const dotPositionOffsetType = {}
      dotPositionOffsetType.name = pConf.displayName[7]
      dotPositionOffsetType.value = positionOffsetTypeToString(selectfeature.getPositionOffsetType())
      dotPositionOffsetType.group = pConf.group[0]
      dotPositionOffsetType.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': positionOffsetTypeRows}
      }
      rows.push(dotSymbolRotateObj)
      rows.push(dotSymbolNegativeImageObj)
      rows.push(dotSymbolRankObj)
      rows.push(dotSymbolWidthObj)
      rows.push(dotSymbolHeightObj)
      rows.push(markPosObj)
      if (selectfeature.textPosition !== 8) {
        rows.push(fontSpaceObj)
      }
      rows.push(dotScaleByMap)
      rows.push(dotPositionOffset)
      rows.push(dotPositionOffsetType)
    } else if (this.checkType(selectfeature) === true) {
      for (let i = 0; i < selectfeature.getSubSymbols().length; i++) {
        const objectSubCode = {}
        objectSubCode.name = 'Code'
        objectSubCode.value = selectfeature.getSubSymbols()[i].code
        objectSubCode.group = pConf.group[5]
        objectSubCode.editor = {
          'type': 'combobox',
          'options': {'valueField': 'value', 'textField': 'text', 'data': subSymbolsTypeRows}
        }
        objectSubCode.index = i
        rows.push(objectSubCode)
      }
      if ((selectfeature.getSubSymbols().length === 0 && selectfeature.libID === 0 && selectfeature.code === 1025) ||
        (selectfeature.getSubSymbols().length === 0 && selectfeature.libID === 100 && selectfeature.code === 25200) ||
        (selectfeature.getSubSymbols().length === 0 && selectfeature.libID === 100 && selectfeature.code === 3020901)
      ) {
        const objectSubCode1 = {}
        objectSubCode1.name = 'Code'
        objectSubCode1.value = subSymbolsTypeString(selectfeature.getSubSymbols().length, selectfeature)
        objectSubCode1.group = pConf.group[5]
        objectSubCode1.editor = {
          'type': 'combobox',
          'options': {'valueField': 'value', 'textField': 'text', 'data': subSymbolsTypeRows}
        }
        objectSubCode1.index = i
        rows.push(objectSubCode1)
      }
      if (selectfeature.code === 1025 && selectfeature.getSubSymbols().length > 0) {
        const objectLibID = {}
        objectLibID.name = 'LibID'
        objectLibID.value = libIDToString(selectfeature.getSubSymbols()[0].libID)
        objectLibID.group = pConf.group[5]
        objectLibID.editor = 'text'
        rows.push(objectLibID)
      }
    }
    // 复合箭头
    if (selectfeature.libID === 22 && selectfeature.code === 1016) {
      const arrowHeadTypeObj = {}
      arrowHeadTypeObj.name = '箭头'
      arrowHeadTypeObj.value = arrowHeadTypeToString(selectfeature.arrowHeadType)
      arrowHeadTypeObj.group = '组合类型'
      arrowHeadTypeObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': arrowHeadTypeRows}
      }
      const arrowBodyTypeObj = {}
      arrowBodyTypeObj.name = '箭身'
      arrowBodyTypeObj.value = arrowBodyTypeToString(selectfeature.arrowBodyType)
      arrowBodyTypeObj.group = '组合类型'
      arrowBodyTypeObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': arrowBodyTypeRows}
      }
      const arrowTailTypepeObj = {}
      arrowTailTypepeObj.name = '箭尾'
      arrowTailTypepeObj.value = arrowTailTypeToString(selectfeature.arrowTailType)
      arrowTailTypepeObj.group = '组合类型'
      arrowTailTypepeObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': arrowTailTypeRows}
      }
      rows.push(arrowHeadTypeObj)
      rows.push(arrowBodyTypeObj)
      rows.push(arrowTailTypepeObj)
    }
    // 箭头线
    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.ARROWLINE) {
      const arrowTypeStartObj = {}
      arrowTypeStartObj.name = pConf.displayNameNew[0]
      arrowTypeStartObj.value = arrowTypeToString(selectfeature.getStartArrowType())
      arrowTypeStartObj.group = pConf.group[7]
      arrowTypeStartObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': arrowTypeStart}
      }
      const arrowTypeEndObj = {}
      arrowTypeEndObj.name = pConf.displayNameNew[1]
      arrowTypeEndObj.value = arrowTypeToString(selectfeature.getEndArrowType())
      arrowTypeEndObj.group = pConf.group[7]
      arrowTypeEndObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': arrowTypeEnd}
      }
      rows.push(arrowTypeStartObj)
      rows.push(arrowTypeEndObj)
    }
    // 沿线注记
    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.PATHTEXT) {
      const isAvoidObj = {}
      isAvoidObj.name = pConf.displayNameNew[2]
      isAvoidObj.value = checkboxValueToString(selectfeature.isAvoid)
      isAvoidObj.group = pConf.group[4]
      isAvoidObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}
      const showPathLineObj = {}
      showPathLineObj.name = pConf.displayNameNew[3]
      showPathLineObj.value = showToString(selectfeature.showPathLine)
      showPathLineObj.group = pConf.group[4]
      showPathLineObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': showRows}
      }
      const showPathLineArrowObj = {}
      showPathLineArrowObj.name = pConf.displayNameNew[13]
      showPathLineArrowObj.value = showToString(selectfeature.showPathLineArrow)
      showPathLineArrowObj.group = pConf.group[4]
      showPathLineArrowObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': showRows}
      }
      const isCurveObj = {}
      isCurveObj.name = pConf.displayNameNew[4]
      isCurveObj.value = checkboxValueToString(selectfeature.isCurve)
      isCurveObj.group = pConf.group[4]
      isCurveObj.editor = {'type': 'checkbox', 'options': {'on': true, 'off': false}}
      const textToLineDistanceObj = {}
      textToLineDistanceObj.name = pConf.displayTextContentName[5]
      textToLineDistanceObj.value = selectfeature.textToLineDistance
      textToLineDistanceObj.group = pConf.group[4]
      textToLineDistanceObj.editor = 'text'
      rows.push(textToLineDistanceObj)
      rows.push(markPosObj)
      rows.push(showPathLineObj)
      rows.push(showPathLineArrowObj)
      rows.push(isCurveObj)
      if (selectfeature.relLineText === SuperMap.Plot.RelLineText.ONLINE) {
        rows.push(isAvoidObj)
      }
    }
    // 对象标注
    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT) {
      rows.push(symbolTextFrameObj)
      if (selectfeature.addFrame === true) {
        // 线设置
        rows.push(lineWidthObj)
        rows.push(lineColorObj)
        rows.push(lineStyleObj)
        rows.push(lineOpaqueRateObj)
        // 填充设置
        rows.push(fillObj)
        rows.push(fillforeColorObj)
        rows.push(fillOpaqueRateObj)
        rows.push(fillGradientModeObj)
        rows.push(fillBackColorObj)
        rows.push(fillBackOpacityObj)
      }
    }
    // 对象标注1
    // if (selectfeature.symbolType === SuperMap.this.SymbolType.SYMBOLTEXT1) {
    //     //注记偏移量X
    //     let offsetXObj  ={};
    //     offsetXObj.name = displayNameNew[17];
    //     offsetXObj.value = selectfeature.offsetX;
    //     offsetXObj.group = group[4];
    //     offsetXObj.editor = "text";
    //
    //     //注记偏移量Y
    //     let offsetYObj  ={};
    //     offsetYObj.name = displayNameNew[18];
    //     offsetYObj.value = selectfeature.offsetY;
    //     offsetYObj.group = group[4];
    //     offsetYObj.editor = "text";
    //
    //     rows.push(fontSpaceObj);
    //     rows.push(offsetXObj);
    //     rows.push(offsetYObj);
    // }
    // 扇形区域
    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.ARCREGION) {
      if (selectfeature.radiusLineType != null) {
        const radiusLineTypeObj = {}
        radiusLineTypeObj.name = pConf.displayNameNew[5]
        radiusLineTypeObj.value = radiusTypeToString(selectfeature.radiusLineType)
        radiusLineTypeObj.group = pConf.group[8]
        radiusLineTypeObj.editor = {
          'type': 'combobox',
          'options': {'valueField': 'value', 'textField': 'text', 'data': radiusTypeRows}
        }
        rows.push(radiusLineTypeObj)
      }
      if (selectfeature.radiusText != null && selectfeature.radiusLineType !== 0) {
        const upTextObj = {}
        upTextObj.name = pConf.displayNameNew[6]
        upTextObj.value = selectfeature.radiusText[0]
        upTextObj.group = pConf.group[8]
        upTextObj.editor = 'text'
        const downTextObj = {}
        downTextObj.name = pConf.displayNameNew[7]
        downTextObj.value = selectfeature.radiusText[1]
        downTextObj.group = pConf.group[8]
        downTextObj.editor = 'text'
        const radiusPosAngleObj = {}
        radiusPosAngleObj.name = pConf.displayNameNew[15]
        radiusPosAngleObj.value = selectfeature.radiusPosAngle
        radiusPosAngleObj.group = pConf.group[8]
        radiusPosAngleObj.editor = 'text'
        rows.push(upTextObj)
        rows.push(downTextObj)
        rows.push(radiusPosAngleObj)
      }
    }
    // 卫星
    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.SATELLITE) {
      const visibleObj = {}
      visibleObj.name = pConf.displayNameNew[8]
      visibleObj.value = showToString(selectfeature.visible)
      visibleObj.group = pConf.group[0]
      visibleObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': showRows}
      }
      rows.push(visibleObj)
    }
    // 航线
    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.ROUTENODE) {
      // if (selectfeature.routeNode !== undefined) {
      const routeNodeTypeObj = {}
      routeNodeTypeObj.name = pConf.displayNameNew[9]
      routeNodeTypeObj.value = routeNodeTypeToString(selectfeature.routeNode.type)
      routeNodeTypeObj.group = pConf.group[2]
      routeNodeTypeObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': routeNodeTypeRows}
      }
      const routeNodeRotate = {}
      routeNodeRotate.name = pConf.displayNameNew[10]
      routeNodeRotate.value = selectfeature.routeNode.rotate
      routeNodeRotate.group = pConf.group[2]
      routeNodeRotate.editor = 'text'
      rows.push(routeNodeTypeObj)
      if (selectfeature.routeNode.type === SuperMap.Plot.RouteNodeType.STANDBY) {
        rows.push(routeNodeRotate)
      }
    }
    // 对象间连线
    if (selectfeature.symbolType === SuperMap.Plot.SymbolType.LINERELATION) {
      const lineRelationTypeObj = {}
      lineRelationTypeObj.name = pConf.displayNameNew[16]
      lineRelationTypeObj.value = lineRelationTypeToString(selectfeature.lineRelationType)
      lineRelationTypeObj.group = pConf.group[11]
      lineRelationTypeObj.editor = {
        'type': 'combobox',
        'options': {'valueField': 'value', 'textField': 'text', 'data': lineRelationTypeRows}
      }
      rows.push(lineRelationTypeObj)
    }
  }
  return rows
}

}

/**
 * 构建选择动画类型
 * @param type
 * @returns {{selectValue: *, animationType: number}}
 */
function selectAnimationType (type) {
  let aType
  switch (type) {
    case '属性动画':
      aType = SuperMap.this.GOAnimationType.ANIMATION_ATTRIBUTE
      break
    case '闪烁动画':
      aType = SuperMap.this.GOAnimationType.ANIMATION_BLINK
      break
    case '生长动画':
      aType = SuperMap.this.GOAnimationType.ANIMATION_GROW
      break
    case '旋转动画':
      aType = SuperMap.this.GOAnimationType.ANIMATION_ROTATE
      break
    case '比例动画':
      aType = SuperMap.this.GOAnimationType.ANIMATION_SCALE
      break
    case '显隐动画':
      aType = SuperMap.this.GOAnimationType.ANIMATION_SHOW
      break
    case '路径动画':
      aType = SuperMap.this.GOAnimationType.ANIMATION_WAY
      break
  }
  return { selectValue: type, animationType: aType }
}

/**
 * 初始化样式面板
 * @param cfg
 */
function initStylePanel (cfg) {
  if (verifyCfg(cfg, 'initStylePanel')) {
    Object.pEdit.on(SuperMap.Plot.Event.featuresselected, function (event) {
      cfg.setStylePanel(event.features)
    })
    Object.pEdit.on(SuperMap.Plot.Event.featuresmodified, function (event) {
      cfg.setStylePanel(event.features)
    })
    Object.pEdit.on(SuperMap.Plot.Event.featuresunselected, function (event) {
      cfg.setStylePanel(event.features)
    })
  } else {
    // eslint-disable-next-line no-console
    console.log('参数不完整')
  }
}

/**
 * 初始化标绘面板
 * @param cfg
 */
function initPlotPanel(cfg) {
  if (verifyCfg(cfg, 'initPlotPanel')) {
    const symbolLibManager = L.supermap.plotting.symbolLibManager(cfg.url)
    if (symbolLibManager.isInitializeOK()) {
      if (cfg.setPlotPanel) {
        cfg.setPlotPanel(symbolLibManager.getSymbolLibByLibId(421))
      }
    } else {
      symbolLibManager.on(SuperMap.Plot.Event.initializecompleted, function (result) {
        if (result.libIDs.length !== 0) {
          if (cfg.setPlotPanel) {
            cfg.setPlotPanel(symbolLibManager.getSymbolLibByLibId(421))
          }
        }
      })
      symbolLibManager.initializeAsync()
    }
  } else {
    console.log('参数不完整')
  }
}

/**
 * 验证必填项
 */
function verifyCfg(cfg, fnc) {
  let isVerifyPass = true
  switch (fnc) {
    case 'initPlotPanel':
      if (!cfg.url || !cfg.layerGroup || !cfg.setPlotPanel) {
        isVerifyPass = false
      }
      break
    case 'initStylePanel':
      if (!cfg.setStylePanel) {
        isVerifyPass = false
      }
      break
    default:
      isVerifyPass = true
      break
  }
  return isVerifyPass
}

/**
 * 文字对齐方式
 * @param value
 * @returns {string}
 */
function fontAlignTypeValue(value) {
  if (value === '0') {
    return 'lm'
  } else if (value === '1') {
    return 'rm'
  } else if (value === '2') {
    return 'cm'
  } else if (value === '3') {
    return 'lt'
  } else if (value === '4') {
    return 'lb'
  } else if (value === '5') {
    return 'rt'
  } else if (value === '6') {
    return 'rb'
  }
}

function getAnnotationRows(geometry) {
  const annotations = []
  annotations.push({'value': '0', 'text': '左上'})
  annotations.push({'value': '1', 'text': '左下'})
  annotations.push({'value': '2', 'text': '右上'})
  annotations.push({'value': '3', 'text': '右下'})
  annotations.push({'value': '4', 'text': '上'})
  annotations.push({'value': '5', 'text': '下'})
  annotations.push({'value': '6', 'text': '左'})
  annotations.push({'value': '7', 'text': '右'})
  if (geometry.symbolData && geometry.symbolData.middleMarkExist) {
    annotations.push({'value': '8', 'text': '中间'})
  }
  return annotations
}

function getRelLineTextRows() {
  const annotations = []
  annotations.push({'value': '0', 'text': '线上'})
  annotations.push({'value': '1', 'text': '线左'})
  annotations.push({'value': '2', 'text': '线右'})
  annotations.push({'value': '3', 'text': '双侧'})
  return annotations
}

function relLineTextToString(relLineText) {
  if (relLineText === SuperMap.Plot.RelLineText.ONLINE) {
    return '线上'
  } else if (relLineText === SuperMap.Plot.RelLineText.ONLEFTLINE) {
    return '线左'
  } else if (relLineText === SuperMap.Plot.RelLineText.ONRIGHTLINE) {
    return '线右'
  } else if (relLineText === SuperMap.Plot.RelLineText.ONBOTHLINE) {
    return '双侧'
  }
}

function getSymbolRankRows(geometry) {
  let symbolRanks = []
  if (geometry.symbolData && geometry.symbolData.symbolRanks) {
    symbolRanks = geometry.symbolData.symbolRanks
  }
  const rows = []
  rows.push({'value': '0', 'text': '无级别'})
  for (let i = 0; i < symbolRanks.length; i++) {
    if (symbolRanks[i] === 1) {
      rows.push({'value': '1', 'text': '军区级'})
    } else if (symbolRanks[i] === 2) {
      rows.push({'value': '2', 'text': '副大军区级'})
    } else if (symbolRanks[i] === 3) {
      rows.push({'value': '3', 'text': '集团军级'})
    } else if (symbolRanks[i] === 4) {
      rows.push({'value': '4', 'text': '师级'})
    } else if (symbolRanks[i] === 5) {
      rows.push({'value': '5', 'text': '旅级'})
    } else if (symbolRanks[i] === 6) {
      rows.push({'value': '6', 'text': '团级'})
    } else if (symbolRanks[i] === 7) {
      rows.push({'value': '7', 'text': '营级'})
    } else if (symbolRanks[i] === 8) {
      rows.push({'value': '8', 'text': '连级'})
    } else if (symbolRanks[i] === 9) {
      rows.push({'value': '9', 'text': '排级'})
    }
  }
  return rows
}

function getSurroundLineTypeRows(symbolType) {
  const rows = []
  if (symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL) {
    rows.push({'value': '0', 'text': '无衬线'})
    rows.push({'value': '1', 'text': '有衬线'})
  } else {
    rows.push({'value': '0', 'text': '无衬线'})
    rows.push({'value': '1', 'text': '内侧衬线'})
    rows.push({'value': '2', 'text': '外侧衬线'})
    rows.push({'value': '3', 'text': '双侧衬线'})
  }
  return rows
}

function getDisplayRows() {
  const rows = []
  rows.push({'value': 'display', 'text': '显示'})
  rows.push({'value': 'none', 'text': '不显示'})
  return rows
}

function getShowRows() {
  const rows = []
  rows.push({'value': 'true', 'text': '显示'})
  rows.push({'value': 'false', 'text': '不显示'})
  return rows
}

function getFillGradientModeRows() {
  const rows = []
  rows.push({'value': 'NONE', 'text': '无渐变'})
  rows.push({'value': 'LINEAR', 'text': '线性渐变'})
  rows.push({'value': 'RADIAL', 'text': '辐射渐变'})
  return rows
}

function getLineStyleRows() {
  const rows = []
  rows.push({'value': '0', 'text': '实线'})// 实线(solid)
  rows.push({'value': '1', 'text': '长虚线'})// 长虚线(longdash) //虚线(dash)
  rows.push({'value': '2', 'text': '由点构成的直线'})// 由点构成的直线(dot)
  rows.push({'value': '3', 'text': '由线划线段组成的直线'})// 由线划线段组成的直线(dashdot)(longdashdot)
  rows.push({'value': '4', 'text': '由重复的线划点图案构成的直线'})// 由重复的划线点图案构成的直线
  // rows.push({"value": "5", "text": "无边线"});
  return rows
}

function lineStyleToString(lineStyle) {
  if (lineStyle === 1) {
    return '长虚线'
  } else if (lineStyle === 2) {
    return '由点构成的直线'
  } else if (lineStyle === 3) {
    return '由线划线段组成的直线'
  } else if (lineStyle === 4) {
    return '由重复的线划点图案构成的直线'
  } else if (lineStyle === 0) {
    return '实线'
  } else if (lineStyle) {
    return '实线'
  }
}

function getLineRelationTypeRows() {
  const rows = []
  rows.push({'value': '0', 'text': '实直线'})
  rows.push({'value': '1', 'text': '虚直线'})
  rows.push({'value': '2', 'text': '箭头线'})
  return rows
}

function lineRelationTypeToString(lineRelationType) {
  if (lineRelationType === 0) {
    return '实直线'
  } else if (lineRelationType === 1) {
    return '虚直线'
  } else if (lineRelationType === 2) {
    return '箭头线'
  }
}

function getRouteNodeTypeRows() {
  const rows = []
  rows.push({'value': 'AIMING', 'text': '瞄准点'})
  rows.push({'value': 'COMMONROUTE', 'text': '普通航路点'})
  rows.push({'value': 'EXPANDING', 'text': '展开点'})
  rows.push({'value': 'INITIAL', 'text': '初始点'})
  rows.push({'value': 'LANCH', 'text': '发射点'})
  rows.push({'value': 'RENDEZVOUS', 'text': '会合点'})
  rows.push({'value': 'STANDBY', 'text': '待机点'})
  rows.push({'value': 'SUPPLY', 'text': '补给点'})
  rows.push({'value': 'TAKEOFF', 'text': '起飞点'})
  rows.push({'value': 'TURNING', 'text': '转弯点'})
  rows.push({'value': 'VISUALINITAL', 'text': '可视初始点'})
  rows.push({'value': 'VOLLEY', 'text': '齐射点'})
  rows.push({'value': 'WEAPONLAUNCH', 'text': '武器发射点'})
  rows.push({'value': 'TARGET', 'text': '目标点'})
  rows.push({'value': 'ATTACK', 'text': '攻击点'})
  rows.push({'value': 'SUPPRESS', 'text': '压制点'})
  rows.push({'value': 'EIGHTSPIRAL', 'text': '八字盘旋点'})
  rows.push({'value': 'HAPPYVALLEY', 'text': '跑马圈点'})
  return rows
}

function routeNodeTypeToString(routeNodeType) {
  if (routeNodeType === SuperMap.Plot.RouteNodeType.AIMING) {
    return '瞄准点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.COMMONROUTE) {
    return '普通航路点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.EXPANDING) {
    return '展开点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.INITIAL) {
    return '初始点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.LANCH) {
    return '发射点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.RENDEZVOUS) {
    return '会合点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.STANDBY) {
    return '待机点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.SUPPLY) {
    return '补给点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.TAKEOFF) {
    return '起飞点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.TURNING) {
    return '转弯点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.VISUALINITAL) {
    return '可视初始点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.VOLLEY) {
    return '齐射点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.WEAPONLAUNCH) {
    return '武器发射点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.TARGET) {
    return '目标点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.ATTACK) {
    return '攻击点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.SUPPRESS) {
    return '压制点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.EIGHTSPIRAL) {
    return '八字盘旋点'
  } else if (routeNodeType === SuperMap.Plot.RouteNodeType.HAPPYVALLEY) {
    return '跑马圈点'
  }
}

function getArrowTypeRows() {
  const rows = []
  rows.push({'value': '0', 'text': '双线箭头'})
  rows.push({'value': '1', 'text': '实心三角形'})
  rows.push({'value': '2', 'text': '无箭头'})
  return rows
}

function arrowTypeToString(arrowType) {
  if (arrowType === 0) {
    return '双线箭头'
  } else if (arrowType === 1) {
    return '实心三角形'
  } else if (arrowType === 2) {
    return '无箭头'
  }
}

function getRadiusTypeRows() {
  const rows = []
  rows.push({'value': '0', 'text': '不显示'})
  rows.push({'value': '1', 'text': '直线'})
  rows.push({'value': '2', 'text': '箭头线'})
  return rows
}

function radiusTypeToString(radiusType) {
  if (radiusType === 0) {
    return '不显示'
  } else if (radiusType === 1) {
    return '直线'
  } else if (radiusType === 2) {
    return '箭头线'
  }
}

function annotationToString(annotation) {
  if (annotation === 0) {
    return '左上'
  } else if (annotation === 1) {
    return '左下'
  } else if (annotation === 2) {
    return '右上'
  } else if (annotation === 3) {
    return '右下'
  } else if (annotation === 4) {
    return '上'
  } else if (annotation === 5) {
    return '下'
  } else if (annotation === 6) {
    return '左'
  } else if (annotation === 7) {
    return '右'
  } else if (annotation === 8) {
    return '中间'
  }
}

function symbolRankToString(symbolRank) {
  if (symbolRank === 0) {
    return '无级别'
  } else if (symbolRank === 1) {
    return '军区级'
  } else if (symbolRank === 2) {
    return '副大军区级'
  } else if (symbolRank === 3) {
    return '集团军级'
  } else if (symbolRank === 4) {
    return '师级'
  } else if (symbolRank === 5) {
    return '旅级'
  } else if (symbolRank === 6) {
    return '团级'
  } else if (symbolRank === 7) {
    return '营级'
  } else if (symbolRank === 8) {
    return '连级'
  } else if (symbolRank === 9) {
    return '排级'
  }
}

function surroundLineTypeToString(symbolType, surroundLineType) {
  if (symbolType === SuperMap.Plot.SymbolType.DOTSYMBOL) {
    if (surroundLineType === 0) {
      return '无衬线'
    } else if (surroundLineType === 1) {
      return '有衬线'
    }
  } else if (surroundLineType === 0) {
    return '无衬线'
  } else if (surroundLineType === 1) {
    return '内侧衬线'
  } else if (surroundLineType === 2) {
    return '外侧衬线'
  } else if (surroundLineType === 3) {
    return '双侧衬线'
  }
}

function displayToString(display) {
  if (display && display === 'none') {
    return '不显示'
  }
  return '显示'
}

function fillGradientModeToString(fillGradientMode) {
  if (fillGradientMode === 'NONE') {
    return '无渐变'
  } else if (fillGradientMode === 'LINEAR') {
    return '线性渐变'
  } else if (fillGradientMode === 'RADIAL') {
    return '辐射渐变'
  } else {
    return '无渐变'
  }
}

function showToString(show) {
  if (show === true) {
    return '显示'
  } else if (show === false) {
    return '不显示'
  }
}

function checkboxValueToString(checkboxValue) {
  if (checkboxValue === true) {
    return 'true'
  } else if (checkboxValue === false) {
    return 'false'
  }
}

function fromCheckboxValue(checkboxStr) {
  if (checkboxStr === 'true') {
    return true
  } else if (checkboxStr === 'false') {
    return false
  }
}

// 偏移线类型
function getPositionOffsetTypeRows() {
  const rows = []
  rows.push({'value': '0', 'text': '直线'})
  rows.push({'value': '1', 'text': '线粗渐变'})
  return rows
}

// 偏移线类型
function positionOffsetTypeToString(positionOffsetType) {
  if (positionOffsetType === 0) {
    return '直线'
  } else if (positionOffsetType === 1) {
    return '线粗渐变'
  }
}

// 注记框类型
function getTextBoxTypeRows() {
  const rows = []

  rows.push({'value': '0', 'text': '带角矩形边框'})
  rows.push({'value': '1', 'text': '矩形边框'})
  rows.push({'value': '3', 'text': '无边框'})

  return rows
}

function textBoxTypeToString(textBoxType) {
  if (textBoxType === 0) {
    return '带角矩形边框'
  } else if (textBoxType === 1) {
    return '矩形边框'
  } else if (textBoxType === 3) {
    return '无边框'
  }
}

// 线型标注框类型
function getLineMarkingTypeRows() {
  const rows = []

  rows.push({'value': '1', 'text': '矩形边框'})
  rows.push({'value': '2', 'text': '线型底边'})

  return rows
}

function lineMarkingTypeToString(lineMarkingType) {
  if (lineMarkingType === 1) {
    return '矩形边框'
  } else if (lineMarkingType === 2) {
    return '线型底边'
  }
}

// 复合箭头--箭头
function getArrowHeadTypeRows() {
  const rows = []
  rows.push({'value': '0', 'text': '双线箭头'})
  rows.push({'value': '1', 'text': '无箭头'})
  rows.push({'value': '2', 'text': '燕尾箭头'})
  rows.push({'value': '3', 'text': '实心三角形'})
  return rows
}

function arrowHeadTypeToString(arrowHeadType) {
  if (arrowHeadType === 0) {
    return '双线箭头'
  } else if (arrowHeadType === 1) {
    return '无箭头'
  } else if (arrowHeadType === 2) {
    return '燕尾箭头'
  } else if (arrowHeadType === 3) {
    return '实心三角形'
  }
}

// 复合箭头--箭身：arrowBodyType
// 0--折线，1--贝塞尔曲线
function getArrowBodyTypeRows() {
  const rows = []
  rows.push({'value': '0', 'text': '折线'})
  rows.push({'value': '1', 'text': '贝塞尔曲线'})
  return rows
}

function arrowBodyTypeToString(arrowBodyType) {
  if (arrowBodyType === 0) {
    return '折线'
  } else if (arrowBodyType === 1) {
    return '贝塞尔曲线'
  }
}

// 复合箭头--箭尾：arrowTailType
// 0--无箭尾，1--直线,3--双线
function getArrowTailTypeRows() {
  const rows = []
  rows.push({'value': '0', 'text': '无箭尾'})
  rows.push({'value': '1', 'text': '直线箭尾'})
  rows.push({'value': '3', 'text': '双线箭尾'})
  return rows
}

function arrowTailTypeToString(arrowTailType) {
  if (arrowTailType === 0) {
    return '无箭尾'
  } else if (arrowTailType === 1) {
    return '直线箭尾'
  } else if (arrowTailType === 3) {
    return '双线箭尾'
  }
}

function libIDToString(libID) {
  if (libID === 421) {
    return '421(警用库)'
  } else if (libID === 100) {
    return '100(军队库)'
  } else if (libID === 123) {
    return '123(武警库)'
  } else if (libID === 900) {
    return '900(人防库)'
  }
}

function subSymbolsTypeString(subSymbolsLength, geometry) {
  if (subSymbolsLength === 0) {
    return ''
  } else if (geometry.libID === 100) {
    if (geometry.getSubSymbols()[0].code === 100) {
      return '陆军'
    } else if (geometry.getSubSymbols()[0].code === 200) {
      return '海军'
    } else if (geometry.getSubSymbols()[0].code === 300) {
      return '空军'
    }
  } else if (geometry.libID === 123) {
    if (geometry.getSubSymbols()[0].code === 10101) {
      return '武装警察部队'
    } else if (geometry.getSubSymbols()[0].code === 10102) {
      return '防爆装甲'
    } else if (geometry.getSubSymbols()[0].code === 10103) {
      return '火炮'
    }
  } else if (geometry.libID === 900) {
    if (geometry.getSubSymbols()[0].code === 910200) {
      return '人民防空重点城市'
    } else if (geometry.getSubSymbols()[0].code === 910300) {
      return '人民防空基本指挥所'
    } else if (geometry.getSubSymbols()[0].code === 910402) {
      return '水路抢修专业队'
    }
  } else if (geometry.libID === 0) {
    if (geometry.getSubSymbols()[0].code === 9) {
      return '刑警'
    } else if (geometry.getSubSymbols()[0].code === 80103) {
      return '交警'
    } else if (geometry.getSubSymbols()[0].code === 80109) {
      return '专业警'
    }
  }
}

function getSubSymbolsTypeRows(geometry) {
  const rows = []
  rows.push({'value': '0', 'text': ''})
  if (geometry.libID === 100) {
    rows.push({'value': '100', 'text': '陆军'})
    rows.push({'value': '200', 'text': '海军'})
    rows.push({'value': '300', 'text': '空军'})
  } else if (geometry.libID === 123) {
    rows.push({'value': '10101', 'text': '武装警察部队'})
    rows.push({'value': '10102', 'text': '防爆装甲'})
    rows.push({'value': '10103', 'text': '火炮'})
  } else if (geometry.libID === 900) {
    rows.push({'value': '910200', 'text': '人民防空重点城市'})
    rows.push({'value': '910300', 'text': '人民防空基本指挥所'})
    rows.push({'value': '910402', 'text': '水路抢修专业队'})
  } else if (geometry.libID === 0) {
    rows.push({'value': '9', 'text': '刑警'})
    rows.push({'value': '80103', 'text': '交警'})
    rows.push({'value': '80109', 'text': '专业警'})
  }
  return rows
}

// 判断类型是否为新增对象
function checkType(selectfeature) {
  return !(selectfeature.symbolType === SuperMap.Plot.SymbolType.GROUPOBJECT ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.AIRROUTE ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.NAVYROUTE ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.MISSILEROUTE ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.ROUTENODE ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.NAVYDEPLOYMENT ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.AIRDEPLOYMENT ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.SYMBOLTEXT1 ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.FLAGGROUP ||
    selectfeature.symbolType === SuperMap.Plot.SymbolType.SATELLITE);// 原有标号
}
