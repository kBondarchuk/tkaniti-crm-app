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
  async fetchAll(context, investor_id) {
    console.log("fetching exs: " + investor_id);

    context.commit("setLoadingState");
    try {
      let result = await apiService.getExpensesForInvestor(investor_id);
      context.commit("setItems", result);
    } catch (error) {
      console.log("!!!! " + error);
    }
    context.commit("unsetLoadingState");
  } /*
  async fetchItem2(context, item_id) {
    console.log("fitching itemz: " + item_id);

    try {
      let result = await apiService.getExpense(investor_id);
      context.commit("setSelectedItem", result);
    } catch (error) {
      console.log("!!!! " + error);
    }

    // return axios
    //   .get(process.env.VUE_APP_API_BASE + API_PATH + item_id)
    //   .then(response => {
    //     console.log(response.statusText, response.data.data[0]);
    //     context.commit("setSelectedItem", response.data.data[0]);
    //     return response.status;
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     return "error";
    //   })
    //   .then(status => {
    //     return status;
    //   });
  },*/,
  async newItem(context, expense) {
    console.log("creating expense: " + expense);

    try {
      let result = await apiService.createExpense(expense);
      return result;
    } catch (error) {
      console.log("!!!! " + error);
      return Promise.reject(error);
    }
    // return axios
    //   .post(process.env.VUE_APP_API_BASE + API_PATH, investment)
    //   .then(response => {
    //     console.log(response.status, response.statusText);
    //     return response.statusText;
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     return Promise.reject(error);
    //   });
  },
  async saveItem(context, expense) {
    console.log("saving expense: " + expense);

    try {
      let result = await apiService.updateExpense(expense);
      return result;
    } catch (error) {
      console.log("!!!! " + error);
      return Promise.reject(error);
    }
    // return axios
    //   .put(process.env.VUE_APP_API_BASE + API_PATH + investment.id, investment)
    //   .then(response => {
    //     console.log(response.status, response.statusText);
    //     return response.statusText;
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     return Promise.reject(error);
    //   });
  },
  async deleteItem(context, expense_id) {
    console.log("deleting expense: " + expense_id);

    try {
      let result = await apiService.deleteExpense(expense_id);
      return result;
    } catch (error) {
      console.log("!!!! " + error);
      return Promise.reject(error);
    }
    // return axios
    //   .delete(process.env.VUE_APP_API_BASE + API_PATH + "/" + investment_id)
    //   .then(response => {
    //     console.log(response.status, response.statusText);
    //     return response.statusText;
    //   })
    //   .catch(error => {
    //     console.log(error);
    //     return "error";
    //   });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
