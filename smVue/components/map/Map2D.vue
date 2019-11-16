<template>
  <div id="map2d"></div>
</template>
<script>
    import main from '@/static/mapjs/main'

    export default {
        mounted() {
            main['mapEvent'].initMap();
        },
        methods:{
            swatchMap(index){

            }
        }
    }
</script>
<style>
  #map2d {
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
