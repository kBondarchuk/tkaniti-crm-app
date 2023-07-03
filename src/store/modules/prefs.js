import apiService from "@/services/api.service.js";

// initial state
const state = {};

// getters
const getters = {
  // percentTable: (state) => {
  //   return state.percentTable;
  // },
};

// mutations
const mutations = {
  // SET_PERCENT_TABLE(state, items) {
  //   state.percentTable = items;
  // },
  // SET_CALC_PREFS(state, prefs) {
  //   state.calc = prefs;
  // },
};

// actions
const actions = {
  async fetch(context) {
    // context.commit("SET_GENERAL_EXPENSES_INVESTOR", 1);
    // context.dispatch("fetchPercentTable");
    // context.dispatch("fetchCalcPrefs");
  },
  // async fetchPercentTable(context) {
  //   console.log("[PREFS]: Getting percent table...");

  //   try {
  //     let percent_table = await apiService.getLeasePercentTable();

  //     context.commit("SET_PERCENT_TABLE", percent_table);

  //     console.log("[PREFS]: Got percent table.", percent_table);
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }

  //   // let percent_table = dynamic_percents;
  //   // percent_table.sort((a, b) => (a.term > b.term ? 1 : -1));
  // },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
