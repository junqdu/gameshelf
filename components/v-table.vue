<template>
  <div>
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
        <tr v-for="item in filteredGames" :key="item.id">
          <td v-if="hasHeader('', true)">
            <a :href="'https://boardgamegeek.com/boardgame/' + item.id">
              <b-img width="75" :src="item.imageUrl"/>
            </a>
          </td>
          <td v-if="hasHeader('rank')">{{item.rank}}</td>
          <td v-if="hasHeader('average')">
            <span class="badge" :class="['badge-' + getRatingColor(item.average, true)]">{{item.average | number}}</span>
          </td>
          <td v-if="hasHeader('rating') && singleUser">
            <span v-if="item.users[userId].rating" class="badge" :class="['badge-' + getRatingColor(item.users[userId].rating)]">{{item.users[userId].rating}}</span>
          </td>
          <td v-if="hasHeader('rating') && !singleUser">
            <span v-if="item.rating" class="badge" :class="['badge-' + getRatingColor(item.rating)]">
              {{item.rating | number}}
            </span>
            <i class="fa fa-users" aria-hidden="true"  v-if="item.rating" v-b-popover.hover="getUserRatings(item.users)" title="Individual Ratings"></i>
          </td>
          <td class="name" v-if="hasHeader('name')">
            <a :href="'https://boardgamegeek.com/boardgame/' + item.id">{{item.name}}</a>
            <i class="fa fa-users" aria-hidden="true" v-if="!singleUser && getOwners(item.users)" v-b-popover.hover="getOwners(item.users)" title="Owners"></i>
          </td>
          <td class="date" v-if="hasHeader('date')">
            <a>{{item.date}}</a>
          </td>
          <td v-if="hasHeader('weight')">
            <span class="badge" :class="['badge-' + getWeightColor(item.weight)]">{{item.weight | number}}</span>
          </td>
          <td v-if="hasHeader('playingtime')">{{item.playingtime}} mins</td>
          <td class="best-player" v-if="hasHeader('bggbestplayers')">{{item.bggbestplayers}}</td>
          <td class="num-plays" v-if="hasHeader('numplays') && singleUser">{{item.users[userId].numplays}}</td>
          <td class="num-plays" v-if="hasHeader('numplays') && !singleUser">
            {{item.numplays}}
            <i class="fa fa-users" aria-hidden="true" v-if="item.numplays" v-b-popover.hover="getUserPlays(item.users)" title="Individual Plays"></i>
          </td>
          <td class="wishlist-priority" v-if="hasHeader('wishlistpriority')">
            {{item.wishlistpriority | priority}}
          </td>
          <td class="comment" v-if="hasHeader('comment')">
            <!-- <pre>{{item.comment}}</pre> -->
            {{item.comment}}
          </td>
          <td class="mech" v-if="hasHeader('mech')">
            <ul>
              <li v-for="item in item.mech" :key="item">{{item}}</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
    Item count: {{filteredGames.length}}
  </div>
</template>

<script>
import cookie from '~/components/cookie.js'
import filterItems from '~/components/filterItems.js'
var _ = require('lodash')

export default {
  computed: {
    filteredGames: function () {
      let games
      if (this.$route.name === 'latest-100-plays') {
        games = this.games
      } else {
        games = filterItems(this.games, this.$store.state.filters)
      }
      if (_.keys(games).length) {
        let temp = _.orderBy(games, [this.sortBy, 'average'], [this.asc ? 'asc' : 'desc', 'desc'])
        if (temp.length > 0 &&
            (!_.get(temp[0], 'rank') && _.get(temp[temp.length - 1], 'rank'))) {
          while (!_.get(temp[0], 'rank')) {
            temp.push(temp.shift())
          }
        }
        games = temp
      }
      return games
    }
  },
  created: function () {
    let users = cookie.get('username')
    users = users.split(',')
    if (users.length > 1 && users[users.length - 1]) {
      this.singleUser = false
    }
    this.userId = users[0]
    let playernames = cookie.get('playername').split(',')
    this.playerNameMap = {}
    for (let i = 0; i < playernames.length; i++) {
      this.playerNameMap[users[i]] = playernames[i]
    }
  },
  data () {
    return {
      asc: _.get(this, 'defaultAsc', true),
      singleUser: true,
      sortBy: this.defaultSort || 'rank',
      userId: undefined
    }
  },
  filters: {
    number: function (value) {
      if (!value) return ''
      value = parseFloat(value)
      return value.toFixed(2)
    },
    priority: function (value) {
      switch (value) {
        case '1':
          return 'Must have'
        case '2':
          return 'Love to have'
        case '3':
          return 'Like to have'
        case '4':
          return 'Thinking about it'
        default:
          return "Don't buy this"
      }
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
    getOwners: function (users) {
      let text = ''
      _.forEach(users, (user, userName) => {
        if (user.own) {
          if (this.playerNameMap[userName]) {
            text += `${this.playerNameMap[userName]}\n`
          } else {
            text += `${userName}\n`
          }
        }
      })
      return text
    },
    getRatingColor: function (rating, roundDown) {
      return roundDown ? _.floor(rating) : _.ceil(rating)
    },
    getUserRatings: function (users) {
      let text = ''
      _.forEach(users, (user, userName) => {
        if (user.rating) {
          if (this.playerNameMap[userName]) {
            text += `${this.playerNameMap[userName]}: ${user.rating}\n`
          } else {
            text += `${userName}: ${user.rating}\n`
          }
        }
      })
      return text
    },
    getUserPlays: function (users) {
      let text = ''
      _.forEach(users, (user, userName) => {
        if (user.numplays) {
          if (this.playerNameMap[userName]) {
            text += `${this.playerNameMap[userName]}: ${user.numplays}\n`
          } else {
            text += `${userName}: ${user.numplays}\n`
          }
        }
      })
      return text
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
    defaultAsc: {type: Boolean},
    defaultSort: {type: String},
    extFilters: { type: Object },
    games: { type: Object },
    headers: { type: Array }
  }
}
</script>

<style scoped>
.mech ul {
  font-size: small;
  margin-bottom: 0em;
  text-align: left;
}

.comment {
  text-align: left;
  max-width: 50vh;
}

.rank, .numplays {
  min-width: 5rem;
}

.playingtime, .weight, .wishlist-priority {
  min-width: 6rem;
}

.average, .rating {
  min-width: 8rem;
}

.bggbestplayers {
  /* min-width: 9rem; */
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
