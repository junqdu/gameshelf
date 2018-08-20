<template>
  <section class="container">
    <div>
      <v-loader v-if="loading"></v-loader>
      <b-container v-if="!loading && !waitingForBGG" class="bv-example-row">
        <b-row>
          <b-col>
            <v-table :games="items" :headers="tableHeader" :default-asc="false" :default-sort="'date'"></v-table>
          </b-col>
        </b-row>
      </b-container>
      <v-refresh v-if="waitingForBGG"></v-refresh>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import cookie from '~/components/cookie.js'
import VRefresh from '~/components/v-refresh.vue'
import VLoader from '~/components/v-loader.vue'
import VTable from '~/components/v-table.vue'
import X2JS from 'x2js'
var _ = require('lodash')

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
    VRefresh,
    VLoader,
    VTable
  },
  created: function () {
    let userIds = this.$route.query.userId || this.userId
    userIds = userIds.split(',').slice(0, 9)
    return axios.get('https://www.boardgamegeek.com/xmlapi2/plays', {
      params: {
        username: userIds[0].trim()
      }
    })
      .then((res) => {
        this.loading = false
        if (res.status === 200) {
          var x2js = new X2JS()
          var data = x2js.xml2js(res.data)

          var items = {}
          _.forEach(data.plays.play, (play) => {
            items[play._id] = {
              comment: play.comments,
              date: play._date,
              id: play._id,
              name: play.item._name
            }
          })

          this.$data.items = items
        }
      })
      .catch(() => {
        this.loading = false
        this.waitingForBGG = true
      })
  },
  data () {
    return {
      items: {},
      loading: true,
      tableHeader: [
        {key: 'name', value: 'Name'},
        {key: 'date', value: 'Date'},
        {key: 'comment', value: 'Comment'}
      ],
      userId: cookie.get('username'),
      waitingForBGG: false
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

.table th:hover {
  cursor: default !important;
}
</style>
