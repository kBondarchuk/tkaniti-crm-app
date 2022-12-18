import LayoutView from "@/views/LayoutView.vue";

export default [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView.vue"),
  },

  {
    path: "/logoff",
    name: "logoff",
    component: () => import("@/views/LogoffView.vue"),
  },

  {
    path: "/orders",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "orders",
        component: () => import("@/views/OrdersView.vue"),
      },
      {
        path: ":id",
        name: "order_details",
        props: (route) => ({ orderId: Number(route.params.id), tab_name: route.params.tab_name }),
        component: () => import("@/views/OrderDetailsView.vue"),
        redirect: {
          name: "order_details_general",
        },
        children: [
          {
            path: "general",
            name: "order_details_general",
            component: () => import("@/components/TKOrderDetailsTab_General.vue"),
          },
          {
            path: "history",
            name: "order_details_history",
            component: () => import("@/components/TKOrderDetailsTab_History.vue"),
          },
        ],
      },
      {
        path: "new",
        name: "order_new",
        meta: { ignoreHistory: true },
        component: () => import("@/views/OrderEdit.vue"),
      },
      {
        path: ":id/edit",
        name: "order_edit",
        meta: { ignoreHistory: true },
        component: () => import("@/views/OrderEdit.vue"),
      },
    ],
  },
  {
    path: "/goods",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "goods",
        component: () => import("@/views/GoodsView.vue"),
      },
      {
        path: "new",
        name: "good_new",
        meta: { ignoreHistory: true },
        component: () => import("@/views/GoodEdit.vue"),
      },
      {
        path: ":id",
        name: "goods_details",
        props: (route) => ({ goodId: Number(route.params.id), tab_name: route.params.tab_name }),
        component: () => import("@/views/GoodsDetailsView.vue"),
        redirect: {
          name: "goods_details_general",
        },
        children: [
          {
            path: "general",
            name: "goods_details_general",
            component: () => import("@/components/TKGoodsDetailsTab_General.vue"),
          },
          {
            path: "photos",
            name: "goods_details_photos",
            component: () => import("@/components/TKGoodsDetailsTab_PhotoGallery.vue"),
          },
          {
            path: "orders",
            name: "goods_details_orders",
            component: () => import("@/components/TKGoodsDetailsTab_Orders.vue"),
          },
        ],
      },
      {
        path: ":id/edit",
        name: "good_edit",
        meta: { ignoreHistory: true },
        component: () => import("@/views/GoodEdit.vue"),
      },
    ],
  },
  {
    path: "/customers",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "customers",
        component: () => import("@/views/TKCustomersView.vue"),
      },
      {
        path: "new",
        name: "customers_new",
        meta: { ignoreHistory: true },
        component: () => import("@/views/TKCustomersEdit.vue"),
      },
      {
        path: ":id",
        name: "customers_details",
        component: () => import("@/views/TKCustomersDetailsView.vue"),
      },
      {
        path: ":id/edit",
        name: "customers_edit",
        meta: { ignoreHistory: true },
        component: () => import("@/views/TKCustomersEdit.vue"),
      },
    ],
  },

  {
    path: "/contracts/lease",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "contracts",
        component: () => import("@/views/ContractsLeasingView.vue"),
      },
      {
        path: "new",
        name: "new_contract",
        component: () => import("@/views/NewContract.vue"),
      },
      {
        path: ":id",
        name: "contract_details",
        props: (route) => ({ contract_id: Number(route.params.id), tab_name: route.params.tab_name }),
        component: () => import("@/views/ContractDetails.vue"),
        redirect: {
          name: "contract_details_general",
        },
        children: [
          {
            path: "general",
            name: "contract_details_general",
            component: () => import("@/components/CMContractDetailsTab_General.vue"),
          },
          {
            path: "accounts",
            name: "contract_details_accounts",
            component: () => import("@/components/CMContractDetailsTab_Accounts.vue"),
          },
          {
            path: "schedule",
            name: "contract_details_schedule",
            component: () => import("@/components/CMContractDetailsTab_Schedule.vue"),
          },
          {
            path: "history",
            name: "contract_details_history",
            component: () => import("@/components/CMContractDetailsTab_History.vue"),
          },
          {
            path: "options",
            name: "contract_details_options",
            component: () => import("@/components/CMContractDetailsTab_Options.vue"),
          },
        ],
      },
    ],
  },

  // Rent
  {
    path: "/contracts/rent",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "contracts_rent",
        component: () => import("@/views/ContractsRent.vue"),
      },
      {
        path: "new",
        name: "new_contract_rent",
        component: () => import("@/views/NewContractRent.vue"),
      },
      {
        path: ":id",
        name: "contract_rent_details",
        props: (route) => ({ contract_id: Number(route.params.id) }),
        component: () => import("@/views/ContractRentDetails.vue"),
      },
    ],
  },

  // Budget
  {
    path: "/budget/requests",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "budget_request_list",
        component: () => import("@/views/BudgetView.vue"),
      },
      {
        path: "new/:request_type",
        name: "budget_request_new",
        props: (route) => ({ car_id: Number(route.query.car_id), request_type: route.params.request_type }),
        meta: { ignoreHistory: true },
        component: () => import("@/views/BudgetRequestDetails2.vue"),
      },
      {
        name: "budget_request_details",
        path: ":request_id",
        props: (route) => ({ request_id: Number(route.params.request_id) }),
        component: () => import("@/views/BudgetRequestDetails2.vue"),
      },
      {
        name: "budget_request_new2",
        path: "v2/new/:request_type",
        props: (route) => ({ car_id: Number(route.query.car_id), request_type: route.params.request_type }),
        meta: { ignoreHistory: true },
        component: () => import("@/views/BudgetRequestDetails2.vue"),
      },
      /*
      {
        name: "budget_request_details2",
        path: "v2/:request_id",
        props: (route) => ({ request_id: Number(route.params.request_id) }),
        component: () => import("@/views/BudgetRequestDetails2.vue"),
      },
      */
    ],
  },

  // Aquiring
  {
    path: "/cashier/transactions",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "cashier",
        component: () => import("@/views/CashierView.vue"),
      },
      {
        path: ":id",
        name: "acquiringTransactions_details",
        component: () => import("@/views/CashierDetails.vue"),
      },
    ],
  },

  // Advances
  {
    path: "/advance/requests",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "advance_request_list",
        component: () => import("@/views/AdvanceView.vue"),
      },
      {
        path: "new/:type_id",
        name: "advance_request_new",
        props: (route) => ({
          type_id: Number(route.params.type_id),
          reported_id: Number(route.params.reported_id),
        }),
        meta: { ignoreHistory: true },
        component: () => import("@/views/AdvanceRequestDetails.vue"),
      },
      {
        path: ":request_id",
        name: "advance_request_details",
        props: (route) => ({ request_id: Number(route.params.request_id) }),
        component: () => import("@/views/AdvanceRequestDetails.vue"),
      },
    ],
  },

  // Car fines
  {
    path: "/car_fines",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "car_fines",
        props: (route) => ({
          termsStatus: Number.isNaN(parseInt(route.query.terms)) ? null : Number(route.query.terms),
          payedStatus: Number.isNaN(parseInt(route.query.payed)) ? null : Number(route.query.payed),
          carId: Number.isNaN(parseInt(route.query.car_id)) ? null : Number(route.query.car_id),
        }),
        component: () => import("@/views/CarFinesView.vue"),
      },
      {
        path: ":id",
        name: "car_fines_details",
        props: (route) => ({ fine_id: Number(route.params.id) }),
        component: () => import("@/views/CarFinesDetails.vue"),
      },
    ],
  },

  // Car fines
  {
    path: "/registrations/requests",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "registration_requests_list",
        component: () => import("@/views/RegistrationsView.vue"),
      },
      {
        name: "registration_request_details",
        path: ":request_id",
        props: (route) => ({ request_id: Number(route.params.request_id) }),
        component: () => import("@/views/RegistrationRequestDetails.vue"),
      },
    ],
  },

  // Investors
  {
    path: "/investors",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "investors",
        component: () => import("@/views/InvestorsView.vue"),
      },
      {
        path: ":id",
        name: "investors_details",
        props: (route) => ({ investor_id: Number(route.params.id) }),
        component: () => import("@/views/InvestorsDetails.vue"),
      },
    ],
  },

  // Branches
  {
    path: "/branches",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "branches",
        component: () => import("@/views/BranchesView.vue"),
      },
      {
        path: ":id",
        name: "branches_details",
        props: (route) => ({ branch_id: Number(route.params.id) }),
        component: () => import("@/views/BranchDetails.vue"),
      },
    ],
  },

  // Main
  {
    path: "/",
    component: LayoutView,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/HomeView.vue"),
      },
      //
      {
        path: "/calc",
        name: "cals",
        component: () => import("@/views/CalcView.vue"),
      },
      //
      {
        path: "/statistics",
        name: "statistics",
        component: () => import("@/views/StatisticsView.vue"),
      },
      // Operations
      {
        path: "/finances/operations",
        name: "finances_operations",
        component: () => import("@/views/OperationsView.vue"),
      },
      // Reports
      {
        path: "/finances/reports",
        name: "finances_reports",
        component: () => import("@/views/ReportsView.vue"),
      },
      //
      {
        path: "/photo_reports",
        name: "photo_reports",
        component: () => import("@/views/PhotoReportsView.vue"),
      },
      //
      {
        path: "/promo",
        name: "promo",
        component: () => import("@/views/PromoView.vue"),
      },
      //
      {
        path: "/notifications",
        name: "notifications",
        component: () => import("@/views/NotificationsView.vue"),
      },
      //
      {
        path: "/dtp",
        name: "dtp_list",
        component: () => import("@/views/DTPView.vue"),
      },
      //
      {
        path: "/prefs",
        name: "Preferences",
        component: () => import("@/views/PreferencesView.vue"),
      },

      // {
      //   path: "admin",
      //   name: "admin",
      //   component: () => import("@/views/AdminView.vue"),
      // },
      // {
      //   name: "penalties_details",
      //   path: "/penalties/:penaltie_id",
      //   props: (route) => ({ penaltie_id: Number(route.params.request_id) }),
      //   component: () => import("@/views/PenaltiesDetails.vue"),
      // },

      // {
      //   path: "/cars/:id/:tab_name",
      //   name: "cars_details_tab",
      //   props: (route) => ({ car_id: Number(route.params.id), tab_name: route.params.tab_name }),
      //   component: () => import("@/views/CarsDetails.vue"),
      // },

      // {
      //   path: "/finances/expenses",
      //   name: "finances_expenses",
      //   component: () => import("@/views/ExpensesView.vue"),
      // },
      // {
      //   path: "/finances/income",
      //   name: "finances_income",
      //   component: () => import("@/views/IncomeView.vue"),
      // },

      // {
      //   path: "/finances/reports_new",
      //   name: "finances_reports_new",
      //   component: () => import("@/views/ReportsNew.vue"),
      // },
      // {
      //   path: "/test",
      //   name: "TestView",
      //   component: () => import("@/views/TestView.vue"),
      // },
      {
        // will match everything
        path: "/:pathMatch(.*)*",
        name: "page_not_found",
        component: () => import("@/views/Error404View.vue"),
      },
      {
        // will match everything
        path: "/:pathMatch(.*)",
        name: "page_not_found2",
        component: () => import("@/views/Error404View.vue"),
      },
    ],
  },
];
