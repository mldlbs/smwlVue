import Vue from "vue"
import Vuex from "vuex"
import Gis from "./Gis"

Vue.use(Vuex)

const dataStore = () => {
  return new Vuex.Store({
    state: {},
    modules: {
      Gis
    }
  })
}
export default dataStore
