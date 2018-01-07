<template>
  <span>
    Waiting for BGG to process. Please try again later for access.
    <button @click="refresh()">Refresh</button>
</span>
</template>

<script>
export default {
  methods: {
    refresh: function () {
      location.reload()
    }
  }
}
</script>

<style scoped>
</style>
