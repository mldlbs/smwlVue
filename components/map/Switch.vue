<template>
  <div class="switch">
    <div v-for="(img, key) in images" class="images">
      <el-image :src="img" @click="switchView(key)" class="image" fit="fill" />
    </div>

    <div class="images tooltip">
      <el-image :src="images[0]" class="image" fit="fill" />
      <div class="popup">
        <div v-for="(img, key) in online" class="images">
          <el-image :src="img" @click="switchView(key+3)" class="image" fit="fill" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import m from '~/assets/img/map/m.png'
import i from '~/assets/img/map/i.png'
import s from '~/assets/img/map/s.png'

export default {
  data () {
    return {
      images: [m, i, s],
      online: [m, m, m, m, m, m, m, m, m, m]
    }
  },
  computed: {
    ...mapState({
      TAG: state => state.Gis.TAG
    })
  },
  mounted () {
  },
  methods: {
    ...mapMutations([
      'CHANGE_TAG'
    ]),
    switchView (index) {
      this.CHANGE_TAG(index)
    }
  }
}
</script>
<style scoped>
  .switch {
    position: absolute;
    bottom: 6px;
    right: 6px;
    z-index: 6;
  }

  .switch .images {
    display: inline-block;
    float: left;
  }

  .switch .tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
  }

  .switch .tooltip .popup {
    visibility: hidden;
    min-width: 220px;
    background-color: #e9e9e9;
    border-radius: 5px;
    border: 1px solid #ccc;
    color: #fff;
    text-align: center;
    padding: 5px 5px;
    position: absolute;
    z-index: 1;
    bottom: 110%;
    right: 0;
    margin-left: -60px;
  }

  .switch .tooltip .popup::after {
    content: " ";
    position: absolute;
    top: 100%;
    right: 15px;
    margin-left: -10px;
    border: 10px solid;
    border-color: #e9e9e9 transparent transparent transparent;
  }

  .switch .tooltip:hover .popup {
    visibility: visible;
  }

  .switch .images .image {
    width: 48px;
    height: 48px;
    cursor: pointer;
    padding: 1px;
    background: #8f4b4b;
  }

  .switch .popup .images .image {
    margin-left: 4px;
  }
</style>
