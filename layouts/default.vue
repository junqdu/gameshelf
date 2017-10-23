<template>
  <div class="app">
    <div class="main">
      <navbar/>
      <nuxt/>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>

<style scoped>
.app {
  height: 100vh;
  width: 100vw;
}
.main {
  margin: 0 auto;
  padding: 30px;
}
</style>
