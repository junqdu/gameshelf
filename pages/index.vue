<template>
  <section class="container">
    <div>
      <v-loader v-if="loading && !error"></v-loader>
      <b-container v-if="!loading && !error" class="bv-example-row">
        <b-row>
          <b-col>
            <v-filters ownedgames></v-filters>
            <v-actions></v-actions>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <v-table :default-asc="true" :games="items" :headers="tableHeader" v-if="views.listView"></v-table>
            <v-grid :games="items" v-if="!views.listView"></v-grid>
          </b-col>
        </b-row>
      </b-container>
      <v-refresh v-if="error" :message="errorMessage"></v-refresh>
    </div>
  </section>
</template>

<script>
import cookie from '~/components/cookie.js'
import filterItems from '~/components/filterItems.js'
import VFilters from '~/components/v-filters.vue'
import VActions from '~/components/v-actions.vue'
import VGrid from '~/components/v-grid.vue'
import VLoader from '~/components/v-loader.vue'
import VRefresh from '~/components/v-refresh.vue'
import VTable from '~/components/v-table.vue'
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'

export default {
  beforeCreate: function () {
    if (this.$route.query.userId) {
      cookie.set('username', this.$route.query.userId)
    } else if (this.$route.query.userid) {
      cookie.set('username', this.$route.query.userid)
    } else if (!cookie.get('username')) {
      cookie.set('username', 'Za Warudo')
    }

    if (this.$route.query.showexp) {
      cookie.set('showexp', true)
    } else if (cookie.get('showexp') === '') {
      cookie.set('showexp', false)
    }
  },
  components: {
    VGrid,
    VLoader,
    VRefresh,
    VTable,
    VActions,
    VFilters
  },
  created: function () {
    this.$store.commit('filters/reset', this.$route.query)
    this.$store.commit('filters/setOwned', true)
    const userIds = this.$route.query.userId || this.userId
    this.fetch({ userIds, page: 'index' })
  },
  computed: mapState({
    items: state => _.pickBy(state.items['index'], ['own', true]),
    loading: state => state.pageState['index'] ? !state.pageState['index'].loaded : true,
    error: state => state.pageState['index'] ? state.pageState['index'].error : null,
    errorMessage: state => state.pageState['index'] ? state.pageState['index'].errorMessage : null,
    views: state => state.views
  }),
  data () {
    return {
      tableHeader: [
        {key: '', value: '', hide: this.$route.query.noimage},
        {key: 'rank', value: 'Rank'},
        {key: 'average', value: 'Avg. Rating'},
        {key: 'rating', value: 'User Rating'},
        {key: 'name', value: 'Name'},
        {key: 'weight', value: 'Weight'},
        {key: 'playingtime', value: 'Length'},
        {key: 'bggbestplayers', value: 'Best #Player'},
        {key: 'numplays', value: 'Plays'},
        {key: 'mech', value: 'Mechanisms'}
      ],
      userId: cookie.get('username')
    }
  },
  methods: {
    filteredItem: filterItems,
    ...mapActions({
      fetch: 'items/query/fetch'
    })
  }
}
</script>

<style>
.container {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.filters .col-sm-auto {
  padding-bottom: 0.25rem;
}

.popover {
  max-width: 32rem;
}
</style>
