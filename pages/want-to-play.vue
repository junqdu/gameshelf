<template>
  <section class="container">
    <div>
      <v-loader v-if="loading"></v-loader>
      <b-container v-if="!loading && !waitingForBGG" class="bv-example-row">
        <b-row>
          <b-col>
            <b-container class="filters" fluid>
              <b-row>
                  <b-col sm="auto"><input v-model="bestnum" type="number" placeholder="Best# of Players" min="1"></b-col>
                  <b-col sm="auto"><input v-model="recnum" type="number" placeholder="Recom# of Players" min="1"></b-col>
                  <b-col sm="auto"><input v-model="supplayer" type="number" placeholder="Support Players" min="1"></b-col>
                  <b-col sm="auto"><input v-model="maxtime" type="number" placeholder="Max Play Time" min="0" step="10"></b-col>
                  <b-col sm="auto"><input v-model="mintime" type="number" placeholder="Min Play Time" min="0" step="10"></b-col>
                  <b-col sm="auto"><input v-model="maxweight" type="number" placeholder="Max Weight" min="1" step="0.1"></b-col>
                  <b-col sm="auto"><input v-model="minweight" type="number" placeholder="Min Weight" min="1" step="0.1"></b-col>
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
                    <b-button size="sm" variant="primary" @click="listView = !listView">
                      <span v-if="listView">
                        <i class="fa fa-th" aria-hidden="true"></i>
                        Toggle Grid View
                      </span>
                      <span v-if="!listView">
                        <i class="fa fa-list" aria-hidden="true"></i>
                        Toggle Table View
                      </span>
                    </b-button>
                  </b-col>
                  <b-col sm="auto">
                    <b-button size="sm" variant="primary" @click="ownedGames = !ownedGames">
                      <span v-if="ownedGames">
                        <i class="fa fa-users" aria-hidden="true"></i>
                        Show All Games
                      </span>
                      <span v-if="!ownedGames">
                        <i class="fa fa-user" aria-hidden="true"></i>
                        Show Only Owned Games
                      </span>
                    </b-button>
                  </b-col>
              </b-row>
            </b-container>
            <v-table :games="filteredItem()" :headers="tableHeader" v-if="listView"></v-table>
            <v-grid :games="filteredItem()" v-if="!listView"></v-grid>
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
    VTable
  },
  created: function () {
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
      bestnum: this.$route.query.bestnum || undefined,
      errorMessage: '',
      items: [],
      listView: true,
      loading: true,
      maxtime: this.$route.query.maxtime || undefined,
      maxweight: this.$route.query.maxweight || undefined,
      mintime: this.$route.query.mintime || undefined,
      minweight: this.$route.query.minweight || undefined,
      ownedGames: false,
      recnum: this.$route.query.recnum || undefined,
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
      supplayer: this.$route.query.supplayer || undefined,
      userId: cookie.get('username'),
      waitingForBGG: false
    }
  },
  methods: {
    getARandomGame: function () {
      const games = this.filteredItem()
      const ran = Math.floor(Math.random() * games.length)
      this.$toast.success('Go play ' + games[ran].name, {
        icon: 'fa-play',
        action: {
          text: 'Link',
          href: 'https://boardgamegeek.com/boardgame/' + games[ran].id
        }
      })
    },
    getShareLink: function () {
      let link = 'https://gameshelf.github.io/want-to-play?'
      const params = ['userId', 'bestnum', 'maxtime', 'maxweight', 'mintime', 'minweight', 'recnum', 'supplayer']
      _.forEach(params, param => {
        if (this[param]) {
          link = link + param + '=' + this[param] + '&'
        }
      })
      link = link.slice(0, link.length - 1)
      if (cookie.get('showexp') === 'true') {
        link = link + 'showexp' + '=' + cookie.get('showexp')
      }
      return encodeURI(link)
    },
    filteredItem: function () {
      return this.items.filter((item) => {
        let bestnum = false
        if (cookie.get('bestatleast')) {
          const highestNum = _.get(item, 'bggbestplayers', '').split(',').pop()
          if (highestNum) {
            bestnum = +highestNum >= this.bestnum
          }
        } else {
          bestnum = _.get(item, 'bggbestplayers', '').split(',').includes(this.bestnum)
        }
        console.log(this, item)
        return (!this.bestnum || bestnum) &&
        (!this.recnum || _.get(item, 'bggrecplayers', '').split(',').includes(this.recnum)) &&
        (!this.mintime || item.playingtime >= this.mintime) &&
        (!this.maxtime || item.playingtime <= this.maxtime) &&
        (!this.supplayer || (item.minplayer <= this.supplayer && item.maxplayer >= this.supplayer)) &&
        (!this.maxweight || item.weight <= this.maxweight) &&
        (!this.minweight || item.weight >= this.minweight) &&
        (this.ownedGames ? item.own : true)
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
</style>
