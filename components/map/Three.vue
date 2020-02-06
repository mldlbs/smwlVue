<template>
  <div id="Three" />
</template>
<script>
import main from '~/static/mapjs/main'

export default {
  mounted () {
    setTimeout(() => {
      main.sEvent.initThree()
      main.sEvent.loop()
    }, 3000)
  }
}
</script>
<style>
  #Three{
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    margin: 0;
    overflow: hidden;
    padding: 0;
    font-family: sans-serif;
    pointer-events:none;
  }
</style>
