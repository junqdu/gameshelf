<template>
  <span>
    {{ message }}
    <button @click="refresh()">Refresh</button>
  </span>
</template>

<script>
export default {
  props: {
    message: { type: String, required: true }
  },
  methods: {
    refresh: function () {
      location.reload()
    }
  }
}
</script>

<style scoped>
</style>
