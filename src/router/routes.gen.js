function ParsedNumber(value) {
  return Number.isNaN(parseInt(value)) ? null : Number(value);
}

export const routes = [
  {
    name: "Login",
    path: "/login",
    component: () => import("../views/LoginView.vue"),
  },

  {
    name: "Logoff",
    path: "/logoff",
    component: () => import("../views/LogoffView.vue"),
  },

  {
    path: "/",
    component: () => import("../layouts/LayoutView.vue"),
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("../views/HomeView.vue"),
      },
    ],
  },

  {
    path: "/finances/reports",
    component: () => import("../layouts/LayoutView.vue"),
    children: [
      {
        path: "/finances/reports",
        name: "Reports",
        component: () => import("../views/ReportsView.vue"),
      },
    ],
  },

  {
    path: "/prefs",
    component: () => import("../layouts/LayoutView.vue"),
    children: [
      {
        name: "PrefsPages",
        path: ":pageId",
        props: (route) => ({ pageId: String(route.params.pageId) }),
        component: () => import("../views/PrefsPagesView.vue"),
      },
    ],
  },

  {
    path: "/finances/operations",
    component: () => import("../layouts/LayoutView.vue"),
    children: [
      {
        path: "/finances/operations",
        name: "Operations",
        component: () => import("../views/OperationsView.vue"),
      },
    ],
  },

  {
    path: "/payments",
    component: () => import("../layouts/LayoutView.vue"),
    children: [
      {
        name: "PaymentsList",
        path: "",
        component: () => import("../views/PaymentsView.vue"),
      },

      {
        name: "PaymentsDetails",
        path: ":invoiceId",
        props: (route) => ({ invoiceId: Number(route.params.invoiceId) }),
        component: () => import("../views/PaymentsDetailsView.vue"),
      },
    ],
  },

  {
    path: "/orders",
    component: () => import("../layouts/LayoutView.vue"),
    children: [
      {
        name: "OrdersList",
        path: "",
        component: () => import("../views/OrdersListView.vue"),
      },

      {
        name: "OrdersNew",
        path: "new",
        component: () => import("../views/OrdersEditView.vue"),
      },

      {
        name: "OrdersDetails",
        path: ":orderId",
        props: (route) => ({ orderId: Number(route.params.orderId) }),
        component: () => import("../views/OrdersDetailsView.vue"),
        redirect: { name: "OrdersDetailsTab_General" },
        children: [
          {
            path: "general",
            name: "OrdersDetailsTab_General",
            component: () => import("../views/OrdersDetailsTab_General.vue"),
          },
          {
            path: "operations",
            name: "OrdersDetailsTab_Operations",
            component: () => import("../views/OrdersDetailsTab_Operations.vue"),
          },
          {
            path: "history",
            name: "OrdersDetailsTab_History",
            component: () => import("../views/OrdersDetailsTab_History.vue"),
          },
        ],
      },

      {
        name: "OrdersEdit",
        path: ":orderId/edit",
        props: (route) => ({ goodId: Number(route.params.goodId) }),
        component: () => import("../views/OrdersEditView.vue"),
      },
    ],
  },

  {
    path: "/goods",
    component: () => import("../layouts/LayoutView.vue"),
    children: [
      {
        name: "GoodsList",
        path: "",
        component: () => import("../views/GoodsListView.vue"),
      },

      {
        name: "GoodsNew",
        path: "new",
        component: () => import("../views/GoodsEditView.vue"),
      },

      {
        name: "GoodsDetails",
        path: ":goodId",
        props: (route) => ({ goodId: Number(route.params.goodId) }),
        component: () => import("../views/GoodsDetailsView.vue"),
        redirect: { name: "GoodsDetailsTab_General" },
        children: [
          {
            path: "general",
            name: "GoodsDetailsTab_General",
            component: () => import("../views/GoodsDetailsTab_General.vue"),
          },
          {
            path: "photos",
            name: "GoodsDetailsTab_Photos",
            component: () => import("../views/GoodsDetailsTab_Photos.vue"),
          },
          {
            path: "videos",
            name: "GoodsDetailsTab_Videos",
            component: () => import("../views/GoodsDetailsTab_Videos.vue"),
          },
          {
            path: "orders",
            name: "GoodsDetailsTab_Orders",
            component: () => import("../views/GoodsDetailsTab_Orders.vue"),
          },
        ],
      },

      {
        name: "GoodsEdit",
        path: ":goodId/edit",
        props: (route) => ({ goodId: Number(route.params.goodId) }),
        component: () => import("../views/GoodsEditView.vue"),
      },
    ],
  },

  {
    path: "/customers",
    component: () => import("../layouts/LayoutView.vue"),
    children: [
      {
        name: "CustomersList",
        path: "",
        component: () => import("../views/CustomersListView.vue"),
      },

      {
        name: "CustomersNew",
        path: "new",
        component: () => import("../views/CustomersEditView.vue"),
      },

      {
        name: "CustomersDetails",
        path: ":customerId",
        props: (route) => ({ customerId: Number(route.params.customerId) }),
        component: () => import("../views/CustomersDetailsView.vue"),
        redirect: { name: "CustomersDetailsTab_General" },
        children: [
          {
            path: "general",
            name: "CustomersDetailsTab_General",
            component: () => import("../views/CustomersDetailsTab_General.vue"),
          },
          {
            path: "orders",
            name: "CustomersDetailsTab_Orders",
            component: () => import("../views/CustomersDetailsTab_Orders.vue"),
          },
          {
            path: "options",
            name: "CustomersDetailsTab_Options",
            component: () => import("../views/CustomersDetailsTab_Options.vue"),
          },
        ],
      },

      {
        name: "CustomersEdit",
        path: ":customerId/edit",
        props: (route) => ({ customerId: Number(route.params.customerId) }),
        component: () => import("../views/CustomersEditView.vue"),
      },
    ],
  },
];
