<template>
  <div id="map3d" />
</template>
<script>
import main from '~/static/mapjs/main'

export default {
  mounted () {
    setTimeout(() => {
      main.sEvent.initScene()
    }, 3000)
  }
}
</script>
<style>
  #map3d {
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
