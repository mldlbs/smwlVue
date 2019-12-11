<template>
  <div
    :v-show="this.Gis.POPUP.SHOW"
    :SMX="popup_x"
    :SMY="popup_y"
    :OFFSETX="offset_x"
    :OFFSETY="offset_y"
    class="popup"
  >
    {{ this.Gis.POPUP.PROPS }}
  </div>
</template>
<script>
  // eslint-disable-next-line no-unused-vars
  import {mapState} from "vuex"

  export default {
  components: {},
  data () {
    return {
      popup_x: 0,
      popup_y: 0,
      offset_x: 0,
      offset_y: 0
    }
  },
  computed: {
    ...mapState({
      Gis: state => state.Gis
    })
  },
  mounted: {},
  methods: {
    initPopup () {
      const popup = this.Gis.POPUP
      const ed = popup.LAYER.getPane()
      const size = popup.MAP.getSize()
      ed.style.width = size.w
      ed.style.height = size.h
      popup.MAP.events.on({
        moveend: this.move()
      })
    },
    mapMove () {
      // eslint-disable-next-line no-undef
      for (let i = 0; i < $('.popup').length; i++) {
        this.popupMove({
          x: this.popup_x,
          y: this.popup_y,
          offsetX: Number(this.offsetX),
          offsetY: Number(this.offsetY),
          center: false
        })
      }
    },
    popupMove (cfg) {
      const pixel = this.getPxFromLonlat(cfg.x, cfg.y)
      // eslint-disable-next-line no-unused-vars
      const left = pixel.x + cfg.offsetX + 'px'
      // eslint-disable-next-line no-unused-vars
      const top = pixel.y + cfg.offsetY + 'px'
    },
    getPxFromLonlat (lon, lat) {
      // eslint-disable-next-line no-undef
      const pixel = map.getPixelFromLonLat(new SuperMap.LonLat(lon, lat))
      // eslint-disable-next-line no-undef
      // pixel.x = pixel.x - $('.popup').width() / 2
      // pixel.y = pixel.y - ($('.popup').height() + 38)
      return pixel
    }
  }
}
</script>
<style>
</style>
