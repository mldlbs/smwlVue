<template>
  <div class="tools">
    <el-menu class="el-menu-demo" mode="horizontal" background-color="#00102F55">
      <el-menu-item index="1">快速定位</el-menu-item>
      <el-submenu index="2" :show-timeout='50' :hide-timeout='50' popper-class="tool">
        <template slot="title">工具箱</template>
        <el-menu-item index="2-1" @click="doMeasure('DIS')"><img src="~assets/img/map/t/cj.png">测距</el-menu-item>
        <el-menu-item index="2-2" @click="doMeasure('HEIGHT')"><img src="~assets/img/map/t/ct.png">测高</el-menu-item>
        <el-menu-item index="2-3" @click="doMeasure('AREA')"><img src="~assets/img/map/t/cm.png">测面积</el-menu-item>
      </el-submenu>
      <el-menu-item index="4" @click="measureClear()">清除</el-menu-item>
    </el-menu>
  </div>
</template>
<script>
  import main from '@/static/mapjs/main'
  import {mapState} from 'vuex';

  export default {
    data() {
      return {}
    },
    components: {
    },
    computed:{
      ...mapState({
        Gis: state => state.Gis
      })
    },
    mounted: function () {
    },
    methods: {
      doMeasure(type) {
        if (this.Gis.TAG === 2) {
          main['sceneEvent'].doMeasure(type);
        } else {
          main['mapEvent'].doMeasure(type);
        }
      },
      measureClear() {
        if (this.Gis.TAG === 2) {
          main['sceneEvent'].doMeasure();
        } else {
          main['mapEvent'].doMeasure();
        }
      },
    }
  }
</script>
<style>
  .tools {
    position: absolute;
    top: 100px;
    right: 6px;
    z-index: 6;
  }

  .tools > div {
    height: 26px;
    width: 110%;
    font-size: 10px;
    text-align: center;
    line-height: 26px;
  }

  .tools .el-menu {
    background: rgba(0, 16, 47, .5);
    color: #fff;
  }

  .tools .el-menu--horizontal > .el-menu-item {
    height: 30px;
    line-height: 30px;
    border-bottom: rgba(0, 16, 47, .5);
    color: #fff;
  }

  .tools .el-menu--horizontal > .el-submenu .el-submenu__title {
    height: 30px;
    line-height: 30px;
    border-bottom: rgba(0, 16, 47, .5);
    color: #fff;
  }

  .tools .el-menu.el-menu--horizontal {
    border-bottom: rgba(0, 16, 47, .5);
    color: #fff;
  }

  .tools .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
    background: rgba(0, 16, 47, .5);
    color: #fff;
  }

  .tools .el-menu--horizontal > .el-menu-item.is-active {
    background: rgba(0, 16, 47, .5);
    color: #fff;
  }


</style>
