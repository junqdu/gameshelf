<template>
  <section class="container">
    <div>
      <v-loader v-if="loading && !error" />
      <b-container
        v-if="!loading && !error"
        class="bv-example-row"
      >
        <b-row>
          <b-col>
            <v-filters show-owned />
            <v-actions :games="items" />
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <v-table
              v-if="views.listView"
              :default-asc="true"
              :games="items"
              :headers="tableHeader"
            />
            <v-grid
              v-if="!views.listView"
              :games="items"
            />
          </b-col>
        </b-row>
      </b-container>
      <v-refresh
        v-if="error"
        :message="errorMessage"
      />
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
  components: {
    VGrid,
    VLoader,
    VRefresh,
    VTable,
    VFilters,
    VActions
  },
  data () {
    return {
      filters: {},
      tableHeader: [
        { key: '', value: '', hide: this.$route.query.noimage },
        { key: 'rank', value: 'Rank' },
        { key: 'average', value: 'Avg. Rating' },
        { key: 'name', value: 'Name' },
        { key: 'weight', value: 'Weight' },
        { key: 'playingtime', value: 'Length' },
        { key: 'bggbestplayers', value: 'Best #Player' },
        { key: 'mech', value: 'Mechanisms' }
      ],
      userId: cookie.get('username')
    }
  },
  computed: mapState({
    items: state => _.pickBy(state.items['index'], ['wantToPlay', true]),
    loading: state => state.pageState['index'] ? !state.pageState['index'].loaded : true,
    error: state => state.pageState['index'] ? state.pageState['index'].error : null,
    errorMessage: state => state.pageState['index'] ? state.pageState['index'].errorMessage : null,
    views: state => state.views
  }),
  beforeCreate: function () {
    if (this.$route.query.userId) {
      cookie.set('username', this.$route.query.userId, 3650)
    } else if (this.$route.query.userid) {
      cookie.set('username', this.$route.query.userid, 3650)
    } else if (!cookie.get('username')) {
      cookie.set('username', 'Za Warudo', 3650)
    }
  },
  created: function () {
    this.$store.commit('filters/reset')
    this.$store.commit('filters/setOwned', false)
    const userIds = this.$route.query.userId || this.userId
    this.fetch({
      userIds,
      page: 'index'
    })
  },
  methods: {
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
</style>
