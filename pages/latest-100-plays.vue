<template>
  <section class="container">
    <div>
      <div v-if="loading" class="loader"></div>
      <b-container v-if="!loading && !waitingForBGG" class="bv-example-row">
        <b-row>
          <b-col>
            <table class="table table-striped" v-if="items">
              <thead>
                <tr>
                  <th scope="col" v-for="header in tableHeader" :class="[header.key]" v-if="!header.condition">
                    <span>
                      {{header.value}}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td class="name">
                    <a :href="'https://boardgamegeek.com/boardgame/' + item.id">{{item.name}}</a>
                  </td>
                  <td class="date">
                    <a>{{item.date}}</a>
                  </td>
                </tr>
              </tbody>
            </table>
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

export default {
  beforeCreate: function () {
    if (this.$route.query.userId) {
      cookie.set('username', this.$route.query.userId, 3650)
    } else if (!cookie.get('username')) {
      cookie.set('username', 'Za Warudo', 3650)
    }
  },
  created: function () {
    return axios.get('https://www.boardgamegeek.com/xmlapi2/plays', {
      params: {
        username: this.userId
      }
    })
      .then((res) => {
        this.loading = false
        if (res.status === 200) {
          var x2js = new X2JS()
          var data = x2js.xml2js(res.data)
          this.$data.games = data

          var items = []
          data.plays.play.forEach(function (play) {
            items.push(new Game({
              date: play._date,
              id: play._id,
              name: play.item._name
            }))
          })
          this.$data.items = items
          this.$data.games = data
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
      games: {},
      items: [],
      loading: true,
      tableHeader: [
        {key: 'name', value: 'Name'},
        {key: 'date', value: 'Date'}
      ],
      userId: cookie.get('username'),
      waitingForBGG: false
    }
  },
  methods: {
    refresh: function (key) {
      location.reload()
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

.table th:hover {
  cursor: default !important;
}
</style>
<style src="./table.less" lang="less" scoped></style>
