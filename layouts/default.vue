<template>
  <div class="app">
    <div class="main">
      <header>
        <navbar/>
        <username />
      </header>
      <nuxt/>
    </div>
  </div>
</template>

<script>
import Navbar from '../components/Navbar'
import Username from '../components/Username'

export default {
  components: {
    Navbar,
    Username
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
  padding: 1.875rem;
}
header {
  display: flex;
  margin-bottom: 1rem;
}
</style>
