<template>
  <div class="header">
    <b-container class="bv-example-row">
      <b-row align-v="center">
        <b-col v-for="item in orderedGames" :key="item.id">
          <a :href="'https://boardgamegeek.com/boardgame/' + item.id">
            <b-img width="100" rounded :src="item.imageUrl"/>
          </a>
        </b-col>
      </b-row>
    </b-container>
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
  props: {
    games: { type: Array }
  }
}
</script>

<style scoped>
.col {
  margin-bottom: 0.5rem;
}
</style>
