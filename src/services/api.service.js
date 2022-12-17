import { APIServiceCore } from "./APIServiceCore.js";

const REQUESTS = {
  LOGIN: "/login",
  CUSTOMERS: "/customers",
  ORDERS: "/orders",
  GOODS: "/goods",

  CARS: "/cars",
  INVESTORS: "/investors",
  CONTRACTS: "/contracts",
  CONTRACTS_RENT: "/contracts/rent",
  // INVESTMENTS: "/investments",
  EXPENSES: "/expenses",
  EXPENSES_TOTALS: "/expenses/totals",
  EXPENSES_CATEGORIES: "/expenses/categories",
  SALES: "/sales",
  OPERATIONS: "/operations",
  TRANSACTIONS: "/transactions",
  CALC: "/utils/calc",
  CALC_GRAPH: "/utils/calc/graph",
  CALC_GRAPH_PRINTED: "/utils/calc/graph/printed",
  REPORTS: "/reports",
  STATISTICS: "/statistics",
  ACQUIRING: "/acquiring/transactions",
  PAYGATE_GET_STATUS: "/paygate/orderstatus",
  // PAYGATE_PAY: "/paygate/pay",
  AUTH: "/auth",
  PROFILE: "/profiles",
  TEMPLATES: "/templates",
  DOWNLOAD: "/download",
  IMAGES: "/images",
  DOCUMENTS: "/documents",
  WARNINGS: "/warnings",
  DTP: "/dtp",
  COMPANIES: "/companies",
  CAR_FINES: "/fines",
  PHOTO_REPORTS: "/photo_reports",
  PROMO: "/promo",
  NOTIFICATIONS: "/notifications",
  PREFS: "/prefs",
  BRANCHES: "/branches",
  TOKEN: "/token",
  BUDGET_REQUESTS: "/budget/requests",
  ADVANCE_REQUESTS: "/advance/requests",
  REGISTRATION_REQUESTS: "/registrations/requests",
  HINTS: "/hint",
  SYSTEM: "/system",
};

class APIService extends APIServiceCore {
  //
  constructor() {
    super();
  }
  //
  async getAuthUsers() {
    let response = await this.service.get(REQUESTS.AUTH + "/users");
    return response.data.data;
  }

  async getAuthUser(id) {
    let response = await this.service.get(REQUESTS.AUTH + "/users" + "/" + id);
    return response.data.data;
  }

  async createAuthUser(user) {
    let response = await this.service.post(REQUESTS.AUTH + "/users", user);
    return response.data.data;
  }

  async updateAuthUser(user) {
    let response = await this.service.put(REQUESTS.AUTH + "/users" + "/" + user.id, user);
    return response.data.data;
  }

  // User Profile
  async getUserProfile(id) {
    let response = await this.service.get(REQUESTS.PROFILE + "/" + id);
    return response.data.data;
  }

  async updateUserProfile(user) {
    let response = await this.service.put(REQUESTS.PROFILE + "/" + user.id, user);
    return response.data.data;
  }

  /**
   * PING
   */

  async ping() {
    let response = await this.service.get("/ping");
    return response.data;
  }

  /**
   * Images
   */

  async uploadImage(file, album_uuid, description) {
    // Validate
    if (!album_uuid) {
      console.log("[uploadImage]: album_uuid: ", album_uuid);
      return Promise.reject("[APIService]: album_uuid == null");
    }

    // create form data
    let formData = new FormData();
    formData.append("image", file);
    formData.append("album_uuid", album_uuid);
    formData.append("description", description);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      // onUploadProgress: (event) => {
      //   console.log(event.loaded, event.total);
      // },
    };

