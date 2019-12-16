const state = () => ({
  TAG: 0,
  POPUP: {
    MAP: null,
    LAYER: null,
    SHOW: false,
    PROPS: null
  }
})

const mutations = {
  CHANGE_TAG (state, val) {
    state.TAG = val
  }
}

const actions = {}

export default {
  namespace: true,
  state,
  mutations,
  actions
}
