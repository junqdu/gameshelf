import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      filters: {}
    },
    mutations: {
      'filters/set' (state, filters) {
        state.filters = filters
      }
    }
  })
}

export default createStore
