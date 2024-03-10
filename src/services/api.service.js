import { APIServiceCore } from "./APIServiceCore.js";

const REQUESTS = {
  LOGIN: "/login",
  CUSTOMERS: "/customers",
  ORDERS: "/orders",
  GOODS: "/goods",

  SALES: "/sales",
  OPERATIONS: "/operations",
  TRANSACTIONS: "/transactions",
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
  VIDEOS: "/videos",
  DOCUMENTS: "/documents",
  WARNINGS: "/warnings",
  COMPANIES: "/companies",
  NOTIFICATIONS: "/notifications",
  PREFS: "/prefs",
  PAYMENTS: {
    INVOICES: "/payments/invoices",
    REFRESH_ORDER: "/payments/refreshorder",
    SETTINGS: "/payments/settings",
  },
  TOKEN: "/token",
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
   * VIDEOS
   */

  async uploadVideo(
    file,
    album_uuid,
    description,
    progressCallback = (progress) => {
      console.log(progress, "%");
    }
  ) {
    // Validate
    if (!album_uuid) {
      console.log("[uploadVideo]: album_uuid: ", album_uuid);
      return Promise.reject("[APIService]: album_uuid == null");
    }

    // create form data
    let formData = new FormData();
    formData.append("video", file);
    formData.append("album_uuid", album_uuid);
    formData.append("description", description);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        const progress = Math.round((event.loaded / event.total) * 100);

        progressCallback(progress);
      },
    };

    let response = await this.service.post(REQUESTS.VIDEOS, formData, config);
    return response.data.data;
  }

  async getVideos(album_uuid) {
    let response = await this.service.get(REQUESTS.VIDEOS, { params: { album_uuid: album_uuid } });
    return response.data.data;
  }

  async deleteVideo(id) {
    let response = await this.service.delete(REQUESTS.VIDEOS + "/" + id);
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
        sort_by: filter.sort_by,
        sort_order: filter.sort_order,
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
   * Payments
   */

  async getPaymentsInvoices(filter) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      page: filter.page,
      per_page: filter.per_page,
      status: filter.status,
      company_id: filter.company_id,
      payment_method: filter.payment_method,
      date1: filter.date1,
      date2: filter.date2,
      cleared: filter.cleared,
      subject_type: filter.subject_type,
      subject_id: filter.subject_id,
    };

    let response = await this.service.get(REQUESTS.PAYMENTS.INVOICES, { params: params });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getInvoice(id) {
    let response = await this.service.get(REQUESTS.PAYMENTS.INVOICES + "/" + id);
    let payload = JSON.parse(response.data.data.payload);

    var result = response.data.data;
    result.payload = payload;

    return result;
  }

  async makeInvoice(item) {
    const params = {
      amount: item.amount,
      payment_method: item.payment_method,
      subject_type: item.subject_type,
      subject_id: item.subject_id,
      send_cart: item.send_cart,
    };
    console.warn(params);

    let response = await this.service.post(REQUESTS.PAYMENTS.INVOICES, params);
    return response.data.data;
  }

  async depositInvoice(id) {
    let response = await this.service.post(REQUESTS.PAYMENTS.INVOICES + "/" + id + "/deposit");
    return response.data.data;
  }

  async refreshPaymentOrderStatus(paymentMethod, orderId) {
    let params = { payment_method: paymentMethod, order_id: orderId };

    let response = await this.service.post(REQUESTS.PAYMENTS.REFRESH_ORDER, params);
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

    let response = await this.service.get(REQUESTS.CUSTOMERS, { params: params, cancelPreviousRequests: true });

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
      company_id: parseInt(order.company_id),
      customer_id: parseInt(order.customer_id),
      customer_fio: order.customer_fio,
      customer_phone: order.customer_phone,
      customer_notes: order.customer_notes,
      delivery_address: order.delivery_address,
      delivery_method_id: order.delivery_method_id,
      delivery_method_other: order.delivery_method_other,
      delivery_date: order.delivery_date,
      notes: order.notes,
      payment_method_id: parseInt(order.payment_method_id),
      basket: order.basket.map((item) => {
        return {
          id: item.id,
          good_uuid: item.good_uuid,
          good_id: item.good_id,
          good_quantity: item.good_quantity,
          good_price: item.good_price,
          delete: item.delete,
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
      page: filter.page,
      per_page: filter.per_page,
      search: searchString,
    };

    if (status_arr != null) {
      params["status"] = status_arr.join(",");
    }

    if (filter.good_id != null) {
      params["good_id"] = filter.good_id;
    }

    let response = await this.service.get(REQUESTS.ORDERS, { params: params, cancelPreviousRequests: true });
    return { data: response.data.data, meta: response.data.meta };
  }

  async getOrdersForGood({ good_id, order_status_id, filter }) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      order_status_id: order_status_id,
    };

    let response = await this.service.get(REQUESTS.ORDERS + "/good/" + good_id, { params: params });
    return response.data.data;
  }

  async getOrdersForCustomer({ customer_id, filter }) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get(REQUESTS.ORDERS + "/customer/" + customer_id, { params: params });
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

  async getOrderParcelNumber(id) {
    let response = await this.service.get(REQUESTS.ORDERS + "/" + id + "/parcel");
    return response.data.data;
  }

  async setOrderParcelNumber(order_id, parcel_number) {
    const params = {
      parcel_number: parcel_number,
    };

    let response = await this.service.put(REQUESTS.ORDERS + "/" + order_id + "/parcel", params);
    return response.data.data;
  }

  async setOrderNextStatus(order_id, status) {
    let response = await this.service.post(REQUESTS.ORDERS + "/" + order_id + "/status/next/" + status);
    return response.data.data;
  }

  async setOrderPreviousStatus(order_id, status) {
    let response = await this.service.post(REQUESTS.ORDERS + "/" + order_id + "/status/previous/" + status);
    return response.data.data;
  }

  async cancelOrder(order_id) {
    let response = await this.service.post(REQUESTS.ORDERS + "/" + order_id + "/status/cancel");
    return response.data.data;
  }

  async getOrderHistory(order_id) {
    let response = await this.service.get(REQUESTS.ORDERS + "/" + order_id + "/history");
    return response.data.data;
  }

  async getOrderAccounts(order_id) {
    let response = await this.service.get(REQUESTS.ORDERS + "/" + order_id + "/accounts");
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

  async cloneOrder(order_id) {
    let response = await this.service.post(REQUESTS.ORDERS + "/" + order_id + "/clone");
    return response.data.data;
  }

  async deleteCar(id) {
    let response = await this.service.delete(REQUESTS.CARS + "/" + id);
    return response.data.data;
  }

  async orderPay(order_id, amount, notes) {
    const params = {
      amount: amount,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.ORDERS + "/" + order_id + "/pay", params);
    return response.data.data;
  }

  async orderRefund(order_id, amount, notes) {
    const params = {
      amount: amount,
      notes: notes,
    };
    let response = await this.service.post(REQUESTS.ORDERS + "/" + order_id + "/refund", params);
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
      category_id: parseInt(good.category_id),
      specs: JSON.stringify(good.specs),
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

    let response = await this.service.get(REQUESTS.GOODS, { params: params, cancelPreviousRequests: true });
    return response.data.data;
  }

  async getGoodsCount() {
    let response = await this.service.get(REQUESTS.GOODS + "/count");
    return response.data.data;
  }

  async getGood(id) {
    let response = await this.service.get(REQUESTS.GOODS + "/" + id);

    var data = response.data.data;
    if (response.data.data.specs) {
      data.specs = JSON.parse(response.data.data.specs) ?? {};
    } else {
      data.specs = {};
    }
    if (response.data.data.specs_meta) {
      data.specs_meta = JSON.parse(response.data.data.specs_meta);
    }
    return data;
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

  async getMeasures(filter) {
    filter = filter || { sort_by: "id", sort_order: "asc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get("/options/measures", { params: params });

    return response.data.data;
  }

  async getGoodCategories(filter) {
    filter = filter || { sort_by: "id", sort_order: "asc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get("/options/goods_categories", { params: params });

    return response.data.data;
  }

  /**
   * Companies
   */
  async getCompanies(filter) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
    };

    let response = await this.service.get(REQUESTS.COMPANIES, { params: params });

    return response.data.data;
  }

  async getCompany(id) {
    let response = await this.service.get(REQUESTS.COMPANIES + "/" + id);
    return response.data.data;
  }

  parseCompany(company) {
    console.log(JSON.stringify(company.payments.settings));
    return {
      name: company.name,
      details: company.details,
      bank_details: company.bank_details,
      notes: company.notes,

      // PAYMENTS SETTINGS:
      payments_settings: company.payments.settings,

      // inn: company.inn,
      // acq_settings_id: company.acq_settings_id,
      // sbp_settings_id: company.sbp_settings_id,
      // acq_ofd_settings_id: company.acq_ofd_settings_id,
      // sbp_ofd_settings_id: company.sbp_ofd_settings_id,
    };
  }

  async createCompany(company) {
    const params = this.parseCompany(company);
    let response = await this.service.post(REQUESTS.COMPANIES, params);
    return response.data.data;
  }

  async updateCompany(company) {
    const params = this.parseCompany(company);
    let response = await this.service.put(REQUESTS.COMPANIES + "/" + company.id, params);
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
   * Payments: Settings
   */

  async getPaymentsSettings(filter) {
    filter = filter || { sort_by: "id", sort_order: "desc" };

    const params = {
      sort_by: filter.sort_by,
      sort_order: filter.sort_order,
      settings_type: filter.settings_type,
      enabled: filter.enabled,
    };

    let response = await this.service.get(REQUESTS.PAYMENTS.SETTINGS, { params: params });

    return response.data.data;
  }

  parsePaymentsSettings(params) {
    return {
      name: params.name,
      notes: params.notes,
      settings_type: params.settings_type,
      enabled: Number(params.enabled),
      payload: params.payload,
      // payload: {
      //   api_login: params.payload.api_login,
      //   api_password: params.payload.api_password,
      //   api_url: params.payload.api_url,
      //   api_callback_url: params.payload.api_callback_url,
      //   payment_method: params.payload.payment_method,
      //   payment_type: params.payload.payment_type,
      //   taxation_system: params.payload.taxation_system,
      //   vat: params.payload.vat,
      //   item_label: params.payload.item_label,
      // },
    };
  }

  async createPaymentsSettings(item) {
    const params = this.parsePaymentsSettings(item);

    let response = await this.service.post(REQUESTS.PAYMENTS.SETTINGS, params);
    return response.data.data;
  }

  async updatePaymentsSettings(item) {
    const params = this.parsePaymentsSettings(item);

    let response = await this.service.put(REQUESTS.PAYMENTS.SETTINGS + "/" + item.id, params);
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
