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
          <i class="fa fa-copy" aria-hidden="true"></i>
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
        let result = ''
        _.forEach(this.games, game => {
          result += game.name + ' - ' + game.comment + '\n'
        })
        return result
      },
      getARandomGame: function () {
        let game = _.sample(this.games)
        this.$toast.success('Go play ' + game.name, {
          icon: 'fa-play',
          action: {
            text: 'Link',
            href: 'https://boardgamegeek.com/boardgame/' + game.id
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
  },
  props: {
    games: { type: Object }
  }
}
</script>

<style>
.actions {
  margin-bottom: 1rem;
}
</style>
