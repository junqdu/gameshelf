<template>
  <section class="container">
    <div>
      <v-loader v-if="loading"></v-loader>
      <b-container v-if="!loading && !waitingForBGG" class="bv-example-row">
        <b-row>
          <b-col>
            <v-filters ownedgames></v-filters>
            <v-actions></v-actions>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <v-table :games="items" :extFilters="filters" :headers="tableHeader" v-if="views.listView"></v-table>
            <v-grid :games="items" v-if="!views.listView"></v-grid>
          </b-col>
        </b-row>
      </b-container>
      <v-refresh v-if="waitingForBGG" :message="errorMessage"></v-refresh>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import cookie from '~/components/cookie.js'
import filterItems from '~/components/filterItems.js'
import Game from '~/components/Game.js'
import VFilters from '~/components/v-filters.vue'
import VActions from '~/components/v-actions.vue'
import VGrid from '~/components/v-grid.vue'
import VLoader from '~/components/v-loader.vue'
import VRefresh from '~/components/v-refresh.vue'
import VTable from '~/components/v-table.vue'
import X2JS from 'x2js'

var _ = require('lodash')

export default {
  beforeCreate: function () {
    if (this.$route.query.userId) {
      cookie.set('username', this.$route.query.userId)
    } else if (this.$route.query.userid) {
      cookie.set('username', this.$route.query.userid)
    } else if (!cookie.get('username')) {
      cookie.set('username', 'Za Warudo')
    }

    if (this.$route.query.showexp) {
      cookie.set('showexp', true)
    } else if (cookie.get('showexp') === '') {
      cookie.set('showexp', false)
    }
  },
  components: {
    VGrid,
    VLoader,
    VRefresh,
    VTable,
    VActions,
    VFilters
  },
  created: function () {
    this.$store.commit('filters/reset', this.$route.query)
    this.$store.commit('filters/setOwned', true)
    let userIds = this.$route.query.userId || this.userId
    userIds = userIds.split(',').slice(0, 9)
    const promises = []

    userIds.forEach((userId) => {
      if (userId) {
        promises.push(axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
          params: {
            stats: 1,
            username: userId.trim()
          }
        }))
      }
    })

    axios.all(promises).then((results) => {
      var items = {}
      this.loading = false
      var x2js = new X2JS()

      _.forEach(results, (result) => {
        var data = x2js.xml2js(result.data)
        this.games.push(data)

        let userId = _.get(result, 'config.params.username')

        let rank
        _.forEach(_.get(data, 'items.item'), item => {
          if (_.get(item, 'stats.rating.ranks.rank.length', false)) {
            rank = parseFloat(item.stats.rating.ranks.rank[0]._value)
          } else {
            rank = parseFloat(_.get(item, 'stats.rating.ranks.rank._value'))
          }

          let gameId = item._objectid
          let numplays = parseFloat(item.numplays)
          let rating = parseFloat(item.stats.rating._value)
          if (items[gameId]) {
            items[gameId].users[userId] = {
              numplays,
              rating: rating || 0
            }
            items[gameId].numplays += numplays || 0
            items[gameId].rating = this.getAverageRating(items[gameId].users)
            if (!items[gameId].own) {
              items[gameId].own = _.get(item, 'status._own') === '1'
            }
          } else {
            items[gameId] = (new Game({
              average: parseFloat(_.get(item, 'stats.rating.average._value')),
              id: gameId,
              imageUrl: item.thumbnail,
              maxplayer: parseFloat(item.stats._maxplayers),
              minplayer: parseFloat(item.stats._minplayers),
              name: item.name.__text,
              numplays,
              own: _.get(item, 'status._own') === '1',
              playingtime: parseFloat(item.stats._playingtime),
              rank,
              rating,
              userId
            }))
          }
        })
      })
      this.$store.commit('items/set', items)

      this.items = items
    }).catch((res) => {
      if (res.config) {
        this.errorMessage = `Waiting for BGG to process for user "${res.config.params.username}". Please try again later for access.`
      } else {
        this.errorMessage = res.message
      }
      this.loading = false
      this.waitingForBGG = true
    })
  },
  data () {
    return {
      errorMessage: '',
      games: [],
      items: {},
      loading: true,
      popoverShow: false,
      views: this.$store.state.views,
      tableHeader: [
        {key: '', value: '', hide: this.$route.query.noimage},
        {key: 'rank', value: 'Rank'},
        {key: 'average', value: 'Avg. Rating'},
        {key: 'rating', value: 'User Rating'},
        {key: 'name', value: 'Name'},
        {key: 'weight', value: 'Weight'},
        {key: 'playingtime', value: 'Length'},
        {key: 'bggbestplayers', value: 'Best #Player'},
        {key: 'numplays', value: 'Plays'},
        {key: 'mech', value: 'Mechanisms'}
      ],
      supplayer: this.$route.query.supplayer || undefined,
      userId: cookie.get('username'),
      waitingForBGG: false
    }
  },
  methods: {
    filteredItem: filterItems,
    getAverageRating: function (users) {
      let sum = 0
      let count = 0
      _.forEach(users, user => {
        if (user.rating) {
          sum += user.rating
          count++
        }
      })
      let avg = sum / count
      return avg || 0
    },
    getARandomGame: function () {
      const games = this.filteredItem(this.items)
      const ran = Math.floor(Math.random() * games.length)
      this.$toast.success('Go play ' + games[ran].name, {
        icon: 'fa-play',
        action: {
          text: 'Link',
          href: 'https://boardgamegeek.com/boardgame/' + games[ran].id
        }
      })
    }
  }
}
</script>

<style>
.container {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.filters .col-sm-auto {
  padding-bottom: 0.25rem;
}

.popover {
  max-width: 32rem;
}
</style>
