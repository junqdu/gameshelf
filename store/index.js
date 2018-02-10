import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      filters: {},
      views: {
        listView: true
      }
    },
    mutations: {
      'filters/reset' (state) {
        state.filters = {}
      },
      'filters/set' (state, filters) {
        state.filters = filters
      },
      'filters/setOwned' (state, filterValue) {
        state.filters.ownedgames = filterValue
      },
      'views/toggleListView' (state) {
        state.views.listView = !state.views.listView
      }
    }
  })
}

export default createStore
