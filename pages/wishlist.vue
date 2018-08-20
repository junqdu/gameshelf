<template>
  <section class="container">
    <div>
      <v-loader v-if="loading && !error"></v-loader>
      <b-container v-if="!loading && !error" class="bv-example-row">
        <b-row>
          <b-col>
            <v-filters></v-filters>
            <v-actions></v-actions>
            <v-table :default-asc="true" :games="items" :default-sort="'wishlistpriority'" :headers="tableHeader" v-if="views.listView"></v-table>
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
import VGrid from '~/components/v-grid.vue'
import VRefresh from '~/components/v-refresh.vue'
import VLoader from '~/components/v-loader.vue'
import VTable from '~/components/v-table.vue'
import VFilters from '~/components/v-filters.vue'
import VActions from '~/components/v-actions.vue'
import { mapActions, mapState } from 'vuex'
import _ from 'lodash'

export default {
  beforeCreate: function () {
    if (this.$route.query.userId) {
      cookie.set('username', this.$route.query.userId, 3650)
    } else if (this.$route.query.userid) {
      cookie.set('username', this.$route.query.userid, 3650)
    } else if (!cookie.get('username')) {
      cookie.set('username', 'Za Warudo', 3650)
    }
  },
  components: {
    VGrid,
    VLoader,
    VRefresh,
    VTable,
    VFilters,
    VActions
  },
  methods: mapActions({
    fetch: 'items/query/fetch'
  }),
  computed: mapState({
    items: state => _.pickBy(state.items['index'], ['wishlist', true]),
    loading: state => state.pageState['index'] ? !state.pageState['index'].loaded : true,
    error: state => state.pageState['index'] ? state.pageState['index'].error : null,
    errorMessage: state => state.pageState['index'] ? state.pageState['index'].errorMessage : null,
    views: state => state.views
  }),
  created: function () {
    this.$store.commit('filters/setOwned', false)
    const userIds = this.$route.query.userId || this.userId
    // if (!state.items.all) {
    this.fetch({userIds, page: 'index'})
    // }
  },
  data () {
    return {
      listView: true,
      tableHeader: [
        {key: '', value: '', hide: this.$route.query.noimage},
        {key: 'rank', value: 'Rank'},
        {key: 'average', value: 'Avg. Rating'},
        {key: 'name', value: 'Name'},
        {key: 'weight', value: 'Weight'},
        {key: 'playingtime', value: 'Length'},
        {key: 'bggbestplayers', value: 'Best #Player'},
        {key: 'wishlistpriority', value: 'Priority'}
      ],
      userId: cookie.get('username'),
      waitingForBGG: false
    }
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
</style>
