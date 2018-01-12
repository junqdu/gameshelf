<template>
  <section class="container">
    <div>
      <v-loader v-if="loading"></v-loader>
      <b-container v-if="!loading && !waitingForBGG" class="bv-example-row">
        <b-row>
          <b-col>
            <div class="filter">
              <input v-model="bestnum" type="number" placeholder="Best# of Players" min="1">
              <input v-model="recnum" type="number" placeholder="Recom# of Players" min="1">
              <input v-model="supplayer" type="number" placeholder="Support Players" min="1">
              <input v-model="maxtime" type="number" placeholder="Max Play Time" min="0" step="10">
              <input v-model="mintime" type="number" placeholder="Min Play Time" min="0" step="10">
              <input v-model="maxweight" type="number" placeholder="Max Weight" min="1" max="5" step="0.1">
              <input v-model="minweight" type="number" placeholder="Min Weight" min="1" max="5" step="0.1">
            </div>
            <v-table :games="filteredItem()" :headers="tableHeader"></v-table>
          </b-col>
        </b-row>
      </b-container>
      <v-refresh v-if="waitingForBGG"></v-refresh>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import cookie from '~/components/cookie.js'
import Game from '~/components/Game.js'
import VRefresh from '~/components/v-refresh.vue'
import VLoader from '~/components/v-loader.vue'
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
    VRefresh,
    VLoader,
    VTable
  },
  created: function () {
    return axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
      params: {
        own: 1,
        stats: 1,
        username: this.$route.query.userId || this.userId
      }
    })
      .then((res) => {
        this.loading = false
        if (res.status === 200) {
          var x2js = new X2JS()
          var data = x2js.xml2js(res.data)

          var items = []
          let rank
          _.forEach(_.get(data, 'items.item'), function (item) {
            if (item.stats.rating.ranks.rank.length) {
              rank = parseFloat(item.stats.rating.ranks.rank[0]._value)
            } else {
              rank = parseFloat(item.stats.rating.ranks.rank._value)
            }
            items.push(new Game({
              average: parseFloat(item.stats.rating.average._value),
              id: item._objectid,
              imageUrl: item.thumbnail,
              maxplayer: parseFloat(item.stats._maxplayers),
              minplayer: parseFloat(item.stats._minplayers),
              name: item.name.__text,
              numplays: parseFloat(item.numplays),
              playingtime: parseFloat(item.stats._playingtime),
              rank,
              rating: parseFloat(item.stats.rating._value)
            }))
          })
          this.items = _.uniqBy(items, 'id')
          this.games = data
        }
      })
      .catch(() => {
        this.loading = false
        this.waitingForBGG = true
      })
  },
  data () {
    return {
      bestnum: this.$route.query.bestnum || undefined,
      games: {},
      items: [],
      loading: true,
      maxtime: this.$route.query.maxtime || undefined,
      maxweight: this.$route.query.maxweight || undefined,
      mintime: this.$route.query.mintime || undefined,
      minweight: this.$route.query.minweight || undefined,
      noImage: this.$route.query.noImage,
      recnum: this.$route.query.recnum || undefined,
      tableHeader: [
        {key: '', value: '', condition: this.noImage},
        {key: 'rank', value: 'Rank'},
        {key: 'average', value: 'Avg. Rating'},
        {key: 'rating', value: 'My Rating'},
        {key: 'name', value: 'Name'},
        {key: 'weight', value: 'Weight'},
        {key: 'playingtime', value: 'Length'},
        {key: 'bggbestplayers', value: 'Best #Player'},
        {key: 'numplays', value: 'Plays'}
      ],
      supplayer: this.$route.query.supplayer || undefined,
      userId: cookie.get('username'),
      waitingForBGG: false
    }
  },
  methods: {
    filteredItem: function () {
      return this.items.filter((item) => {
        return (!this.bestnum || _.get(item, 'bggbestplayers', '').split(',').includes(this.bestnum)) &&
        (!this.recnum || _.get(item, 'bggrecplayers', '').split(',').includes(this.recnum)) &&
        (!this.mintime || item.playingtime >= this.mintime) &&
        (!this.maxtime || item.playingtime <= this.maxtime) &&
        (!this.supplayer || (item.minplayer <= this.supplayer && item.maxplayer >= this.supplayer)) &&
        (!this.maxweight || item.weight <= this.maxweight) &&
        (!this.minweight || item.weight >= this.minweight) &&
        ((cookie.get('showexp') === 'false' && item.type !== 'expansion') || cookie.get('showexp') === 'true') &&
        ((cookie.get('showexp') === 'true' && item.type === 'expansion' && item.average >= cookie.get('expmin')) || item.type !== 'expansion')
      })
    }
  }
}
</script>

<style>
.container {
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.links {
  padding-top: 15px;
}

.filter {
  padding-bottom: 0.5rem;
}

.filter input {
  margin-right: 0.5rem;
  width: 9rem
}
</style>
