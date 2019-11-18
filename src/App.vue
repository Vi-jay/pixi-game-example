<template>
  <div id="app">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script>
    import {setUp} from "./game/init"

    export default {
        name: 'App',
        components: {},
        mounted() {
            setUp(this.$refs.canvas)
        }
    }
</script>

<style>
  * {
   margin: 0;
    padding: 0;
  }
</style>
