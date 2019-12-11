<template>
  <div id="main" class="main">
    <GIS />
  </div>
</template>
<script>
  import GIS from "~/components/map/Gis.vue"

  export default {
  components: {
    GIS
  },
  data () {
    return {}
  }
}
</script>
<style>
  .map {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
  }
</style>
