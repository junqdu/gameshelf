<template>
  <div class="username-bar">
    <input type="text" v-model="username" placeholder="Your BGG username" />
    <button @click="change()">Change user</button>
  </div>
</template>

<script>
import cookie from '~/components/cookie.js'

export default {
  methods: {
    change: function () {
      cookie.set('username', this.username)
      location.reload()
    }
  },
  data: {
    username: cookie.get('username')
  },
  props: {
    username: {
      default: cookie.get('username'),
      type: String
    }
  }
}
</script>

<style scoped>
  .username-bar {
    font-size: 12px;
  }
  input[type="text"] {
    margin-right: 1rem;
  }
  button {
    cursor: pointer;
  }
</style>
