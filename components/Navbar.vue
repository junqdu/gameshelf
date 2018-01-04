<template>
  <div class="header">
    <nuxt-link to="/" exact>Collection</nuxt-link>
    <nuxt-link to="/want-to-play">Want To Play</nuxt-link>
    <nuxt-link to="/latest-100-plays">Latest 100 Plays</nuxt-link>
    <nuxt-link to="/help">Help</nuxt-link>
    <!-- <nuxt-link to="/about">About</nuxt-link> -->
    <!-- <nuxt-link to="/want-to-buy">Want To Buy</nuxt-link> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters(['isAuthenticated'])
}
</script>

<style scoped>
.header {
  display: flex;
  margin-bottom: 20px;
}
a {
  margin-right: 20px;
  font-size: 14px;
  color: #999;
  text-decoration: none;
  text-transform: uppercase;
  padding-top: 2px;
  padding-bottom: 2px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  transition: color .25s;
  font-weight: 400;
  line-height: normal;
}
a:hover {
  color: #333;
}
a.nuxt-link-active {
  color: #333;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  font-weight: 600;
}
</style>
