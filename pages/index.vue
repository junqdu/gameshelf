<template>
  <section class="container">
    <div>
      <table class="table" v-if="orderedGames">
        <thead>
          <tr>
            <th scope="col" v-for="header in tableHeader" @click="sort(header.key)" :class="[header.key]">
              <span>
                {{header.value}}
                <i class="fa" aria-hidden="true" v-if="sortBy === header.key" :class="{'fa-arrow-down': asc, 'fa-arrow-up': !asc}"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orderedGames" :key="item.id">
            <td>
              <img :src="item.imageUrl" width="75px" />
            </td>
            <td>{{item.rank}}</td>
            <td>{{item.average | number}}</td>
            <td>{{item.rating}}</td>
            <td class="name">
              <a :href="'https://boardgamegeek.com/boardgame/' + item.id">{{item.name}}</a>
            </td>
            <td>{{item.minPlayer}}</td>
            <td>{{item.maxPlayer}}</td>
            <td>{{item.playingtime}} mins</td>
            <td class="best-player">{{item.bggbestplayers}}</td>
            <td class="rec-player">{{item.bggrecplayers}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import Game from '~/components/Game.js'
import axios from 'axios'
import X2JS from 'x2js'
// import _ from 'lodash'
var _ = require('lodash')

export default {
  data () {
    return {
      asc: true,
      tableHeader: [
        {key: '', value: ''},
        {key: 'rank', value: 'Rank'},
        {key: 'average', value: 'Avg. Rating'},
        {key: 'rating', value: 'My Rating'},
        {key: 'name', value: 'Name'},
        {key: 'minPlayer', value: 'Min. Player'},
        {key: 'maxPlayer', value: 'Max. Player'},
        {key: 'playingtime', value: 'Length'},
        {key: 'bggbestplayers', value: 'Best #Player'},
        {key: 'bggrecplayers', value: 'Rec. #Player'}],
      sortBy: 'rank'
    }
  },
  computed: {
    orderedGames: function () {
      return _.orderBy(this.items, this.sortBy, this.asc ? 'asc' : 'desc')
    }
  },
  created: function () {
    // `this` points to the vm instance
    // console.log('a is: ' + this.a)
  },
  methods: {
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
    }
  },
  asyncData ({ params }) {
    return axios.get('https://www.boardgamegeek.com/xmlapi2/collection?username=Za%20Warudo&own=1&excludesubtype=boardgameexpansion')
      .then((res) => {
        var x2js = new X2JS()
        var data = x2js.xml2js(res.data)

        // console.log(data)
        var items = []
        data.items.item.forEach(function (item) {
          items.push(new Game({id: item._objectid, imageUrl: item.image}))
        }, this)
        return { items }
      })
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
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

.rec-player, .best-player {
  max-width: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank, .average, .minPlayer, .maxPlayer,
.playingtime, .bggrecplayers, .bggbestplayers {
  min-width: 6rem;
}

.rating, .playingtime {
  min-width: 7rem;
}

.table td, .table th {
  padding: .25rem;
}

.table th:hover {
  cursor: pointer;
}

.table td {
  vertical-align: inherit;
}

.name a:hover {
  text-decoration: none;
}
</style>
