<template>
  <b-container class="filters" fluid>
    <b-row>
      <b-col sm="auto">
        <input v-model="bestnum" type="number" placeholder="Best# of Players" min="1" />
      </b-col>
      <b-col sm="auto">
        <input v-model="recnum" type="number" placeholder="Recom# of Players" min="1" />
      </b-col>
      <b-col sm="auto"><input v-model="supplayer" type="number" placeholder="Support Players" min="1" /></b-col>
      <b-col sm="auto"><input v-model="maxtime" type="number" placeholder="Max Play Time" min="0" step="10" /></b-col>
      <b-col sm="auto"><input v-model="mintime" type="number" placeholder="Min Play Time" min="0" step="10" /></b-col>
      <b-col sm="auto"><input v-model="maxweight" type="number" placeholder="Max Weight" min="1" step="0.1" /></b-col>
      <b-col sm="auto"><input v-model="minweight" type="number" placeholder="Min Weight" min="1" step="0.1" /></b-col>
      <b-col sm="auto"><input v-model="playlessthan" type="number" placeholder="Play Less Than" min="0" /></b-col>
      <b-col sm="auto">
        <b-button size="sm" :id="'mech-filter'" variant="primary">
          <i class="fa fa-gear" aria-hidden="true"></i>
          Filter By Mechanisms
        </b-button>
        <b-popover :target="'mech-filter'"
                   :placement="'bottom'"
                   triggers="click"
                   :show.sync="popoverShow"
                   :content="`Placement ${placement}`">
          <b-tabs>
            <b-tab title="Show" active>
              <b-form-group>
                <b-form-checkbox-group v-model="mechShow" name="mechanisms" :options="mechOptions">
                </b-form-checkbox-group>
              </b-form-group>
            </b-tab>
            <b-tab title="Hide" >
              <b-form-group>
                <b-form-checkbox-group v-model="mechHide" name="mechanisms" :options="mechOptions">
                </b-form-checkbox-group>
              </b-form-group>
            </b-tab>
          </b-tabs>
          <b-btn @click="onClose" size="sm" variant="primary">Close</b-btn>
        </b-popover>
      </b-col>
      <b-col sm="auto">
        <b-button size="sm" variant="primary" v-clipboard="getShareLink()" @click="$toast.success('Link copied to clipboard', { icon : 'fa-clipboard'})">
          <i class="fa fa-share-alt" aria-hidden="true"></i>
          Share This List
        </b-button>
      </b-col>
      <b-col sm="auto">
        <b-button size="sm" variant="primary" @click="getARandomGame()">
          <i class="fa fa-random" aria-hidden="true"></i>
          Get Me A Game
        </b-button>
      </b-col>
      <b-col sm="auto">
        <b-button size="sm" variant="primary" @click="listView = !listView">
          <span v-if="listView">
            <i class="fa fa-th" aria-hidden="true"></i>
            Toggle Grid View
          </span>
          <span v-if="!listView">
            <i class="fa fa-list" aria-hidden="true"></i>
            Toggle Table View
          </span>
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

import cookie from '~/components/cookie.js'
const params = [
  'userId',
  'bestnum',
  'maxtime',
  'maxweight',
  'mintime',
  'minweight',
  'recnum',
  'supplayer',
  'playlessthan',
  'showexp'
]
export default {
  data: () => {
    return {
      showexp: cookie.get('showexp'),
      getShareLink: function () {
        let link = 'https://gameshelf.github.io?'
        const queryParams = params.map(param => (this[param] ? `${param}=${this[param]}` : null)).filter(i => !!i).join('&')
        console.log(queryParams)
        return encodeURI(`${link}${queryParams}`)
      },
      popoverShow: false
    }
  },
  computed: {
    filters: function () {
      const filters = params.reduce((acc, val) => {
        acc[val] = this[val]
        return acc
      }, {})
      return filters
    }
  },
  props: {
    filters: {
      type: Object
    },
    bestnum: {
      type: Number
    },
    maxtime: {
      type: Number
    },
    maxweight: {
      type: Number
    },
    minweight: {
      type: Number
    },
    mintime: {
      type: Number
    },
    owned: {
      type: Boolean
    },
    playlessthan: {
      type: Number
    },
    recnum: {
      type: Number
    },
    showexp: {
      default: cookie.get('showexp'),
      type: Boolean
    },
    supplayer: {
      type: Number
    }
  }
}
</script>
