<template>
  <b-container class="actions" fluid>
    <b-row>
      <b-col sm="auto">
        <b-button size="sm" variant="primary" v-clipboard="getShareLink()" @click="$toast.success('Link copied to clipboard', { icon : 'fa-clipboard'})">
          <i class="fa fa-share-alt" aria-hidden="true"></i>
          Share This List
        </b-button>
      </b-col>
      <b-col sm="auto">
        <b-button size="sm" variant="primary" @click="getARandomGame()">
          <i class="fa fa-random" aria-hidden="true"></i>
          Get Me A Game
        </b-button>
      </b-col>
      <b-col sm="auto">
        <b-button size="sm" variant="primary" v-clipboard="getList()" @click="$toast.success('List copied to clipboard', { icon : 'fa-clipboard'})">
          <i class="fa fa-share-alt" aria-hidden="true"></i>
          Copy This List
        </b-button>
      </b-col>
      <b-col sm="auto">
        <b-button size="sm" variant="primary" @click="toggleListView()">
          <span v-if="views.listView">
            <i class="fa fa-th" aria-hidden="true"></i>
            Toggle Grid View
          </span>
          <span v-if="!views.listView">
            <i class="fa fa-list" aria-hidden="true"></i>
            Toggle Table View
          </span>
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import cookie from '~/components/cookie'
import filterItems from '~/components/filterItems'
import params from '~/components/params.js'
import _ from 'lodash'

export default {
  data () {
    return {
      getShareLink: function () {
        let link = `${window.origin}?userId=${cookie.get('username')}&`
        const { filters } = this.$store.state
        const queryParams = params.map(param => (filters[param] ? `${param}=${filters[param]}` : null)).filter(i => !!i).join('&')
        return encodeURI(`${link}${queryParams}`)
      },
      getList: function () {
        const games = filterItems(this.$store.state.items[this.$route.name], this.$store.state.filters)
        let result = ''
        _.forEach(games, game => {
          result += game.name + ' - ' + game.comment + '\n'
        })
        return result
      },
      getARandomGame: function () {
        const games = filterItems(this.$store.state.items[this.$route.name], this.$store.state.filters)
        const ran = Math.floor(Math.random() * games.length)
        this.$toast.success('Go play ' + games[ran].name, {
          icon: 'fa-play',
          action: {
            text: 'Link',
            href: 'https://boardgamegeek.com/boardgame/' + games[ran].id
          }
        })
      },
      views: this.$store.state.views
    }
  },
  methods: {
    toggleListView () {
      this.$store.commit('views/toggleListView')
    }
  }
}
</script>

<style>
.actions {
  margin-bottom: 1rem;
}
</style>