    let response = await this.service.post(REQUESTS.IMAGES, formData, config);
    return response.data.data;
  }

  async getImages(album_uuid) {
    let response = await this.service.get(REQUESTS.IMAGES, { params: { album_uuid: album_uuid } });
    return response.data.data;
  }

  // Image Delete
  async deleteImage(id) {
    let response = await this.service.delete(REQUESTS.IMAGES + "/" + id);
    return response.data.data;
  }

  async getDownloadToken() {
    let response = await this.service.get(REQUESTS.DOWNLOAD + "/token");
    return response.data.data;
  }

  /**
   * Documents
   */

  async getDocuments(folder_uuid) {
    let response = await this.service.get(REQUESTS.DOCUMENTS, { params: { folder_uuid: folder_uuid } });
    return response.data.data;
  }

  async uploadDocument(file, document_type_id, folder_uuid, description) {
    // create form data
    let formData = new FormData();
    formData.append("file", file);
    formData.append("document_type_id", document_type_id);
    formData.append("folder_uuid", folder_uuid);
    formData.append("description", description);

    let response = await this.service.post(REQUESTS.DOCUMENTS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  }

  async updateDocument(document) {
    let response = await this.service.put(REQUESTS.DOCUMENTS + "/" + document.id, document);
    return response.data.data;
  }

  // Image Delete
  async deleteDocument(id) {
    let response = await this.service.delete(REQUESTS.DOCUMENTS + "/" + id);
    return response.data.data;
  }

  async getDocumentsTypes() {
    let response = await this.service.get(REQUESTS.DOCUMENTS + "/types");
    return response.data.data;
  }

  /**
   * Templates
   */

  async uploadTemplateFile(template_name, file) {
    // create form data
    let formData = new FormData();
    formData.append(template_name, file);
    console.log(template_name);

    let response = await this.service.post(REQUESTS.TEMPLATES + "/" + template_name, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  }

  async getTemplate(name) {
    let response = await this.service.get(REQUESTS.TEMPLATES + "/" + name);
    return response.data.data;
  }

  /**
   * Investors
   */

  async getInvestors(filter = null) {
    filter = filter || { sort_by: "id", sort_order: "asc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get(REQUESTS.INVESTORS, { params: params });
    return response.data.data;
  }

  async getInvestor(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id);
    return response.data.data;
  }

  async getInvestorAccounts(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/accounts");
    return response.data.data;
  }

  async getInvestorAccountsInvestments(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/accounts/investments");
    return response.data.data;
  }

  async getInvestorBillingPlans(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/billing_plans");
    return response.data.data;
  }

  async getInvestorActiveBillingPlan(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/billing_plans/active");
    return response.data.data;
  }

  async getInvestorsLeasingContractsTotals(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/contracts_totals");
    return response.data.data;
  }

  async getInvestorsRentContractsTotals(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/rent_contracts_totals");
    return response.data.data;
  }

  async getInvestorSalesTotals(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/sales_totals");
    return response.data.data;
  }

  async getInvestorsTotals() {
    let response = await this.service.get(REQUESTS.INVESTORS + "/totals");
    return response.data.data;
  }

  async getInvestorsStatsHistoryInvestment(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/stat/history/investment");
    return response.data.data;
  }

  async getInvestorsInterestStats(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/stats/interest");
    return response.data.data;
  }

  async getInvestorsInterestHistory(investor_id) {
    let response = await this.service.get(REQUESTS.INVESTORS + "/" + investor_id + "/stats/interest/history");
    return response.data.data;
  }

  async createInvestor(investor) {
    let response = await this.service.post(REQUESTS.INVESTORS, investor);
    return response.data.data;
  }

  async updateInvestor(investor) {
    let response = await this.service.put(REQUESTS.INVESTORS + "/" + investor.id, investor);
    return response.data.data;
  }

  async deleteInvestor(investor_id) {
    let response = await this.service.delete(REQUESTS.INVESTORS + "/" + investor_id);
    return response.data.data;
  }

  async createInvestorBillingPlan(investor_id, plan) {
    let response = await this.service.post(REQUESTS.INVESTORS + "/" + investor_id + "/billing_plans", plan);
    return response.data.data;
  }

  /**
   * Withdraw amount from investors deposit
   * @param {number} investor_id
   * @param {string} date Date
   * @param {string} amount Amount to withdraw
   * @param {string} notes Notes
   */
  async investorWithdraw(investor_id, date, amount, notes) {
    const params = {
      date: date,
      amount: amount,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.INVESTORS + "/" + investor_id + "/withdraw", params);
    return response.data.data;
  }

  /**
   * Withdraw amount of interest from investors deposit
   */
  async investorWithdrawInterest(investor_id, payload) {
    const params = {
      amount: payload.amount,
      notes: payload.notes,
    };
    let response = await this.service.post(REQUESTS.INVESTORS + "/" + investor_id + "/withdraw_interest", params);
    return response.data.data;
  }

  async investorWithdrawInterestPlanned(investor_id, payload) {
    const params = {
      notes: payload.notes,
    };
    let response = await this.service.post(
      REQUESTS.INVESTORS + "/" + investor_id + "/withdraw_interest_planned",
      params
    );
    return response.data.data;
  }

  async investorReinvestInterest(investor_id, payload) {
    const params = {
      amount: payload.amount,
      notes: payload.notes,
    };
    let response = await this.service.post(REQUESTS.INVESTORS + "/" + investor_id + "/reinvest_interest", params);
    return response.data.data;
  }

  async investorSetReinvestPercent(investor_id, reinvest_percent) {
    const params = {
      reinvest_percent,
    };
    let response = await this.service.put(
      REQUESTS.INVESTORS + "/" + investor_id + "/billing_plans/active/reinvest_percent",
      params
    );
    return response.data.data;
  }

  /**
   * Deposit amount for investor
   * @param {number} investor_id
   * @param {string} date Date
   * @param {string} amount Amount to withdraw
   * @param {string} notes Notes
   */
  async investorDeposit(investor_id, date, amount, notes) {
    const params = {
      date: date,
      amount: amount,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.INVESTORS + "/" + investor_id + "/deposit", params);
    return response.data.data;
  }

  /**
   * Rent Contracts
   */

  async getRentContracts(status_arr, filter = null, searchString = null) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      brief: 1,
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      search: searchString,
    };

    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    if (filter.investor_id != null) {
      delete params.brief;
      params.investor_id = filter.investor_id;
    }

    if (filter.totals != null) {
      params.totals = filter.totals;
    }

    let response = await this.service.get(REQUESTS.CONTRACTS_RENT, {
      params: params,
    });
    return response.data.data;
  }

  async getRentContractsForCar(car_id, status_arr) {
    const params = {
      car_id: car_id,
    };

    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    let response = await this.service.get(REQUESTS.CONTRACTS_RENT, { params: params });
    return response.data.data;
  }

  async getRentContract(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS_RENT + "/" + contract_id);
    return response.data.data;
  }

  async getRentContractLastNumber() {
    let response = await this.service.get(REQUESTS.CONTRACTS_RENT + "/last");
    return response.data.data;
  }

  async getRentContractsCount() {
    let response = await this.service.get(REQUESTS.CONTRACTS_RENT + "/count");
    return response.data.data;
  }

  // contract_number, :contract_date, :date_opened, :contract_days, :contract_daily_payment, :contract_pledge, :customer_id, :car_id, :notes, :use_accum
  async createRentContract(
    contract_number,
    contract_date,
    date_opened,
    contract_days,
    contract_daily_payment,
    contract_pledge,
    customer_id,
    car_id,
    notes,
    use_accum
  ) {
    // contract_number, contract_date, date_opened,  car_price, down_payment, daily_percentage, contract_days,  investor_id, customer_id, car_id, notes
    const params = {
      contract_number,
      contract_date,
      date_opened,
      contract_days,
      contract_daily_payment,
      contract_pledge,
      customer_id,
      car_id,
      notes,
      use_accum: use_accum ? 1 : 0,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS_RENT, params);
    return response.data.data;
  }

  async getRentContractsHistory(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS_RENT + "/" + contract_id + "/history");
    return response.data.data;
  }

  async createRentDeposit(contract_id, amount, notes) {
    const params = {
      amount: amount,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS_RENT + "/" + contract_id + "/deposit", params);
    return response.data.data;
  }

  async rentContractFinish(contract_id, amount) {
    const params = {
      refund_amount: amount,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS_RENT + "/" + contract_id + "/finish", params);
    return response.data.data;
  }

  async rentContractRefundPledge(contract_id, amount) {
    const params = {
      amount: amount,
      notes: "",
    };
    let response = await this.service.post(REQUESTS.CONTRACTS_RENT + "/" + contract_id + "/refund_pledge", params);
    return response.data.data;
  }

  /**
   * getPrintedDocument
   * @param {number} contract_id
   * @param {string} document_type
   * @returns {object}
   */
  async getRentPrintedDocument(contract_id, document_type) {
    let response = await this.service.get(REQUESTS.CONTRACTS_RENT + "/" + contract_id + "/printed/" + document_type);
    return response.data.data;
  }

  // PUT
  async setRentContractOptions(contract_id, options = {}) {
    const params = {
      // online_pay: options.online_pay,
    };

    if (options.online_pay != null) {
      params["online_pay"] = options.online_pay ? 1 : 0;
    }

    if (options.car_fines_pay != null) {
      params["car_fines_pay"] = options.car_fines_pay ? 1 : 0;
    }

    console.log(params);

    let response = await this.service.put(REQUESTS.CONTRACTS_RENT + "/" + contract_id + "/options", params);
    return response.data.data;
  }

  /**
   * Contracts
   */

  async getContracts(status_arr, filter = null, searchString = null) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      brief: 1,
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      search: searchString,
    };

    // Statuses
    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    // Investors
    if (filter.investors != null) {
      params["investors"] = filter.investors.join(",");
    }

    // Branches
    if (filter.branches != null) {
      params["branches"] = filter.branches.join(",");
    }

    // if (filter.investor_id != null) {
    //   delete params.brief;
    //   params.investor_id = filter.investor_id;
    // }

    if (filter.totals != null) {
      params.totals = filter.totals;
    }

    let response = await this.service.get(REQUESTS.CONTRACTS, {
      params: params,
    });
    return response.data.data;
  }

  async getContract(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id);
    return response.data.data;
  }

  async getContractLastNumber() {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/last");
    return response.data.data;
  }

  async getContractsCount({ investors, branches } = {}) {
    // console.log("### ", investors, investors.length);

    let params = {
      investors: investors && investors.length ? investors.join(",") : null,
      branches: branches && branches.length ? branches.join(",") : null,
    };

    let response = await this.service.get(REQUESTS.CONTRACTS + "/count", { params });
    return response.data.data;
  }

  async createContract(
    contract_number,
    contract_date,
    date_opened,
    car_price,
    down_payment,
    daily_percentage,
    contract_days,
    investor_id,
    customer_id,
    car_id,
    notes,
    use_accum,
    company_id
  ) {
    // contract_number, contract_date, date_opened,  car_price, down_payment, daily_percentage, contract_days,  investor_id, customer_id, car_id, notes
    const params = {
      contract_number: contract_number,
      contract_date: contract_date,
      date_opened: date_opened,
      car_price: car_price,
      down_payment: down_payment,
      daily_percentage: daily_percentage,
      contract_days: contract_days,
      investor_id: investor_id,
      customer_id: customer_id,
      car_id: car_id,
      company_id: company_id,
      notes: notes,
      use_accum: use_accum ? 1 : 0,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS, params);
    return response.data.data;
  }

  // async getContractsForInvestor(investor_id) {
  //   let response = await this.service.get(REQUESTS.CONTRACTS, {
  //     params: {
  //       investor_id: investor_id,
  //     },
  //   });
  //   return response.data.data;
  // }

  async getContractsForCustomer(customer_id, status_arr) {
    const params = {
      customer_id: customer_id,
    };

    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    let response = await this.service.get(REQUESTS.CONTRACTS, { params: params });
    return response.data.data;
  }

  async getContractsForCar(car_id, status_arr) {
    const params = {
      car_id: car_id,
    };

    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    let response = await this.service.get(REQUESTS.CONTRACTS, { params: params });
    return response.data.data;
  }

  async getContractsSchedule(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/schedule");
    return response.data.data;
  }

  async getContractsHistory(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/history");
    return response.data.data;
  }

  async getContractsPayplan(contract_id, date1, date2) {
    const params = {
      date1: date1,
      date2: date2,
    };
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/payplan", { params: params });
    return response.data.data;
  }

  async getContractsAccountsGraph(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/accounts_graph");
    return response.data.data;
  }

  async getContractsDepositsGraph(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/deposits_graph");
    return response.data.data;
  }

  async createDeposit(contract_id, amount, notes) {
    const params = {
      amount: amount,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS + "/" + contract_id + "/deposit", params);
    return response.data.data;
  }

  async contractPayForward(contract_id, amount, type, notes) {
    const params = {
      amount: amount,
      type: type,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS + "/" + contract_id + "/payforward", params);
    return response.data.data;
  }

  async contractRestruct(contract_id, amount, contract_days, daily_percentage, notes) {
    const params = {
      amount: amount,
      daily_percentage: daily_percentage,
      contract_days: contract_days,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS + "/" + contract_id + "/restruct", params);
    return response.data.data;
  }

  async contractAbort(contract_id, amount_to_hold, amount_to_payout) {
    const params = {
      hold_amount: amount_to_hold,
      payout_amount: amount_to_payout,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS + "/" + contract_id + "/abort", params);
    return response.data.data;
  }

  async contractSuperAbort(
    contract_id,
    debt_refund,
    interest_refund,
    penalty_refund,
    car_fines_refund,
    closing_status
  ) {
    const params = {
      debt_refund,
      interest_refund,
      penalty_refund,
      car_fines_refund,
      closing_status,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS + "/" + contract_id + "/abort2", params);
    return response.data.data;
  }

  async contractDelete(contract_id) {
    let response = await this.service.post(REQUESTS.CONTRACTS + "/" + contract_id + "/delete");
    return response.data.data;
  }

  async contractFinish(contract_id) {
    let response = await this.service.post(REQUESTS.CONTRACTS + "/" + contract_id + "/finish");
    return response.data.data;
  }

  async setContractPenaltyOff(contract_id, date1, date2, notes) {
    const params = {
      date1: date1 == "" ? null : date1,
      date2: date2 == "" ? null : date2,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS + "/" + contract_id + "/penalty", params);
    return response.data.data;
  }

  // Percent table

  async getLeasePercentTable() {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/percent_table");
    return response.data.data;
  }

  async createLeasePercentTableItem(item) {
    const params = {
      term: item.term,
      percent: item.percent,
    };
    let response = await this.service.post(REQUESTS.CONTRACTS + "/percent_table", params);
    return response.data.data;
  }

  async updateLeasePercentTableItem(item) {
    const params = {
      term: item.term,
      percent: item.percent,
    };
    let response = await this.service.put(REQUESTS.CONTRACTS + "/percent_table/" + item.id, params);
    return response.data.data;
  }

  async deleteLeasePercentTableItem(item_id) {
    let response = await this.service.delete(REQUESTS.CONTRACTS + "/percent_table/" + item_id);
    return response.data.data;
  }

  // Download documents
  /**
   * getPrintedDocument
   * @param {number} contract_id
   * @param {string} document_type
   * @returns {object}
   */
  async getPrintedDocument(contract_id, document_type) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/printed/" + document_type);
    return response.data.data;
  }

  async getPrintedContract(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/printed");
    return response.data.data;
  }

  async getPrintedAgreement(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/printed/agreement");
    return response.data.data;
  }

  async getPrintedContractGraph(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/printed/graph");
    return response.data.data;
  }

  async getPrintedContractSchedule(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/printed/schedule");
    return response.data.data;
  }

  async getPrintedContractResume(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/printed/resume");
    return response.data.data;
  }

  // PUT
  async setContractOptions(contract_id, options = {}) {
    const params = {
      // online_pay: options.online_pay,
    };

    if (options.online_pay != null) {
      params["online_pay"] = options.online_pay ? 1 : 0;
    }

    if (options.car_fines_pay != null) {
      params["car_fines_pay"] = options.car_fines_pay ? 1 : 0;
    }

    console.log(params);

    let response = await this.service.put(REQUESTS.CONTRACTS + "/" + contract_id + "/options", params);
    return response.data.data;
  }

  /**
   * Operations
   */

  async getOperationsFor(type, sub_type = "", id, filter) {
    // console.log(">>>", type, id);

    let _arg = id || id === 0 ? "/" + id : "";
    const _sub_type = sub_type ? "/" + sub_type : "";

    let response = await this.service.get(REQUESTS.OPERATIONS + `/${type}` + _arg + _sub_type, {
      params: {
        // sort_by: filter.sort_by,
        // sort_order: filter.sort_order,
        page: filter.page,
        per_page: filter.per_page,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getOperationsAll(filter) {
    let response = await this.service.get(REQUESTS.OPERATIONS, {
      params: {
        sort_by: filter.sort_by,
        sort_order: filter.sort_order,
        page: filter.page,
        per_page: filter.per_page,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  /**
   * Transactions
   */

  async getTransactionsForContract(contract_id, pagination) {
    let response = await this.service.get(REQUESTS.TRANSACTIONS, {
      params: {
        contract_id: contract_id,
        page: pagination.page,
        per_page: pagination.per_page,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getTransactionsForRentContract(contract_id, pagination) {
    let response = await this.service.get(REQUESTS.TRANSACTIONS, {
      params: {
        contract_id: contract_id,
        contract_type: "rent",
        page: pagination.page,
        per_page: pagination.per_page,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getTransactionsForCar(car_id, pagination) {
    let response = await this.service.get(REQUESTS.TRANSACTIONS, {
      params: {
        car_id: car_id,
        page: pagination.page,
        per_page: pagination.per_page,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getTransactionsForCustomer(customer_id, pagination) {
    let response = await this.service.get(REQUESTS.TRANSACTIONS, {
      params: {
        customer_id: customer_id,
        page: pagination.page,
        per_page: pagination.per_page,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  /**
   * Accounts
   */

  async getAccountsForContract(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS + "/" + contract_id + "/accounts", {
      params: {
        contract_id: contract_id,
      },
    });
    return response.data.data;
  }

  async getAccountsForRentContract(contract_id) {
    let response = await this.service.get(REQUESTS.CONTRACTS_RENT + "/" + contract_id + "/accounts", {
      params: {
        contract_id: contract_id,
      },
    });
    return response.data.data;
  }

  /**
   * Reports
   */

  async getReport(report_name, date1, date2, investors, branches) {
    let response = await this.service.get(REQUESTS.REPORTS + "/" + report_name, {
      params: {
        date1: date1,
        date2: date2,
        investors: investors,
        branches: branches,
      },
    });
    return response.data.data;
  }

  /**
   * Statistics
   */

  async getStatistics(investors) {
    let response = await this.service.get(REQUESTS.STATISTICS, {
      params: {
        investors: investors,
      },
    });
    return response.data.data;
  }

  /**
   * Advance requests
   */

  async getAdvanceRequests(status, filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.ADVANCE_REQUESTS, {
      params: {
        status,
        ...filter,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getAdvanceRequest(id) {
    let response = await this.service.get(REQUESTS.ADVANCE_REQUESTS + "/" + id);
    return response.data.data;
  }

  async createAdvanceRequest({ amount, recipient_user_id, title, notes, type_id, reported_id }) {
    const params = {
      amount,
      recipient_user_id,
      title,
      notes,
      type_id,
      reported_id,
    };

    // console.log(JSON.stringify(params));

    let response = await this.service.post(REQUESTS.ADVANCE_REQUESTS, params);
    return response.data.data;
  }

  async updateAdvanceRequest(request) {
    let response = await this.service.put(REQUESTS.ADVANCE_REQUESTS + "/" + request.id, request);
    return response.data.data;
  }

  async deleteAdvanceRequest(request_id) {
    let response = await this.service.delete(REQUESTS.ADVANCE_REQUESTS + "/" + request_id);
    return response.data.data;
  }

  async getAdvanceRequestsCount(type_id) {
    const filter = { type_id };
    let response = await this.service.get(REQUESTS.ADVANCE_REQUESTS + "/count", {
      params: {
        ...filter,
      },
    });
    return response.data.data;
  }

  async getAdvanceRequestStages(request_id, filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.ADVANCE_REQUESTS + "/" + request_id + "/stages", {
      params: {
        ...filter,
      },
    });
    return response.data.data;
  }

  async stageAdvanceRequest(request_id, status, notes) {
    const params = {
      notes,
    };

    let response = await this.service.post(REQUESTS.ADVANCE_REQUESTS + "/" + request_id + "/stages/" + status, params);
    return response.data.data;
  }

  async applyAdvanceRequest(request_id) {
    let response = await this.service.post(REQUESTS.ADVANCE_REQUESTS + "/" + request_id + "/apply");
    return response.data.data;
  }

  /**
   * Budget requests
   */

  async getBudgetRequests(status, filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.BUDGET_REQUESTS, {
      params: {
        status,
        ...filter,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getBudgetRequestsItems(status, filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.BUDGET_REQUESTS + "/items", {
      params: {
        status,
        ...filter,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getBudgetRequest(id) {
    let response = await this.service.get(REQUESTS.BUDGET_REQUESTS + "/" + id);
    return response.data.data;
  }

  async createBudgetRequest({
    request_type,
    expense_dt,
    expense_type_id,
    expense_car_id,
    expense_branch_id,
    investor_id,
    notes,
    items,
  }) {
    const params = {
      request_type,
      expense_type_id,
      expense_car_id,
      expense_dt,
      expense_branch_id,
      investor_id,
      notes,
      items,
    };

    console.log(JSON.stringify(params));

    let response = await this.service.post(REQUESTS.BUDGET_REQUESTS, params);
    return response.data.data;
  }

  async createBudgetRequest2({ request_type, notes, recipient_user_id, items }) {
    const params = {
      request_type,
      notes,
      recipient_user_id,
      items,
    };

    console.log(JSON.stringify(params));

    let response = await this.service.post(REQUESTS.BUDGET_REQUESTS + "2", params);
    return response.data.data;
  }

  async updateBudgetRequest(expense) {
    let response = await this.service.put(REQUESTS.BUDGET_REQUESTS + "/" + expense.id, expense);
    return response.data.data;
  }

  async updateBudgetRequest2(expense) {
    let response = await this.service.put(REQUESTS.BUDGET_REQUESTS + "2" + "/" + expense.id, expense);
    return response.data.data;
  }

  async deleteBudgetRequest(expense_id) {
    let response = await this.service.delete(REQUESTS.BUDGET_REQUESTS + "/" + expense_id);
    return response.data.data;
  }

  async getBudgetRequestsCount(request_type) {
    const filter = { request_type };
    let response = await this.service.get(REQUESTS.BUDGET_REQUESTS + "/count", {
      params: {
        ...filter,
      },
    });
    return response.data.data;
  }

  async stageBudgetRequest(request_id, status, notes) {
    const params = {
      notes,
    };

    let response = await this.service.post(REQUESTS.BUDGET_REQUESTS + "/" + request_id + "/stages/" + status, params);
    return response.data.data;
  }

  async applyBudgetRequest(request_id) {
    let response = await this.service.post(REQUESTS.BUDGET_REQUESTS + "/" + request_id + "/apply");
    return response.data.data;
  }

  async getBudgetRequestStages(request_id, filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.BUDGET_REQUESTS + "/" + request_id + "/stages", {
      params: {
        ...filter,
      },
    });
    return response.data.data;
  }

  /**
   * Expense categories
   */

  async createCategory({ name, expense_type_id, parent_id, selectable }) {
    const params = {
      name,
      expense_type_id,
      parent_id,
      selectable: selectable ? 1 : 0,
    };
    let response = await this.service.post(REQUESTS.EXPENSES_CATEGORIES, params);
    return response.data.data;
  }

  async updateCategory({ id, name, expense_type_id, parent_id, selectable }) {
    const params = {
      id,
      name,
      expense_type_id,
      parent_id,
      selectable: selectable ? 1 : 0,
    };
    let response = await this.service.put(REQUESTS.EXPENSES_CATEGORIES + "/" + params.id, params);
    return response.data.data;
  }

  async deleteCategory(category_id) {
    let response = await this.service.delete(REQUESTS.EXPENSES_CATEGORIES + "/" + category_id);
    return response.data.data;
  }

  /**
   * Expenses
   */

  async getExpensesForInvestor(investor_id, filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.EXPENSES, {
      params: {
        ...filter,
        investor_id: investor_id,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getExpensesForCar(car_id, filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.EXPENSES, {
      params: {
        ...filter,
        car_id: car_id,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getExpensesGeneral(filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.EXPENSES, {
      params: {
        ...filter,
        general: "true",
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getExpensesCategories(filterType) {
    let response = await this.service.get(REQUESTS.EXPENSES_CATEGORIES, { params: { type: filterType } });
    return response.data.data;
  }

  async getExpense(item_id) {
    let response = await this.service.get(REQUESTS.EXPENSES + "/" + item_id);
    return response.data.data;
  }

  async createExpense(car_id, investor_id, category_id, branch_id, date, amount, notes) {
    //   {
    //     "car_id": null,
    //     "investor_id": 1,
    //     "category_id": 3,
    //     "date": "2019-05-12",
    //     "amount": "2555.50",
    //     "notes": "1"
    // }
    const params = {
      car_id: car_id,
      investor_id: investor_id,
      category_id: category_id,
      branch_id: branch_id,
      date: date,
      amount: amount,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.EXPENSES, params);
    return response.data.data;
  }

  async updateExpense(expense) {
    let response = await this.service.put(REQUESTS.EXPENSES + "/" + expense.id, expense);
    return response.data.data;
  }

  async deleteExpense(expense_id) {
    let response = await this.service.delete(REQUESTS.EXPENSES + "/" + expense_id);
    return response.data.data;
  }

  /**
   * Expenses Totals
   */

  async getExpensesTotalsForInvestor(investor_id, groupBranches) {
    let response = await this.service.get(REQUESTS.EXPENSES_TOTALS, {
      params: {
        investor_id: investor_id,
        group_branches: groupBranches ? "true" : "false",
      },
    });
    return response.data.data;
  }

  async getExpensesTotalsForCar(car_id, groupBranches) {
    let response = await this.service.get(REQUESTS.EXPENSES_TOTALS, {
      params: {
        car_id: car_id,
        group_branches: groupBranches ? "true" : "false",
      },
    });
    return response.data.data;
  }

  async getExpensesTotalsGeneral(groupBranches) {
    let response = await this.service.get(REQUESTS.EXPENSES_TOTALS, {
      params: {
        general: "true",
        group_branches: groupBranches ? "true" : "false",
      },
    });
    return response.data.data;
  }

  /**
   * Sales / Income
   */

  async getSales({ car_id }, filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.SALES, {
      params: {
        ...filter,
        car_id: car_id,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getSalesTotals() {
    let response = await this.service.get(REQUESTS.SALES + "/totals");
    return response.data.data;
  }

  /**
   * Registration requests
   */

  async getRegistrationRequests(status, filter) {
    filter = filter || { sort_by: "created_dt", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.REGISTRATION_REQUESTS, {
      params: {
        status,
        ...filter,
      },
    });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getRegistrationRequest(id) {
    let response = await this.service.get(REQUESTS.REGISTRATION_REQUESTS + "/" + id);
    return response.data.data;
  }

  async updateRegistrationRequest(request) {
    let response = await this.service.put(REQUESTS.REGISTRATION_REQUESTS + "/" + request.id, request);
    return response.data.data;
  }

  async deleteRegistrationRequest(request_id) {
    let response = await this.service.delete(REQUESTS.REGISTRATION_REQUESTS + "/" + request_id);
    return response.data.data;
  }

  async getRegistrationRequestsCount() {
    let response = await this.service.get(REQUESTS.REGISTRATION_REQUESTS + "/count");
    return response.data.data;
  }

  async stageRegistrationRequest(request_id, status, notes) {
    const params = {
      notes,
    };

    let response = await this.service.post(
      REQUESTS.REGISTRATION_REQUESTS + "/" + request_id + "/stages/" + status,
      params
    );
    return response.data.data;
  }

  async applyRegistrationRequest(request_id) {
    let response = await this.service.post(REQUESTS.REGISTRATION_REQUESTS + "/" + request_id + "/apply");
    return response.data.data;
  }

  async getRegistrationRequestStages(request_id, filter) {
    filter = filter || { sort_by: "date", sort_order: "desc" };

    let response = await this.service.get(REQUESTS.REGISTRATION_REQUESTS + "/" + request_id + "/stages", {
      params: {
        ...filter,
      },
    });
    return response.data.data;
  }
  /**
   * Investments
   */
  /*
  async getInvestmentsForInvestor(investor_id, no_reinvestments) {
    let response = await this.service.get(REQUESTS.INVESTMENTS, {
      params: {
        investor_id: investor_id,
        no_reinvestments: no_reinvestments,
      },
    });
    return response.data.data;
  }

  async getInvestment(item_id) {
    let response = await this.service.get(REQUESTS.INVESTMENTS + "/" + item_id);
    return response.data.data[0];
  }

  async createInvestment(investment) {
    let response = await this.service.post(REQUESTS.INVESTMENTS, investment);
    return response.data.data;
  }

  async updateInvestment(investment) {
    let response = await this.service.put(REQUESTS.INVESTMENTS + "/" + investment.id, investment);
    return response.data.data;
  }

  async deleteInvestment(investment_id) {
    let response = await this.service.delete(REQUESTS.INVESTMENTS + "/" + investment_id);
    return response.data.data;
  }
  */

  /**
   * Customers
   */

  parseCustomer(customer) {
    const params = {
      first_name: customer.first_name,
      second_name: customer.second_name,
      last_name: customer.last_name,
      notes: customer.notes,
      phone: customer.phone,
      email: customer.email,
      address_fact: customer.address_fact,
      date_of_birth: customer.date_of_birth, // Date
      gender: parseInt(customer.gender), // Int,
    };
    return params;
  }

  async getCustomers(filter, branchId = null, searchString = null) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      search: searchString,
      branch_id: branchId,
    };

    let response = await this.service.get(REQUESTS.CUSTOMERS, { params: params });

    return response.data.data;
  }

  async getCustomer(id) {
    let response = await this.service.get(REQUESTS.CUSTOMERS + "/" + id);
    return response.data.data;
  }

  async createCustomer(customer) {
    let response = await this.service.post(REQUESTS.CUSTOMERS, this.parseCustomer(customer));
    return response.data.data;
  }

  async updateCustomer(customer) {
    let response = await this.service.put(REQUESTS.CUSTOMERS + "/" + customer.id, this.parseCustomer(customer));
    return response.data.data;
  }

  async deleteCustomer(id) {
    let response = await this.service.delete(REQUESTS.CUSTOMERS + "/" + id);
    return response.data.data;
  }

  async getCustomerHistory(id) {
    let response = await this.service.get(REQUESTS.CUSTOMERS + "/" + id + "/history");
    return response.data.data;
  }

  // Actions
  async customerAddBonus(customer_id, amount, notes) {
    const params = {
      amount: amount,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.CUSTOMERS + "/" + customer_id + "/bonus", params);
    return response.data.data;
  }

  async customerSetPassword(customer_id, password) {
    const params = {
      password: password,
    };
    let response = await this.service.put(REQUESTS.CUSTOMERS + "/" + customer_id + "/password", params);
    return response.data.data;
  }

  async getCustomerLKInfo(id) {
    let response = await this.service.get(REQUESTS.CUSTOMERS + "/" + id + "/lk");
    return response.data.data;
  }

  /**
   * Orders
   */

  parseOrder(order) {
    const params = {
      id: order.id,
      date: order.date,
      customer_id: parseInt(order.customer_id),
      customer_fio: order.customer_fio,
      customer_phone: order.customer_phone,
      delivery_address: order.delivery_address,
      delivery_method_id: order.delivery_method_id,
      delivery_method_other: order.delivery_method_other,
      notes: order.notes,
      payment_method_id: parseInt(order.payment_method_id),
      basket: order.basket.map((item) => {
        return {
          id: item.id,
          good_id: item.good_id,
          good_quantity: item.good_quantity,
          good_price: item.good_price,
        };
      }),
    };

    // console.warn("[parseOrder]: ", params.basket);
    return params;
  }

  async getOrders(filter, status_arr, searchString = null) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      search: searchString,
    };

    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    if (filter.good_id != null) {
      params["good_id"] = filter.good_id;
    }

    let response = await this.service.get(REQUESTS.ORDERS, { params: params });
    return response.data.data;
  }

  async getOrdersForGood({ good_id, filter }) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get(REQUESTS.ORDERS + "/good/" + good_id, { params: params });
    return response.data.data;
  }

  async getOrdersCount() {
    let response = await this.service.get(REQUESTS.ORDERS + "/count");
    return response.data.data;
  }

  async getOrder(id) {
    let response = await this.service.get(REQUESTS.ORDERS + "/" + id);
    return response.data.data;
  }

  async setOrderStatus(order_id, status) {
    let response = await this.service.post(REQUESTS.ORDERS + "/" + order_id + "/status/" + status);
    return response.data.data;
  }

  async getOrderHistory(order_id) {
    let response = await this.service.get(REQUESTS.ORDERS + "/" + order_id + "/history");
    return response.data.data;
  }

  async createOrder(order) {
    let response = await this.service.post(REQUESTS.ORDERS, this.parseOrder(order));
    return response.data.data;
  }

  async updateOrder(order) {
    let response = await this.service.put(REQUESTS.ORDERS + "/" + order.id, this.parseOrder(order));
    return response.data.data;
  }

  async deleteCar(id) {
    let response = await this.service.delete(REQUESTS.CARS + "/" + id);
    return response.data.data;
  }

  async buyCar(car_id, price, date, request_type, recipient_user_id) {
    const params = {
      price: price,
      date: date,
      request_type: request_type,
      recipient_user_id: recipient_user_id,
    };
    let response = await this.service.post(REQUESTS.CARS + "/" + car_id + "/buy", params);
    return response.data.data;
  }

  async sellCar(car_id, price, date) {
    const params = {
      price: price,
      date: date,
    };
    let response = await this.service.post(REQUESTS.CARS + "/" + car_id + "/sell", params);
    return response.data.data;
  }

  async getTotalIncomeForCar(car_id) {
    let response = await this.service.get(REQUESTS.CARS + "/" + car_id + "/income");
    return response.data.data;
  }

  async getTotalSalesForCar(car_id) {
    let response = await this.service.get(REQUESTS.CARS + "/" + car_id + "/sales");
    return response.data.data;
  }

  async getTotalForCar(car_id) {
    let response = await this.service.get(REQUESTS.CARS + "/" + car_id + "/totals");
    return response.data.data;
  }

  async getCarPhotos(car_id) {
    let response = await this.service.get(REQUESTS.IMAGES, { params: { car_id: car_id } });
    return response.data.data;
  }

  async getCarsCount() {
    let response = await this.service.get(REQUESTS.CARS + "/count");
    return response.data.data;
  }

  async getCarDataHistory(car_id) {
    let response = await this.service.get(REQUESTS.CARS + "/" + car_id + "/history/data");
    return response.data.data;
  }

  async addCarDataHistory({ car_id, date, odometr }) {
    const params = {
      datetime: date,
      odometr: odometr,
    };
    let response = await this.service.post(REQUESTS.CARS + "/" + car_id + "/history/data", params);
    return response.data.data;
  }

  async updateCarDataHistory(id, { car_id, date, odometr }) {
    const params = {
      datetime: date,
      odometr: odometr,
    };
    let response = await this.service.put(REQUESTS.CARS + "/" + car_id + "/history/data/" + id, params);
    return response.data.data;
  }

  async deleteCarDataHistory(id, car_id) {
    let response = await this.service.delete(REQUESTS.CARS + "/" + car_id + "/history/data/" + id);
    return response.data.data;
  }

  async changeBranchForCar(car_id, branch_id) {
    const params = {
      branch_id: branch_id,
    };
    let response = await this.service.post(REQUESTS.CARS + "/" + car_id + "/branch", params);
    return response.data.data;
  }

  async getCarPrefs(car_id) {
    let response = await this.service.get(REQUESTS.CARS + "/" + car_id + "/prefs");
    return response.data.data;
  }

  async updateCarPrefs(car_id, { doc_types_ignore }) {
    const params = {
      doc_types_ignore: doc_types_ignore,
    };
    let response = await this.service.put(REQUESTS.CARS + "/" + car_id + "/prefs", params);
    return response.data.data;
  }

  /**
   * Goods
   */

  parseGood(good) {
    const params = {
      brand: good.brand,
      name: good.name,
      code: good.code,
      quantity: good.quantity,
      price: good.price,
      description: good.description,
      notes: good.notes ?? "",
      sostav: good.sostav,
      width: parseInt(good.width),
    };

    return params;
  }

  async getGoods(filter, status_arr, searchString = null) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      search: searchString,
    };

    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    let response = await this.service.get(REQUESTS.GOODS, { params: params });
    return response.data.data;
  }

  async getGoodsCount() {
    let response = await this.service.get(REQUESTS.GOODS + "/count");
    return response.data.data;
  }

  async getGood(id) {
    let response = await this.service.get(REQUESTS.GOODS + "/" + id);
    return response.data.data;
  }

  async getGoodRemains(id) {
    let response = await this.service.get(REQUESTS.GOODS + "/" + id + "/stats/remains");
    return response.data.data;
  }

  async createGood(good) {
    let response = await this.service.post(REQUESTS.GOODS, this.parseGood(good));
    return response.data.data;
  }

  async updateGood(good_id, good) {
    let response = await this.service.put(REQUESTS.GOODS + "/" + good_id, this.parseGood(good));
    return response.data.data;
  }

  async setGoodStatus(good_id, status) {
    let response = await this.service.post(REQUESTS.GOODS + "/" + good_id + "/status/" + status);
    return response.data.data;
  }

  /**
   * Acquiring Transactions
   */

  async getAcquiringTransactions(filter) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      filter_order_status: filter.order_status,
      date1: filter.date1,
      date2: filter.date2,
      page: filter.page,
      per_page: filter.per_page,
    };

    let response = await this.service.get(REQUESTS.ACQUIRING, { params: params });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getAcquiringTransaction(id) {
    let response = await this.service.get(REQUESTS.ACQUIRING + "/" + id);
    return response.data.data;
  }

  async depositAcquiringTransaction(orderId) {
    let response = await this.service.post(REQUESTS.ACQUIRING + "/deposit", { order_id: orderId });
    return response.data.data;
  }

  async getPaygateGetOrderStatus(orderId) {
    let response = await this.service.get(REQUESTS.PAYGATE_GET_STATUS, { params: { order_id: orderId } });
    return response.data.data;
  }

  /**
   * Utils
   */

  async calcGraph(price, down_payment, daily_percentage, days) {
    const params = {
      params: { price: price, down_payment: down_payment, daily_percentage: daily_percentage, days: days },
    };
    let response = await this.service.get(REQUESTS.CALC_GRAPH, params);
    return response.data.data;
  }

  async calc(price, down_payment, daily_percentage, days) {
    const params = {
      params: { price: price, down_payment: down_payment, daily_percentage: daily_percentage, days: days },
    };
    let response = await this.service.get(REQUESTS.CALC, params);
    return response.data.data;
  }

  async calcWithAnnuitet(price, down_payment, daily_percentage, annuitet) {
    const params = {
      params: { price: price, down_payment: down_payment, daily_percentage: daily_percentage, daily_payment: annuitet },
    };
    let response = await this.service.get(REQUESTS.CALC, params);
    return response.data.data;
  }

  async downloadGraph(price, down_payment, daily_percentage, days) {
    const params = {
      params: { price: price, down_payment: down_payment, daily_percentage: daily_percentage, days: days },
    };
    let response = await this.service.get(REQUESTS.CALC_GRAPH_PRINTED, params);
    return response.data.data;
  }

  /**
   * Warnings
   */

  async getWarnings(filter) {
    filter = filter || { sort_by: "id", sort_order: "asc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      car_id: filter.car_id,
      customer_id: filter.customer_id,
      page: filter.page,
      per_page: filter.per_page,
    };

    let response = await this.service.get(REQUESTS.WARNINGS, { params: params });
    return { data: response.data.data, meta: response.data.meta };
  }

  /**
   * System
   */

  async getSystemLog(filter) {
    filter = filter || { sort_by: "datetime", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      page: filter.page,
      per_page: filter.per_page,
    };

    let response = await this.service.get(REQUESTS.SYSTEM + "/log", { params: params });
    return { data: response.data.data, meta: response.data.meta };
  }

  /**
   * Events DTP
   */
  async getDTPs(car_id, filter) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      car_id: car_id,
      ...filter,
    };

    let response = await this.service.get(REQUESTS.DTP, { params: params });

    return { data: response.data.data, meta: response.data.meta };
  }

  async createDTP(dtp) {
    const params = {
      car_id: dtp.car_id,
      date: dtp.date,
      inspection_date: dtp.inspection_date,
      driver: dtp.driver,
      culprit: dtp.culprit,
      culprit_phone: dtp.culprit_phone,
      payout_amount: dtp.payout_amount,
      payout_date: dtp.payout_date,
      client_payout_amount: dtp.client_payout_amount,
      client_payout_date: dtp.client_payout_date,
      description: dtp.description,
    };
    let response = await this.service.post(REQUESTS.DTP, params);
    return response.data.data;
  }

  async updateDTP(dtp) {
    const params = {
      car_id: dtp.car_id,
      date: dtp.date,
      inspection_date: dtp.inspection_date,
      driver: dtp.driver,
      culprit: dtp.culprit,
      culprit_phone: dtp.culprit_phone,
      payout_amount: dtp.payout_amount,
      payout_date: dtp.payout_date,
      client_payout_amount: dtp.client_payout_amount,
      client_payout_date: dtp.client_payout_date,
      description: dtp.description,
    };
    let response = await this.service.put(REQUESTS.DTP + "/" + dtp.id, params);
    return response.data.data;
  }

  async deleteDTP(dtp_id) {
    let response = await this.service.delete(REQUESTS.DTP + "/" + dtp_id);
    return response.data.data;
  }

  /**
   * Options
   */
  async getDeliveryMethods(filter) {
    filter = filter || { sort_by: "id", sort_order: "asc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get("/options/delivery_methods", { params: params });

    return response.data.data;
  }

  async getPaymentMethods(filter) {
    filter = filter || { sort_by: "id", sort_order: "asc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get("/options/payment_methods", { params: params });

    return response.data.data;
  }

  async getCompany(id) {
    let response = await this.service.get(REQUESTS.COMPANIES + "/" + id);
    return response.data.data;
  }

  async createCompany(company) {
    const params = {
      name: company.name,
      details: company.details,
      bank_details: company.bank_details,
      notes: company.notes,
    };
    let response = await this.service.post(REQUESTS.COMPANIES, params);
    return response.data.data;
  }

  async updateCompany(company) {
    const params = {
      name: company.name,
      details: company.details,
      bank_details: company.bank_details,
      notes: company.notes,
    };
    let response = await this.service.put(REQUESTS.COMPANIES + "/" + company.id, params);
    return response.data.data;
  }

  /**
   * Car Fines
   */
  async getCarFines(car_id, status_filter, filter, searchString) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      car_id: car_id,
      search: searchString,
      ...filter,
    };

    // Decouple statuses
    const { charge_arr, payed_arr, terms_arr } = status_filter;

    // console.log(charge_arr, payed_arr, terms_arr);

    // Charged status
    if (charge_arr != null) {
      params["charged"] = charge_arr.join(",");
    }

    // Payed status
    if (payed_arr != null && payed_arr.length > 0) {
      params["payed"] = payed_arr.join(",");
    }

    // Terms status
    if (terms_arr != null && terms_arr.length > 0) {
      params["terms"] = terms_arr.join(",");
    }

    let response = await this.service.get(REQUESTS.CAR_FINES, { params: params });

    return { data: response.data.data, meta: response.data.meta };
  }

  async getCarFine(id) {
    let response = await this.service.get(REQUESTS.CAR_FINES + "/" + id);
    return response.data.data;
  }

  async createCarFine(fine) {
    const params = {
      car_id: fine.car_id,
      decree_date: fine.decree_date,
      decree_number: fine.decree_number,
      amount: fine.amount,
      notes: fine.notes,
    };
    let response = await this.service.post(REQUESTS.CAR_FINES, params);
    return response.data.data;
  }

  async updateCarFine(fine) {
    const params = {
      decree_date: fine.decree_date,
      decree_number: fine.decree_number,
      amount: fine.amount,
      notes: fine.notes,
    };
    let response = await this.service.put(REQUESTS.CAR_FINES + "/" + fine.id, params);
    return response.data.data;
  }

  async deleteCarFine(id) {
    let response = await this.service.delete(REQUESTS.CAR_FINES + "/" + id);
    return response.data.data;
  }

  async payCarFine(id) {
    let response = await this.service.post(REQUESTS.CAR_FINES + "/" + id + "/pay");
    return response.data.data;
  }

  async payCarFinesForContract(contract_id) {
    let response = await this.service.post(REQUESTS.CAR_FINES + "/contract/" + contract_id + "/pay");
    return response.data.data;
  }

  async getCarFinesTotals() {
    let response = await this.service.get(REQUESTS.CAR_FINES + "/totals");

    return response.data.data;
  }

  async getCarFinesTotalsForContracts(contract_id) {
    let response = await this.service.get(REQUESTS.CAR_FINES + "/totals/contracts/" + contract_id);

    return response.data.data;
  }

  async getCarFinesTotalsForRentContracts(contract_id) {
    let response = await this.service.get(REQUESTS.CAR_FINES + "/totals/rent_contracts/" + contract_id);

    return response.data.data;
  }

  async getCarFinesTotalsForCar(car_id) {
    let response = await this.service.get(REQUESTS.CAR_FINES + "/totals/cars/" + car_id);

    return response.data.data;
  }

  /**
   * Promo
   */

  async getPromoActions(status_arr, filter) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    let response = await this.service.get(REQUESTS.PROMO, { params: params });

    return response.data.data;
  }

  async createPromoAction(action) {
    const params = {
      name: action.name,
      date1: action.date1,
      date2: action.date2,
      notes: action.notes,
      hidden: action.hidden ? 1 : 0,
    };
    let response = await this.service.post(REQUESTS.PROMO, params);
    return response.data.data;
  }

  async deletePromoAction(action_id) {
    let response = await this.service.delete(REQUESTS.PROMO + "/" + action_id);
    return response.data.data;
  }

  async updatePromoAction(action) {
    const params = {
      name: action.name,
      date1: action.date1,
      date2: action.date2,
      notes: action.notes,
      hidden: action.hidden == true ? 1 : 0,
    };
    let response = await this.service.put(REQUESTS.PROMO + "/" + action.id, params);
    return response.data.data;
  }
  async updatePromoActionMessage(action) {
    const params = {
      header: action.message_header,
      text: action.message_text,
    };
    let response = await this.service.put(REQUESTS.PROMO + "/" + action.id + "/message", params);
    return response.data.data;
  }

  async setPromoActionStatus(action_id, status) {
    let response = await this.service.post(REQUESTS.PROMO + "/" + action_id + "/" + "status" + "/" + status);
    return response.data.data;
  }

  async getPromoAction(action_id) {
    let response = await this.service.get(REQUESTS.PROMO + "/" + action_id);
    return response.data.data;
  }

  async getPromoAvailableIndicators() {
    let response = await this.service.get(REQUESTS.PROMO + "/" + "indicators");
    return response.data.data;
  }

  async addPromoActionIndicator(action_id, indicator) {
    const params = {
      indicator_id: indicator.indicator_id,
      value: indicator.value,
      notes: indicator.notes || "",
    };
    let response = await this.service.post(REQUESTS.PROMO + "/" + action_id + "/" + "indicators", params);
    return response.data.data;
  }

  async updatePromoActionIndicator(action_id, indicator_id, indicator) {
    const params = {
      indicator_id: indicator.indicator_id,
      value: indicator.value,
      notes: indicator.notes || "",
    };
    let response = await this.service.put(
      REQUESTS.PROMO + "/" + action_id + "/" + "indicators" + "/" + indicator_id,
      params
    );
    return response.data.data;
  }

  async deletePromoActionIndicator(action_id, indicator_id) {
    let response = await this.service.delete(
      REQUESTS.PROMO + "/" + action_id + "/" + "indicators" + "/" + indicator_id
    );
    return response.data.data;
  }

  async getPromoActionResult(action_id) {
    let response = await this.service.get(REQUESTS.PROMO + "/" + action_id + "/" + "result");
    return response.data.data;
  }

  async runPromoAction(action_id) {
    let response = await this.service.post(REQUESTS.PROMO + "/" + action_id + "/" + "run");
    return response.data.data;
  }

  async getPromoActionContracts(date1, date2) {
    const params = {
      date1: date1,
      date2: date2,
    };

    let response = await this.service.get(REQUESTS.PROMO + "/" + "calc_contracts", { params: params });

    return response.data.data;
  }

  async getPromoActionRules(action_id) {
    let response = await this.service.get(REQUESTS.PROMO + "/" + action_id + "/" + "rules");
    return response.data.data;
  }

  async updatePromoActionRules(action_id, rules) {
    let response = await this.service.put(REQUESTS.PROMO + "/" + action_id + "/" + "rules", rules);
    return response.data.data;
  }

  async deletePromoActionRules(action_id, section) {
    let response = await this.service.delete(REQUESTS.PROMO + "/" + action_id + "/" + "rules" + "/" + section);
    return response.data.data;
  }

  /**
   * Notifications
   */
  async getNotifications(filter) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get(REQUESTS.NOTIFICATIONS, { params: params });

    return response.data.data;
  }

  async getNotification(message_id) {
    let response = await this.service.get(REQUESTS.NOTIFICATIONS + "/" + message_id);
    return response.data.data;
  }

  async saveNotification(message) {
    let response = await this.service.post(REQUESTS.NOTIFICATIONS, message);
    return response.data.data;
  }

  async deleteNotification(message_id) {
    let response = await this.service.delete(REQUESTS.NOTIFICATIONS + "/" + message_id);
    return response.data.data;
  }

  async getNotificationsReceivers(f_name, param1) {
    const params = {
      param1: param1,
    };

    let response = await this.service.get(REQUESTS.NOTIFICATIONS + "/" + "receivers/" + f_name, { params: params });

    return response.data.data;
  }

  /**
   * Photo Reports
   */

  async getPhotoReports(car_id, status_arr, checks_arr, expired, filter) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      car_id: car_id,
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    if (checks_arr != null) {
      params["checks"] = checks_arr.join(",");
    }

    if (expired != null) {
      params["expired"] = expired;
    }

    let response = await this.service.get(REQUESTS.PHOTO_REPORTS, { params: params });
    return response.data.data;
  }

  async getPhotoReport(report_id) {
    let response = await this.service.get(REQUESTS.PHOTO_REPORTS + "/" + report_id);
    return response.data.data;
  }

  async updateItemsMarks(items) {
    let response = await this.service.put(REQUESTS.PHOTO_REPORTS + "/items", items);
    return response.data.data;
  }

  /**
   * BRANCHES
   */

  parseBranch(branch) {
    const params = {
      name: !branch.name ? "" : branch.name,
      short_name: !branch.short_name ? "" : branch.short_name,
      description: !branch.description ? "" : branch.description,
    };

    return params;
  }

  async getBranches(filter) {
    filter = filter || { sort_by: "id", sort_order: "asc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get(REQUESTS.BRANCHES, { params: params });

    return response.data.data;
  }

  async getBranchesExt(filter) {
    filter = filter || { sort_by: "id", sort_order: "asc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get(REQUESTS.BRANCHES + "/ext", { params: params });

    return response.data.data;
  }

  async getBranch(branch_id) {
    let response = await this.service.get(REQUESTS.BRANCHES + "/" + branch_id);
    return response.data.data;
  }

  async getBranchAccounts(branch_id) {
    let response = await this.service.get(REQUESTS.BRANCHES + "/" + branch_id + "/accounts");
    return response.data.data;
  }

  async getBranchLeasingContractsTotals(branch_id) {
    let response = await this.service.get(REQUESTS.BRANCHES + "/" + branch_id + "/contracts_totals");
    return response.data.data;
  }

  async createBranch(branch) {
    let response = await this.service.post(REQUESTS.BRANCHES, this.parseBranch(branch));
    return response.data.data;
  }

  async updateBranch(branch) {
    let response = await this.service.put(REQUESTS.BRANCHES + "/" + branch.id, this.parseBranch(branch));
    return response.data.data;
  }

  /**
   * Prefs
   */

  async getPrefs() {
    let response = await this.service.get(REQUESTS.PREFS);
    return response.data.data;
  }

  async getPrefValueByKey(key) {
    let response = await this.service.get(REQUESTS.PREFS + "/" + key);
    return response.data.data;
  }

  async updatePrefValue(item) {
    let response = await this.service.put(REQUESTS.PREFS, item);
    return response.data.data;
  }

  /**
   * Hints
   */

  async getHint(hintName) {
    let response = await this.service.get(REQUESTS.HINTS + "/" + hintName);
    return response.data.data;
  }
}

export default new APIService();
