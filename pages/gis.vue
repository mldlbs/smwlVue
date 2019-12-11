<template>
  <div class="container">
    <div>
      <Main />
    </div>
  </div>
</template>

<script>
  import Main from "~/components/Main.vue"
  // eslint-disable-next-line no-unused-vars

  export default {
  layout: 'Gis',
  components: {
    Main
  },
  mounted () {
    // this.initData()
  },
  methods: {
    initData () {
    }
  }
}
</script>

<style>
  .container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
</style>
