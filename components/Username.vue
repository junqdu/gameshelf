<template>
  <div class="username-bar">
    <form @submit="change()">
      <input
        v-model.trim="mutableUsername"
        type="text"
        placeholder="Your BGG username"
      >
      <b-button
        class="btn-sm"
        @click="change()"
      >
        Change user
      </b-button>
    </form>
  </div>
</template>

<script>
import cookie from '~/components/cookie'

export default {
  data: function () {
    return {
      mutableUsername: this.username
    }
  },
  methods: {
    change: function () {
      cookie.set('username', this.mutableUsername)
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
