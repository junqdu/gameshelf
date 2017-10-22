<template>
  <section class="container">
    <div>
      <table class="table" v-if="orderedGames">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Rank</th>
            <th scope="col">Avg. Rating</th>
            <th scope="col">My Rating</th>
            <th scope="col">Name</th>
            <th scope="col">Min. Player</th>
            <th scope="col">Max. Player</th>
            <th scope="col">Length</th>
            <th scope="col">Best #Player</th>
            <th scope="col">Rec. #Player</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orderedGames">
            <th scope="row">
              <img :src="item.imageUrl" width="75px" />
            </th>
            <th scope="row">{{item.rank}}</th>
            <th scope="row">{{item.average | number}}</th>
            <th scope="row">{{item.rating}}</th>
            <th scope="row">{{item.name}}</th>
            <th scope="row">{{item.minPlayer}}</th>
            <th scope="row">{{item.maxPlayer}}</th>
            <th scope="row">{{item.playingtime}}</th>
            <th scope="row" class="best-player">{{item.bggbestplayers}}</th>
            <th scope="row" class="rec-player">{{item.bggrecplayers}}</th>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script>
import Game from '~/components/Game.js'
import Logo from '~/components/Logo.vue'
import axios from 'axios'
import X2JS from 'x2js'
// import _ from 'lodash'
var _ = require('lodash')

export default{
  components: {
    Logo
  },
  computed: {
    orderedGames: function () {
      return _.orderBy(this.items, 'rank')
    }
  },
  created: function () {
    // `this` points to the vm instance
    // console.log('a is: ' + this.a)
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
</style>
