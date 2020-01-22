<template>
  <div class="container">
    <el-container>
      <el-aside width="200px">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane label="标绘面板" name="first" class="bhPanel">
            <ul v-for="(ulItem,i) in symbols" :key="i*2+2.09" class="symbol-row">
              <li v-for="(item,j) in ulItem" :key="j*3+2.09" class="symbol">
                <img :src="item.icon" :class="{active : active === item['symbolCode']}" @click="drawNode(item)" alt="">
              </li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="属性面板" name="second">
            <Table :TData="TData" :key="refresh" />
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-container>
        <el-main>
          <el-row>
            <el-select v-model="aType.value" placeholder="请选择" class="aType">
              <el-option
                v-for="item in aType.items"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
            <el-button icon="el-icon-search" circle />
            <el-button type="primary" icon="el-icon-edit" circle />
            <el-button type="success" icon="el-icon-check" circle />
            <el-button type="info" icon="el-icon-message" circle />
            <el-button type="warning" icon="el-icon-star-off" circle />
            <el-button type="danger" icon="el-icon-delete" circle />
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import main from '~/static/mapjs/main'

export default {
  layout: 'Gis',
  components: {},
  data () {
    return {
      activeName: 'first',
      defaultProps: {
        label: 'name'
      },
      symbols: [[{ icon: '', symbolCode: '' }]],
      active: '',
      aType: { items: ['属性动画', '闪烁动画', '生长动画', '旋转动画', '比例动画', '显隐动画', '路径动画'], value: '生长动画' },
      symbolStyle: {},
      TData: {},
      refresh: 0.01
    }
  },
  mounted () {
    setTimeout(() => {
      // this.initPlot()
    }, 100)
  },
  methods: {
    initPlot () {
      const _this = this
      main.mEvent.initPlot({
        setPlotPanel (res) {
          _this.symbols = res
          _this.initPanel(res)
        },
        setStylePanel (res) {
          // eslint-disable-next-line no-console
          _this.initStylePanel(res)
        }
      })
      this.drawEnd()
    },
    drawNode (item) {
      this.active = item.symbolCode
      main.mEvent.plot.doPlot(item)
    },
    handleClick (tab, event) {
      // console.log(tab, event);
    },
    drawEnd () {
      window.addEventListener('contextmenu', (evt) => {
        if (evt.button === 2) {
          main.mEvent.plot.unPlot()
          this.active = ''
          evt.preventDefault()
          return false
        }
      })
    },
    initPanel (symbols) {
      const symbolInfo = symbols.getRootSymbolInfo()
      const drawData1 = symbolInfo.childNodes[9].childNodes
      drawData1.forEach((item) => {
        item.icon = `${symbols.getRootSymbolIconUrl()}${symbolInfo.symbolName}/${symbolInfo.childNodes[9].symbolName}/${item.symbolCode}.png`
      })
      const drawData2 = symbolInfo.childNodes[10].childNodes
      drawData2.forEach((item) => {
        item.icon = `${symbols.getRootSymbolIconUrl()}${symbolInfo.symbolName}/${symbolInfo.childNodes[10].symbolName}/${item.symbolCode}.png`
      })
      this.drawData = [...drawData1, ...drawData2]
      let ulItem = []
      this.symbols = []
      this.drawData.forEach((item, i, arr) => {
        ulItem.push(item)
        if (i % 3 === 2 || i === arr.length - 1) {
          this.symbols.push(ulItem)
          ulItem = []
        }
      })
    },
    initStylePanel () {
      const _this = this
      if (this.symbolStyle.length > 0) {
        main.mEvent.plot.collectionPropertyGridRows({
          features: this.symbolStyle,
          callback (res) {
            _this.TData = res
          }
        })
      } else {
        _this.TData = []
      }
      _this.refresh += 0.01
    }
  }
}
</script>

<style>
  .container {
    position: absolute;
    margin: 0 auto;
    min-height: 30vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    z-index: 10;
    pointer-events: none;
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: rgba(0, 16, 47, .7);
    text-align: center;
    height: calc(100% - 64px);
    border: 1px solid rgb(97, 119, 117);
    line-height: 30px;
    color: #fff;
    pointer-events: auto;
  }

  .el-main {
  }

  .el-tabs {
    pointer-events: auto;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }

  .el-aside .el-tabs__content {
    height: 400px;
    overflow-y: auto;
  }

  .el-tabs__item {
    color: #fff;
  }

  .el-tabs__item.is-active {
    color: #00ceff;
  }

  .el-button {
    display: block;
    pointer-events: auto;
    margin-top: 2px;
  }

  .el-button + .el-button {
    margin-left: 0;
    margin-top: 5px;
  }

  .symbol-row {
    padding: 0;
  }

  .symbol {
    width: 33.3%;
    display: inline-block;
    float: left;
    padding: 5px;
  }

  .symbol img {
    width: 60%;
    background: #fff;
    cursor: pointer;
  }

  .active {
    border: 2px solid rgb(255, 0, 2);
  }

  .aType {
    width: 110px;
    pointer-events: auto;
  }

  .aType .el-input .el-input__inner {
    background-color: rgba(0, 16, 47, .7);
    color: #dddddd;
  }

</style>
