<template>
  <section class="container">
    <div>
      <v-loader v-if="loading"></v-loader>
      <b-container v-if="!loading && !waitingForBGG" class="bv-example-row">
        <b-row>
          <b-col>
            <v-filters showOwned></v-filters>
            <v-actions></v-actions>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <v-table :games="items" :headers="tableHeader" v-if="views.listView"></v-table>
            <v-grid :games="items" v-if="!views.listView"></v-grid>
          </b-col>
        </b-row>
      </b-container>
      <v-refresh :message="errorMessage" v-if="waitingForBGG"></v-refresh>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import cookie from '~/components/cookie.js'
import Game from '~/components/Game.js'
import VGrid from '~/components/v-grid.vue'
import VRefresh from '~/components/v-refresh.vue'
import VLoader from '~/components/v-loader.vue'
import VTable from '~/components/v-table.vue'
import VFilters from '~/components/v-filters.vue'
import VActions from '~/components/v-actions.vue'
import X2JS from 'x2js'
var _ = require('lodash')

export default {
  beforeCreate: function () {
    if (this.$route.query.userId) {
      cookie.set('username', this.$route.query.userId, 3650)
    } else if (this.$route.query.userid) {
      cookie.set('username', this.$route.query.userid, 3650)
    } else if (!cookie.get('username')) {
      cookie.set('username', 'Za Warudo', 3650)
    }
  },
  components: {
    VGrid,
    VLoader,
    VRefresh,
    VTable,
    VFilters,
    VActions
  },
  created: function () {
    this.$store.commit('filters/reset')
    this.$store.commit('filters/setOwned', false)
    let userIds = this.$route.query.userId || this.userId
    userIds = userIds.split(',').slice(0, 9)
    return axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
      params: {
        stats: 1,
        username: userIds[0].trim(),
        wanttoplay: 1
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
              own: _.get(item, 'status._own') === '1',
              playingtime: parseFloat(item.stats._playingtime),
              rank,
              rating: parseFloat(item.stats.rating._value)
            }))
          })
          this.items = items
        }
      })
      .catch((res) => {
        console.log(res)
        this.errorMessage = `Waiting for BGG to process for user "${res.config.params.username}". Please try again later for access.`
        this.loading = false
        this.waitingForBGG = true
      })
  },
  data () {
    return {
      errorMessage: '',
      filters: {},
      items: [],
      loading: true,
      tableHeader: [
        {key: '', value: '', hide: this.$route.query.noimage},
        {key: 'rank', value: 'Rank'},
        {key: 'average', value: 'Avg. Rating'},
        {key: 'name', value: 'Name'},
        {key: 'weight', value: 'Weight'},
        {key: 'playingtime', value: 'Length'},
        {key: 'bggbestplayers', value: 'Best #Player'},
        {key: 'mech', value: 'Mechanisms'}
      ],
      views: this.$store.state.views,
      userId: cookie.get('username'),
      waitingForBGG: false
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
</style>
