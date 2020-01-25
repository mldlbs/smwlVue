<template>
  <div id="map" class="map">
    <MAP2D ref="map2d" v-show="tag !== 2" />
    <MAP3D v-show="tag === 2" />
    <SwitchMap />
    <Tools />
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import main from '~/static/mapjs/main'
import MAP2D from '~/components/map/Map2D.vue'
import MAP3D from '~/components/map/Map3D.vue'
import SwitchMap from '~/components/map/Switch.vue'
import Tools from '~/components/map/Tools.vue'

export default {
  components: {
    MAP2D, MAP3D, SwitchMap, Tools
  },
  data () {
    return {
      tag: 2
    }
  },
  computed: {
    ...mapState({
      Gis: state => state.Gis
    })
  },
  watch: {
    'Gis.TAG' () {
      this.tag = this.Gis.TAG
      if (this.tag !== 2) {
        // main.mEvent.changeMap(this.tag)
      }
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {}
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
