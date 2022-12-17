import apiService from "@/services/api.service.js";

// initial state
const state = {
  loading: false,
  all: [],
  selectedItem: {},
};

// getters
const getters = {
  selectedItem: (state) => {
    return state.selectedItem;
  },
};

// mutations
const mutations = {
  SET_LOADING_STATE(state) {
    // mutate state
    state.loading = true;
  },
  UNSET_LOADING_STATE(state) {
    // mutate state
    state.loading = false;
  },
  SET_ITEMS(state, items) {
    state.all = items;
  },
  SET_SELECTED_ITEM(state, item) {
    state.selectedItem = item;
  },
};

// actions
const actions = {
  async fetchAll(context) {
    context.commit("SET_LOADING_STATE");
    try {
      let result = await apiService.getInvestors();
      context.commit("SET_ITEMS", result);
    } catch (error) {
      console.log("!!!! " + error);
    }
    context.commit("UNSET_LOADING_STATE");
  },

  async fetchItem(context, investor_id) {
    console.log("fitching item: " + investor_id);
    try {
      let result = await apiService.getInvestor(investor_id);
      context.commit("SET_SELECTED_ITEM", result);
    } catch (error) {
      console.log("!!!! " + error);
    }
  },

  async newItem(context, investor) {
    console.log("creating: " + investor);

    try {
      let result = await apiService.createInvestor(investor);
      return result;
    } catch (error) {
      console.log("!!!! " + error);
      return Promise.reject(error);
    }
  },

  async saveItem(context, investor) {
    console.log("saving: " + investor);

    try {
      let result = await apiService.updateInvestor(investor);
      return result;
    } catch (error) {
      console.log("!!!! " + error);
      return Promise.reject(error);
    }
  },

  async deleteItem(context, investor_id) {
    console.log("store delete: " + investor_id);

    try {
      let result = await apiService.deleteInvestor(investor_id);
      return result;
    } catch (error) {
      console.log("!!!! " + error);
      return Promise.reject(error);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
