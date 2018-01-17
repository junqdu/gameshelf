<template>
  <span>
    {{message}}
    <button @click="refresh()">Refresh</button>
</span>
</template>

<script>
export default {
  methods: {
    refresh: function () {
      location.reload()
    }
  },
  props: {
    message: { type: String }
  }
}
</script>

<style scoped>
</style>
