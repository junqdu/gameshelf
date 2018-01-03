<template>
  <section class="container">
    <div>
      <div v-if="loading" class="loader"></div>
      <b-container v-if="!loading && !waitingForBGG" class="bv-example-row">
        <b-row>
          <b-col>
            <div class="filter">
              <input v-model="bestnum" placeholder="Best# of Players">
              <input v-model="mintime" type="number" placeholder="Min. Play Time">
              <input v-model="maxtime" type="number" placeholder="Max. Play Time">
            </div>
            <table class="table table-striped" v-if="orderedGames">
              <thead>
                <tr>
                  <th scope="col" v-for="header in tableHeader" @click="sort(header.key)" :class="[header.key]" v-if="!header.condition">
                    <span>
                      {{header.value}}
                      <i class="fa" aria-hidden="true" v-if="sortBy === header.key" :class="{'fa-arrow-down': asc, 'fa-arrow-up': !asc}"></i>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in filterBy(orderedGames, bestnum, mintime, maxtime)" :key="item.id">
                  <td v-if='!noImage'>
                    <a :href="'https://boardgamegeek.com/boardgame/' + item.id">
                      <b-img width="75" :src="item.imageUrl"/>
                    </a>
                  </td>
                  <td>{{item.rank}}</td>
                  <td>
                    <span class="badge" :class="['badge-' + getRatingColor(item.average, true)]">{{item.average | number}}</span>
                  </td>
                  <!-- <td>
                    <span class="badge" :class="['badge-' + item.rating]">{{item.rating}}</span>
                  </td> -->
                  <td class="name">
                    <a :href="'https://boardgamegeek.com/boardgame/' + item.id">{{item.name}}</a>
                  </td>
                  <!-- <td>{{item.minPlayer}}</td>
                  <td>{{item.maxPlayer}}</td> -->
                  <td>
                    <span class="badge" :class="['badge-' + getWeightColor(item.weight)]">{{item.weight | number}}</span>
                  </td>
                  <td>{{item.playingtime}} mins</td>
                  <td class="best-player">{{item.bggbestplayers}}</td>
                  <!-- <td class="rec-player">{{item.bggrecplayers}}</td> -->
                </tr>
              </tbody>
            </table>
            Item count: {{orderedGames.length}}
          </b-col>
        </b-row>
      </b-container>
      <span v-if="waitingForBGG">
        Waiting for BGG to process. Please try again later for access.
        <button @click="refresh()">Refresh</button>
      </span>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import cookie from '~/components/cookie.js'
import Game from '~/components/Game.js'
import X2JS from 'x2js'
var _ = require('lodash')

export default {
  beforeCreate: function () {
    if (this.$route.query.userId) {
      cookie.set('username', this.$route.query.userId, 3650)
    } else if (!cookie.get('username')) {
      cookie.set('username', 'Za Warudo', 3650)
    }
  },
  created: function () {
    return axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
      params: {
        stats: 1,
        username: this.$route.query.userId || this.userId,
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
          data.items.item.forEach(function (item) {
            if (item.stats.rating.ranks.rank.length) {
              rank = parseFloat(item.stats.rating.ranks.rank[0]._value)
            } else {
              rank = parseFloat(item.stats.rating.ranks.rank._value)
            }
            items.push(new Game({
              average: parseFloat(item.stats.rating.average._value),
              id: item._objectid,
              imageUrl: item.thumbnail,
              name: item.name.__text,
              numplays: parseFloat(item.numplays),
              playingtime: parseFloat(item.stats._playingtime),
              rank,
              rating: parseFloat(item.stats.rating._value)
            }))
          })
          this.$data.items = items
        }
      })
      .catch(() => {
        this.loading = false
        this.waitingForBGG = true
      })
  },
  data () {
    return {
      asc: true,
      bestnum: '',
      items: [],
      loading: true,
      maxtime: 480,
      mintime: 0,
      noImage: this.$route.query.noImage,
      tableHeader: [
        {key: '', value: '', condition: this.noImage},
        {key: 'rank', value: 'Rank'},
        {key: 'average', value: 'Avg. Rating'},
        // {key: 'rating', value: 'My Rating'},
        {key: 'name', value: 'Name'},
        // {key: 'minPlayer', value: 'Min. Player'},
        // {key: 'maxPlayer', value: 'Max. Player'},
        {key: 'weight', value: 'Weight'},
        {key: 'playingtime', value: 'Length'},
        {key: 'bggbestplayers', value: 'Best #Player'}
        // {key: 'bggrecplayers', value: 'Rec. #Player'}
      ],
      sortBy: 'rank',
      userId: cookie.get('username'),
      waitingForBGG: false
    }
  },
  computed: {
    orderedGames: function () {
      return _.orderBy(this.items, [this.sortBy, 'average'], [this.asc ? 'asc' : 'desc', 'desc'])
    }
  },
  methods: {
    filterBy: function (list, bestnum, mintime, maxtime) {
      return list.filter(function (item) {
        return (!bestnum || _.get(item, 'bggbestplayers', '').split(',').includes(bestnum)) && item.playingtime >= mintime && item.playingtime <= maxtime
      })
    },
    refresh: function (key) {
      location.reload()
    },
    sort: function (key) {
      if (!key) {
        return
      }
      if (key === this.sortBy) {
        this.asc = !this.asc
      } else {
        this.asc = true
        this.sortBy = key
      }
    },
    getWeightColor: function (weight) {
      if (weight > 4) {
        return 'heavy'
      } else if (weight > 3.5) {
        return 'medium-heavy'
      } else if (weight > 3) {
        return 'medium'
      } else if (weight > 2.5) {
        return 'medium-light'
      } else {
        return 'light'
      }
    },
    getRatingColor: function (rating, roundDown) {
      return roundDown ? _.floor(rating) : _.ceil(rating)
    }
  },
  filters: {
    number: function (value) {
      if (!value) return ''
      value = parseFloat(value)
      return value.toFixed(2)
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

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

input {
  margin-right: 0.5rem;
  width: 8.5rem
}
</style>
<style src="./table.less" lang="less" scoped></style>
