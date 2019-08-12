import { Store } from 'vuex'

import fetchCollection from '~/actions/fetchCollection'
import combineCollections from '~/actions/combineCollections'
import LocalStorage from '~/components/LocalStorage'

const localStorage = new LocalStorage()

const EXPIRE_TIME = 24 * 60 * 60 * 100 // one day! -- 24 hours, 60 mins, 60 secs, 1000 ms

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
      'items/query/fetch': async ({ commit }, params) => {
        const { page, userIds, disableLS } = params
        let inError = false
        commit('items/query/fetch', page)
        const ids = userIds.split(',').slice(0, 9)
        const collections = await Promise.all(ids.map(async id => {
          const now = new Date().getTime()
          const stored = localStorage.get(`collection/${id}/${page}`)
          const storedExpiry = localStorage.get(`collectionExpiry/${id}/${page}`)
          if (stored && now <= storedExpiry) {
            return stored
          }
          try {
            const result = await fetchCollection(id, params)
            if (!disableLS) {
              localStorage.set(`collection/${id}/${page}`, result)
              localStorage.set(`collectionExpiry/${id}/${page}`, (now + EXPIRE_TIME))
            }
            return result
          } catch (e) {
            inError = true
            if (e.config) {
              const username = e.config.params.username
              commit('items/query/error', { key: page, err: `Waiting for BGG to process for user "${username}". Please try again later for access.` })
            } else {
              commit('items/query/error', e.toString())
            }
            return stored
          }
        }))
        if (collections && !inError) {
          commit('items/query/done', { key: page, val: combineCollections(collections) })
        }
      },
      'items/cache/clear': () => {
        localStorage.clear(/^collection/)
      }
    }
  })
}

export default createStore
