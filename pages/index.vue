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
                    <b-button size="sm" :id="'mech-filter'" variant="primary">
                      <i class="fa fa-gear" aria-hidden="true"></i>
                      Filter By Mechanics
                    </b-button>
                    <b-popover :target="'mech-filter'"
                              :placement="'bottom'"
                              triggers="focus"
                              :content="`Placement ${placement}`">
                      <b-tabs>
                        <b-tab title="Show" active>
                          <b-form-group>
                            <b-form-checkbox-group v-model="mechShow" name="mechanics" :options="mechOptions">
                            </b-form-checkbox-group>
                          </b-form-group>
                        </b-tab>
                        <b-tab title="Hide" >
                          <b-form-group>
                            <b-form-checkbox-group v-model="mechHide" name="mechanics" :options="mechOptions">
                            </b-form-checkbox-group>
                          </b-form-group>
                        </b-tab>
                      </b-tabs>
                    </b-popover>
                  </b-col>
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
              </b-row>
            </b-container>
            <v-table :games="filteredItem()" :headers="tableHeader" v-if="listView"></v-table>
            <v-grid :games="filteredItem()" v-if="!listView"></v-grid>
          </b-col>
        </b-row>
      </b-container>
      <adsbygoogle />
      <v-refresh v-if="waitingForBGG" :message="errorMessage"></v-refresh>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import cookie from '~/components/cookie.js'
import Game from '~/components/Game.js'
import VGrid from '~/components/v-grid.vue'
import VLoader from '~/components/v-loader.vue'
import VRefresh from '~/components/v-refresh.vue'
import VTable from '~/components/v-table.vue'
import X2JS from 'x2js'

var _ = require('lodash')
const keys = require('../assets/mechKey.json')

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
    VTable
  },
  created: function () {
    let userIds = this.$route.query.userId || this.userId
    userIds = userIds.split(',').slice(0, 9)
    const promises = []

    _.forEach(userIds, (userId) => {
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
          if (item.stats.rating.ranks.rank.length) {
            rank = parseFloat(item.stats.rating.ranks.rank[0]._value)
          } else {
            rank = parseFloat(item.stats.rating.ranks.rank._value)
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
              average: parseFloat(item.stats.rating.average._value),
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
      bestnum: this.$route.query.bestnum || undefined,
      errorMessage: '',
      games: [],
      items: {},
      listView: true,
      loading: true,
      maxtime: this.$route.query.maxtime || undefined,
      maxweight: this.$route.query.maxweight || undefined,
      mechOptions: this.getMechOptions(),
      mechHide: [],
      mechShow: [],
      mintime: this.$route.query.mintime || undefined,
      minweight: this.$route.query.minweight || undefined,
      recnum: this.$route.query.recnum || undefined,
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
        {key: 'mech', value: 'Mechanics'}
      ],
      supplayer: this.$route.query.supplayer || undefined,
      userId: cookie.get('username'),
      waitingForBGG: false
    }
  },
  methods: {
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
    getMechOptions: function () {
      const temp = []
      _.forEach(keys, function (key) {
        temp.push({text: key, value: key})
      })
      return temp
    },
    getShareLink: function () {
      let link = 'https://gameshelf.github.io?'
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
      return _.filter(this.items, (item) => {
        let bestnum = false
        if (cookie.get('bestatleast')) {
          const highestNum = _.get(item, 'bggbestplayers', '').split(',').pop()
          if (highestNum) {
            bestnum = +highestNum >= this.bestnum
          }
        } else {
          bestnum = _.get(item, 'bggbestplayers', '').split(',').includes(this.bestnum)
        }

        let mech = true

        if (this.mechShow.length > 0) {
          mech = _.intersection(this.mechShow, item.mech).length === this.mechShow.length
        }

        if (this.mechHide.length > 0) {
          mech = !_.intersection(this.mechHide, item.mech).length > 0
        }

        return (!this.bestnum || bestnum) &&
        (!this.recnum || _.get(item, 'bggrecplayers', '').split(',').includes(this.recnum)) &&
        (!this.mintime || item.playingtime >= this.mintime) &&
        (!this.maxtime || item.playingtime <= this.maxtime) &&
        (!this.supplayer || (item.minplayer <= this.supplayer && item.maxplayer >= this.supplayer)) &&
        (!this.maxweight || item.weight <= this.maxweight) &&
        (!this.minweight || item.weight >= this.minweight) &&
        ((cookie.get('showexp') === 'false' && item.type !== 'e') || cookie.get('showexp') === 'true') &&
        ((cookie.get('showexp') === 'true' && item.type === 'e' && item.average >= cookie.get('expmin')) || item.type !== 'e') &&
        item.own && mech
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
