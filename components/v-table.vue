<template>
  <div class="header">
    <table class="table table-striped" v-if="games">
      <thead>
        <tr>
          <th scope="col" v-for="header in headers" @click="sort(header.key)" :class="[header.key]" v-if="!header.hide" :key="header.key">
            <span>
              {{header.value}}
              <i class="fa" aria-hidden="true" v-if="sortBy === header.key" :class="{'fa-arrow-down': !asc, 'fa-arrow-up': asc}"></i>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in orderedGames" :key="item.id">
          <td v-if="hasHeader('', true)">
            <a :href="'https://boardgamegeek.com/boardgame/' + item.id">
              <b-img width="75" :src="item.imageUrl"/>
            </a>
          </td>
          <td v-if="hasHeader('rank')">{{item.rank}}</td>
          <td v-if="hasHeader('average')">
            <span class="badge" :class="['badge-' + getRatingColor(item.average, true)]">{{item.average | number}}</span>
          </td>
          <td v-if="hasHeader('rating')">
            <span class="badge" :class="['badge-' + getRatingColor(item.rating)]">{{item.rating}}</span>
          </td>
          <td class="name" v-if="hasHeader('name')">
            <a :href="'https://boardgamegeek.com/boardgame/' + item.id">{{item.name}}</a>
          </td>
          <td class="date" v-if="hasHeader('date')">
            <a>{{item.date}}</a>
          </td>
          <td v-if="hasHeader('weight')">
            <span class="badge" :class="['badge-' + getWeightColor(item.weight)]">{{item.weight | number}}</span>
          </td>
          <td v-if="hasHeader('playingtime')">{{item.playingtime}} mins</td>
          <td class="best-player" v-if="hasHeader('bggbestplayers')">{{item.bggbestplayers}}</td>
          <td class="num-plays" v-if="hasHeader('numplays')">{{item.numplays}}</td>
        </tr>
      </tbody>
    </table>
    Item count: {{games.length}}
  </div>
</template>

<script>
var _ = require('lodash')

export default {
  computed: {
    orderedGames: function () {
      if (this.games.length) {
        let temp = _.orderBy(this.games, [this.sortBy, 'average'], [this.asc ? 'asc' : 'desc', 'desc'])
        if (temp.length > 0 &&
            (!_.get(temp[0], 'rank') && _.get(temp[temp.length - 1], 'rank'))) {
          while (!_.get(temp[0], 'rank')) {
            temp.push(temp.shift())
          }
        }

        this.games = temp
      }

      return this.games
    }
  },
  data () {
    return {
      asc: true,
      sortBy: 'rank'
    }
  },
  filters: {
    number: function (value) {
      if (!value) return ''
      value = parseFloat(value)
      return value.toFixed(2)
    }
  },
  methods: {
    hasHeader: function (key, checkForHide) {
      if (!checkForHide) {
        return _.find(this.headers, ['key', key])
      } else {
        let header = _.find(this.headers, ['key', key])
        return header ? !header.hide : false
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
    }
  },
  props: {
    games: { type: Array },
    headers: { type: Array }
  }
}
</script>

<style scoped>
.rank, .numplays {
  min-width: 5rem;
}

.playingtime, .weight {
  min-width: 6rem;
}

.rating {
  min-width: 7rem;
}

.average {
  min-width: 8rem;
}

.bggbestplayers {
  min-width: 9rem;
}

.rec-player, .best-player {
  max-width: 4rem;
  overflow: hidden;
  text-overflow: ellipsis;
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
  color: white;
}

.badge-medium-heavy {
  background: #a3529f;
  color: white;
}

.badge-medium {
  background: #c38bbf;
}

.badge-medium-light {
  background: #e2c5df;
}

.badge-light {
  background: #ffffff;
}
</style>
