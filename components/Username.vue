<template>
  <div class="username-bar">
    <form @submit="change()">
      <input type="text" v-model.trim="username" placeholder="Your BGG username" />
      <button @click="change()">Change user</button>
    </form>
  </div>
</template>

<script>
import cookie from '~/components/cookie'

export default {
  methods: {
    change: function () {
      cookie.set('username', this.username)
      location.reload()
    }
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
