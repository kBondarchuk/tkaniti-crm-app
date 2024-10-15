const Views = Object.freeze({
  Login: { path: "/login" },
  Logoff: { path: "/logoff" },
  Home: { path: "/", layout: "LayoutView" },
  // Notifications: { path: "/notifications", layout: "LayoutView" },
  // Preferences: { path: "/prefs", layout: "LayoutView" },

  Reports: { path: "/finances/reports", layout: "LayoutView" },

  Prefs: {
    path: "/prefs",
    layout: "LayoutView",

    children: {
      Pages: {
        path: ":pageId",
        props: {
          pageId: {
            type: String,
            from: "params",
          },
        },
      },
    },
  },

  // Reports: {
  //   path: "/finances",
  //   layout: "LayoutView",

  //   children: {
  //     Pages: {
  //       path: "reports/:pageId",
  //       props: {
  //         pageId: {
  //           type: String,
  //           from: "params",
  //         },
  //       },
  //     },
  //   },
  // },

  Operations: { path: "/finances/operations", layout: "LayoutView" },

  Payments: {
    path: "/payments",
    layout: "LayoutView",

    children: {
      List: { path: "", component: "Payments" },

      Details: {
        path: ":invoiceId",
        props: {
          invoiceId: {
            type: Number,
            from: "params",
          },
        },
      },
    },
  },

  Orders: {
    path: "/orders",
    layout: "LayoutView",

    children: {
      List: { path: "" },

      New: { path: "new", component: "OrdersEdit" },

      Details: {
        path: ":orderId",
        props: {
          orderId: {
            type: Number,
            from: "params",
          },
        },
        tabs: {
          General: "general",
          Operations: "operations",
          History: "history",
        },
      },

      Edit: {
        path: ":orderId/edit",
        props: {
          orderId: {
            type: Number,
            from: "params",
          },
        },
      },
    },
  },

  Goods: {
    path: "/goods",
    layout: "LayoutView",

    children: {
      List: { path: "" },

      New: { path: "new", component: "GoodsEdit" },

      Details: {
        path: ":goodId",
        component: "GoodsDetails",
        props: {
          goodId: {
            type: Number,
            from: "params",
          },
        },
        tabs: {
          General: "general",
          Photos: "photos",
          Videos: "videos",
          Orders: "orders",
          History: "history",
        },
      },

      Edit: {
        path: ":goodId/edit",
        props: {
          goodId: {
            type: Number,
            from: "params",
          },
        },
      },
    },
  },

  Customers: {
    path: "/customers",
    layout: "LayoutView",

    children: {
      List: { path: "" },

      New: { path: "new", component: "CustomersEdit" },

      Details: {
        path: ":customerId",
        props: {
          customerId: {
            type: Number,
            from: "params",
          },
        },
        tabs: {
          General: "general",
          Orders: "orders",
          Options: "options",
        },
      },

      Edit: {
        path: ":customerId/edit",
        props: {
          customerId: {
            type: Number,
            from: "params",
          },
        },
      },
    },
  },

  // EOF
});

export default Views;
