<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import {initRouter} from "./router";

  export default {
  name: 'app',
  created() {
    initRouter();
  }
}
</script>

<style>

</style>
