import { Store } from 'vuex'

import fetchCollection from '~/actions/fetchCollection'
import combineCollections from '~/actions/combineCollections'
import LocalStorage from '~/components/LocalStorage'

const localStorage = new LocalStorage()

const getInitialFilters = (routeQuery = {}) => ({
  bestnum: routeQuery.bestnum || null,
  maxweight: routeQuery.maxweight || null,
  minweight: routeQuery.minweight || null,
  mintime: routeQuery.mintime || null,
  maxtime: routeQuery.maxtime || null,
  mechShow: null,
  mechHide: null,
  ownedgames: null,
  playlessthan: routeQuery.playlessthan || null,
  recnum: routeQuery.recnum || null,
  showexp: null,
  showOwned: null,
  supplayer: routeQuery.suppplayer || null
})

const createStore = () => {
  return new Store({
    state: {
      filters: {
        ...getInitialFilters()
      },
      views: {
        listView: true
      },
      items: {},
      pageState: {}
    },
    mutations: {
      'filters/reset' (state, routeQuery) {
        state.filters = {
          ...getInitialFilters(routeQuery)
        }
      },
      'filters/set' (state, filters) {
        state.filters = filters
      },
      'filters/set/field' (state, filterField, filterValue) {
        state.filters[filterField] = filterValue
      },
      'filters/setOwned' (state, filterValue = null) {
        state.filters.ownedgames = filterValue
      },
      'views/toggleListView' (state) {
        state.views.listView = !state.views.listView
      },
      'items/query/fetch': (state, key) => {
        state.items[key] = {}
        state.pageState[key] = {
          loaded: false
        }
      },
      'items/query/done': (state, { key, val }) => {
        state.items = {
          ...state.items,
          [key]: val
        }
        state.pageState = {
          [key]: {
            ...(state.pageState[key] || {}),
            loaded: true,
            error: false
          }
        }
      },
      'items/query/error': (state, { key, err }) => {
        console.log(key, err)
        state.pageState = {
          [key]: {
            ...(state.pageState[key] || {}),
            loaded: true,
            error: true,
            errorMessage: err
          }
        }
      }
    },
    actions: {
      'items/query/fetch/index': async ({ commit }, userId) => {
        commit('items/query/fetch', 'index')
        const ids = userId.split(',').slice(0, 9)
        const collections = await Promise.all(ids.map(async id => {
          const stored = localStorage.get(`collection/${id}`)
          if (stored) {
            return stored
          }
          const result = await fetchCollection(id)
          try {
            localStorage.set(`collection/${id}`, result)
          } catch (e) {
            console.error(e)
          }
          return result
        })).catch((res) => {
          console.error(res)
          if (res.config) {
            commit('items/query/error', { key: 'index', err: `Waiting for BGG to process for user "${res.config.params.username}". Please try again later for access.` })
          } else {
            commit('items/query/error', res.message)
          }
        })
        if (collections) {
          commit('items/query/done', { key: 'index', val: combineCollections(collections) })
        }
      }
    }
  })
}

export default createStore
