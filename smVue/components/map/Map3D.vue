<template>
  <div id="map3d"></div>
</template>
<script>
  import main from '@/static/mapjs/main'

  export default {
    mounted() {
      main['sceneEvent'].initScene();
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

