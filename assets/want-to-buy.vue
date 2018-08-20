<template>
  <section class="container">
    <div>
      <b-container class="bv-example-row">
        <b-row>
          <b-col>
            <table class="table table-striped" v-if="orderedGames">
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
                    <a :href="'https://boardgamegeek.com/boardgame/' + item.id">
                      <b-img width="75" :src="item.imageUrl"/>
                    </a>
                  </td>
                  <td>{{item.rank}}</td>
                  <td>
                    <span class="badge" :class="['badge-' + getAverageRatingColor(item.average)]">{{item.average | number}}</span>
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
    </div>
  </section>
</template>

<script>
import Game from '~/components/Game.js'
import axios from 'axios'
import X2JS from 'x2js'
var _ = require('lodash')

export default {
  data () {
    return {
      asc: true,
      tableHeader: [
        {key: '', value: ''},
        {key: 'rank', value: 'Rank'},
        {key: 'average', value: 'Avg. Rating'},
        {key: 'name', value: 'Name'},
        {key: 'weight', value: 'Weight'},
        {key: 'playingtime', value: 'Length'},
        {key: 'bggbestplayers', value: 'Best #Player'}
      ],
      sortBy: 'rank'
    }
  },
  computed: {
    orderedGames: function () {
      return _.orderBy(this.items, [this.sortBy, 'average'], [this.asc ? 'asc' : 'desc', 'desc'])
    }
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
    getAverageRatingColor: function (rating) {
      if (rating > 8) {
        return 't1'
      } else if (rating > 7.5) {
        return 't2'
      } else if (rating > 7) {
        return 't3'
      } else if (rating > 6) {
        return 't4'
      } else {
        return 't5'
      }
    }
  },
  asyncData ({ params }) {
    return axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
      params: {
        stats: 1,
        username: 'Za Warudo',
        wishlist: 1
      }
    })
      .then((res) => {
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
              imageUrl: item.image,
              rank,
              rating: parseFloat(item.stats.rating._value)
            }))
          }, this)
          return { items }
        }
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
  justify-content: center;
  align-items: center;
  text-align: center;
}

.links {
  padding-top: 15px;
}
</style>
