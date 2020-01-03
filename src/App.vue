<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <hello-world/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorld
  }
}
</script>

<style>

</style>
