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
            path: "operations",
            name: "order_details_operations",
            component: () => import("@/components/TKOrderDetailsTab_Transactions.vue"),
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
        props: (route) => ({ orderId: null }),
        meta: { ignoreHistory: true },
        component: () => import("@/views/OrderEdit.vue"),
      },
      {
        path: ":id/edit",
        name: "order_edit",
        props: (route) => ({ orderId: Number(route.params.id) }),
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
        path: "new",
        name: "good_new",
        // props: (route) => ({ goodId: null }),
        meta: { ignoreHistory: true },
        component: () => import("@/views/GoodEditView.vue"),
      },
      {
        path: ":id/edit",
        name: "good_edit",
        props: (route) => ({ goodId: Number(route.params.id) }),
        meta: { ignoreHistory: true },
        component: () => import("@/views/GoodEditView.vue"),
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
        component: () => import("@/views/TKCustomersEditView.vue"),
      },
      {
        path: ":id",
        name: "customers_details",
        props: (route) => ({ customerId: Number(route.params.id), tab_name: route.params.tab_name }),
        component: () => import("@/views/TKCustomersDetailsView.vue"),
        redirect: {
          name: "customers_details_general",
        },
        children: [
          {
            path: "general",
            name: "customers_details_general",
            component: () => import("@/components/TKCustomersDetailsTab_General.vue"),
          },
          {
            path: "orders",
            name: "customers_details_orders",
            component: () => import("@/components/TKCustomersDetailsTab_Orders.vue"),
          },
        ],
      },
      {
        path: ":id/edit",
        name: "customers_edit",
        meta: { ignoreHistory: true },
        component: () => import("@/views/TKCustomersEditView.vue"),
      },
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
      // Operations
      {
        path: "/finances/operations",
        name: "finances_operations",
        component: () => import("@/views/TKOperationsView.vue"),
      },
      // Reports
      {
        path: "/finances/reports",
        name: "finances_reports",
        component: () => import("@/views/ReportsView.vue"),
      },
      {
        path: "/prefs",
        name: "Preferences",
        component: () => import("@/views/PreferencesView.vue"),
      },
      // Payments
      {
        path: "/cashier/invoices",
        children: [
          {
            path: "",
            name: "payments_invoices",
            component: () => import("@/views/PaymentsView.vue"),
          },
          {
            path: ":id",
            name: "payments_invoice_details",
            props: (route) => ({ invoiceId: Number(route.params.id) }),
            component: () => import("@/views/PaymentDetails.vue"),
          },
        ],
      },

      // {
      //   path: "admin",
      //   name: "admin",
      //   component: () => import("@/views/AdminView.vue"),
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
