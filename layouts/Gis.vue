<template>
  <div>
    <GIS />
    <nuxt />
  </div>
</template>
<script>
import GIS from '~/components/map/Gis.vue'
export default {
  head: {
    link: [
      { rel: 'stylesheet', href: '/libs/supermap/iclient-leaflet/libs/leaflet.css' },
      { rel: 'stylesheet', href: '/libs/supermap/iclient-leaflet/libs/plotting/iclient9-Plot-leaflet.css' },
      { rel: 'stylesheet', href: '/libs/supermap/iclient-leaflet/libs/iclient9-leaflet.min.css' },
      { rel: 'stylesheet', href: '/libs/supermap/iclient-webgl/Build/Cesium/Widgets/widgets.css' }
    ],
    script: [
      { src: '/libs/supermap/iclient-leaflet/libs/leaflet-src.js' },
      { src: '/libs/supermap/iclient-leaflet/libs/iclient9-leaflet-es6.min.js' },
      { src: '/libs/supermap/iclient-leaflet/libs/plotting/iclient9-Plot-leaflet-es6.min.js' },
      { src: '/libs/supermap/turf.min.js' },
      { src: '/libs/supermap/iclient-leaflet/libs/leaflet.ChineseTmsProviders.js' },
      { src: '/libs/supermap/iclient-webgl/Build/Cesium/Cesium.js' }
    ]
  },
  components: {
    GIS
  }
}
</script>
<style>
  html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
  }

  .button--green {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #3b8070;
    color: #3b8070;
    text-decoration: none;
    padding: 10px 30px;
  }

  .button--green:hover {
    color: #fff;
    background-color: #3b8070;
  }

  .button--grey {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #35495e;
    color: #35495e;
    text-decoration: none;
    padding: 10px 30px;
    margin-left: 15px;
  }

  .button--grey:hover {
    color: #fff;
    background-color: #35495e;
  }
</style>
