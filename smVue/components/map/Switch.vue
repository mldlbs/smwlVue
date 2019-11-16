<template>
  <div class="switch">
    <div class="images" v-for="(img, key)  in images">
      <el-image class="image" :src="img" fit="fill" @click="switchView(key)"></el-image>
    </div>
  </div>
</template>
<script>
    import { mapState, mapMutations } from 'vuex';
    import m from '~/assets/img/map/m.png';
    import i from '~/assets/img/map/i.png';
    import s from '~/assets/img/map/s.png';

    export default {
        data() {
            return {
                images: [m, i, s]
            }
        },
        mounted() {
        },
        computed: {
            ...mapState({
                TAG: state => state.Gis.TAG
            })
        },
        methods:{
            ...mapMutations([
                'CHANGE_TAG'
            ]),
            switchView(index) {
                this.CHANGE_TAG(index);
                console.log(this.TAG);
            },
        }
    }
</script>
<style>
  .switch {
    position: absolute;
    bottom: 6px;
    right: 6px;
    z-index: 6;
  }

  .images {
    display: inline-block;
  }

  .image {
    width: 48px;
    height: 48px;
    cursor: pointer;
  }

</style>
