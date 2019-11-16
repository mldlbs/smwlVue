const BASE_URL = '/api';
const state = ({
  TAG: 1
});

const mutations = {
  CHANGE_TAG(state, val) {
    state.TAG = val;
  },
};

const actions = {
};

export default {
  state,
  mutations,
  actions
};
