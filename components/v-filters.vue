<template>
  <b-container class="filters" fluid>
    <b-row>
      <b-col>
        <b-btn v-b-toggle.collapse1 variant="outline-primary" size="sm">Toggle Filters</b-btn>
      </b-col>
    </b-row>
    <b-collapse visible id="collapse1">
      <b-form-group
        horizontal
        :label-cols="2"
        label="Players">
        <b-row>
          <b-col sm="auto">
            <b-form-input v-model="filters.bestnum" type="number" placeholder="Best #" min="1" size="sm" />
          </b-col>
          <b-col sm="auto">
            <b-form-input v-model="filters.recnum" type="number" placeholder="Recommended #" min="1" size="sm" />
          </b-col>
          <b-col sm="auto">
            <b-form-input v-model="filters.supplayer" type="number" placeholder="Supported #" min="1" size="sm" />
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group
          horizontal
          :label-cols="2"
          label="Play Time">
        <b-row>
          <b-col sm="auto">
            <b-form-input v-model="filters.mintime" type="number" placeholder="Min Play Time" min="0" step="10" size="sm" />
          </b-col>
          <b-col sm="auto">
            <b-form-input v-model="filters.maxtime" type="number" placeholder="Max Play Time" min="0" step="10" size="sm" />
          </b-col>
        </b-row>
      </b-form-group>
      <b-form-group
          horizontal
          :label-cols="2"
          label="Weight">
        <b-row>
          <b-col sm="auto">
            <b-form-input v-model="filters.minweight" type="number" placeholder="Min Weight" min="1" step="0.1" size="sm" />
          </b-col>
            <b-col sm="auto">
              <b-form-input v-model="filters.maxweight" type="number" placeholder="Max Weight" min="1" step="0.1" size="sm" />
            </b-col>
        </b-row>
      </b-form-group>
      <b-form-group
          horizontal
          :label-cols="2"
          label="Plays">
        <b-row>
          <b-col sm="auto">
            <b-form-input v-model="filters.playlessthan" type="number" placeholder="Fewer Than" min="0" size="sm" />
          </b-col>
        </b-row>
      </b-form-group>
      <b-row>
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
              <b-tab title="Hide">
                <b-form-group>
                  <b-form-checkbox-group v-model="mechHide" name="mechanisms" :options="mechOptions">
                  </b-form-checkbox-group>
                </b-form-group>
              </b-tab>
            </b-tabs>
            <b-btn @click="onClose" size="sm" variant="primary">Close</b-btn>
          </b-popover>
        </b-col>
        <b-col sm="auto" v-if="showOwned">
          <b-button size="sm" variant="primary" @click="ownedgames = !ownedgames">
            <span v-if="ownedgames">
              <i class="fa fa-users" aria-hidden="true"></i>
              Show All Games
            </span>
            <span v-if="!ownedgames">
              <i class="fa fa-user" aria-hidden="true"></i>
              Show Only Owned Games
            </span>
          </b-button>
        </b-col>
      </b-row>
    </b-collapse>
  </b-container>
</template>

<script>

import { mapState } from 'vuex'
import cookie from '~/components/cookie.js'
import params from '~/components/params.js'
const mechKeys = require('~/assets/mechKey.json')

export default {
  data () {
    return {
      mechHide: [],
      mechShow: [],
      mechOptions: this.getMechOptions(),
      showexp: cookie.get('showexp'),
      popoverShow: false
    }
  },
  computed: {
    ...mapState({
      filters: state => state.filters
    }),
    _filters: function () {
      const filters = params.reduce((acc, val) => {
        acc[val] = this[val]
        return acc
      }, {})
      return filters
    }
  },
  watch: {
    _filters: function (filters) {
      this.filters = filters
      this.$store.commit('filters/set', filters)
    }
  },
  methods: {
    getMechOptions: function () {
      return Object.keys(mechKeys).map(key => ({
        text: mechKeys[key],
        value: mechKeys[key]
      }))
    },
    onClose () {
      this.popoverShow = false
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
    mechShow: {
      type: Array
    },
    mechHide: {
      type: Array
    },
    ownedgames: {
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
    showOwned: {
      type: Boolean
    },
    supplayer: {
      type: Number
    }
  }
}
</script>

<style>
.filters.container-fluid {
  text-align: left;
  margin-bottom: 1rem;
}
</style>
