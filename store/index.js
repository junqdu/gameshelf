import Vuex from 'vuex'

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
  return new Vuex.Store({
    state: {
      filters: {
        ...getInitialFilters()
      },
      views: {
        listView: true
      }
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
      }
    }
  })
}

export default createStore
