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
                  <td>
                    <span class="badge" :class="['badge-' + item.rating]">{{item.rating}}</span>
                  </td>
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
        // {key: 'minPlayer', value: 'Min. Player'},
        // {key: 'maxPlayer', value: 'Max. Player'},
        {key: 'weight', value: 'Weight'},
        {key: 'playingtime', value: 'Length'},
        {key: 'bggbestplayers', value: 'Best #Player'}
        // {key: 'bggrecplayers', value: 'Rec. #Player'}
      ],
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
  justify-content: center;
  align-items: center;
  text-align: center;
}

.links {
  padding-top: 15px;
}

.rec-player, .best-player {
  max-width: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* .rank, .average, .minPlayer, .maxPlayer,
.playingtime, .bggrecplayers, .bggbestplayers {
  min-width: 6rem;
}

.rating, .playingtime {
  min-width: 7rem;
} */

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

.badge {
  font-size: 100%;
}

.badge-10 {
  background: #00cc00;
}

.badge-9 {
  background: #33cc99;
}

.badge-8 {
  background: #66ff99;
}

.badge-7 {
  background: #99ffff;
}

.badge-6 {
  background: #9999ff;
}

.badge-5 {
  background: #cc99ff;
}

.badge-4 {
  background: #ff66cc;
}

.badge-3 {
  background: #ff6699;
}

.badge-2 {
  background: #ff3366;
}

.badge-1 {
  background: #ff0000;
}

.badge-0 {
  background: gray;
}

.badge-heavy {
  background: #800080;
  color: orange;
}

.badge-medium-heavy {
  background: #a3529f;
  color: orange;
}

.badge-medium {
  background: #c38bbf;
  color: orange;
}

.badge-medium-light {
  background: #e2c5df;
}

.badge-light {
  background: #ffffff;
}

.badge-t1 {
  background: #008000;
  color: white;
}
.badge-t2 {
  background: #628d00;
  color: white;
}
.badge-t3 {
  background: #979700;
}
.badge-t4 {
  background: #cc9f00;
}
.badge-t5 {
  background: #ffa500;
}
</style>
