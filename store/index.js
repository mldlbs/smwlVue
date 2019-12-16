import Vuex from 'vuex'
import Gis from './Gis'

const dataStore = () => {
  return new Vuex.Store({
    state: {},
    modules: {
      Gis
    }
  })
}
export default dataStore
