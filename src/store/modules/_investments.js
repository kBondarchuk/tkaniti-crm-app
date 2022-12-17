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
  setLoadingState(state) {
    // mutate state
    state.loading = true;
  },
  unsetLoadingState(state) {
    // mutate state
    state.loading = false;
  },
  setItems(state, items) {
    state.all = items;
  },
  setSelectedItem(state, item) {
    state.selectedItem = item;
  },
};

// actions
const actions = {
  async fetchAll(context, investor) {
    console.log("fetching investments for investor: " + investor.id);

    context.commit("setLoadingState");
    try {
      let result = await apiService.getInvestmentsForInvestor(investor.id, 1);
      context.commit("setItems", result);
    } catch (error) {
      console.log("!!!! " + error);
    }
    context.commit("unsetLoadingState");
  },
  async fetchItem(context, item_id) {
    console.log("fitching investments item: " + item_id);

    try {
      let result = await apiService.getInvestment(item_id);
      context.commit("setSelectedItem", result);
    } catch (error) {
      console.log("!!!! " + error);
    }
  },
  async newItem(context, investment) {
    console.log("creating investment: " + investment);

    try {
      let result = await apiService.createInvestment(investment);
      return result;
    } catch (error) {
      console.log("!!!! " + error);
      return Promise.reject(error);
    }
  },
  async saveItem(context, investment) {
    console.log("saving investment: " + investment);

    try {
      let result = await apiService.updateInvestment(investment);
      return result;
    } catch (error) {
      console.log("!!!! " + error);
      return Promise.reject(error);
    }
  },
  async deleteItem(context, investment_id) {
    console.log("deleting investment: " + investment_id);

    try {
      let result = await apiService.deleteInvestment(investment_id);
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
