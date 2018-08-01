<template>
  <div class="header">
    <b-container class="bv-example-row">
      <b-row align-v="center">
        <b-col v-for="item in filteredGames" :key="item.id">
          <a :href="'https://boardgamegeek.com/boardgame/' + item.id">
            <b-img width="100" rounded :src="item.imageUrl"/>
          </a>
        </b-col>
      </b-row>
    </b-container>
    Item count: {{filteredGames.length}}
  </div>
</template>

<script>
import filterItems from '~/components/filterItems.js'
import _ from 'lodash'

export default {
  computed: {
    filteredGames: function () {
      let games = filterItems(this.games, this.$store.state.filters)
      if (games.length) {
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
  props: {
    games: { type: Object }
  }
}
</script>

<style scoped>
.col {
  margin-bottom: 0.5rem;
}
</style>
