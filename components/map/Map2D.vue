<template>
  <div id="map2d" />
</template>
<script>
import main from '~/static/mapjs/main'

export default {
  mounted () {
    // eslint-disable-next-line no-undef,no-console
    // console.log(L, L.supermap, L.tileLayer, Cesium)
    // eslint-disable-next-line no-undef
    main.mEvent.initMap(L)
  },
  methods: {}
}
</script>
<style>
  #map2d {
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
