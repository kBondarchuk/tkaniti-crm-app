export const navigation = (router) => {
  return {
    Login: (replace = false) => {
      router.push({ name: "Login", replace: replace });
    },

    Logoff: (replace = false) => {
      router.push({ name: "Logoff", replace: replace });
    },

    Home: (replace = false) => {
      router.push({ name: "Home", replace: replace });
    },

    Reports: (replace = false) => {
      router.push({ name: "Reports", replace: replace });
    },

    Prefs: {
      Pages: ({ pageId } = {}, replace = false) => {
        router.push({ name: "PrefsPages", params: { pageId }, replace: replace });
      },
    },

    Operations: (replace = false) => {
      router.push({ name: "Operations", replace: replace });
    },

    Payments: {
      List: (replace = false) => {
        router.push({ name: "PaymentsList", replace: replace });
      },

      Details: ({ invoiceId } = {}, replace = false) => {
        router.push({ name: "PaymentsDetails", params: { invoiceId }, replace: replace });
      },
    },
    Orders: {
      List: (replace = false) => {
        router.push({ name: "OrdersList", replace: replace });
      },

      New: (replace = false) => {
        router.push({ name: "OrdersNew", replace: replace });
      },

      Details: ({ orderId } = {}, replace = false) => {
        router.push({ name: "OrdersDetails", params: { orderId }, replace: replace });
      },

      Edit: ({ goodId } = {}, replace = false) => {
        router.push({ name: "OrdersEdit", params: { goodId }, replace: replace });
      },
    },
    Goods: {
      List: (replace = false) => {
        router.push({ name: "GoodsList", replace: replace });
      },

      New: (replace = false) => {
        router.push({ name: "GoodsNew", replace: replace });
      },

      Details: ({ goodId } = {}, replace = false) => {
        router.push({ name: "GoodsDetails", params: { goodId }, replace: replace });
      },

      Edit: ({ goodId } = {}, replace = false) => {
        router.push({ name: "GoodsEdit", params: { goodId }, replace: replace });
      },
    },
    Customers: {
      List: (replace = false) => {
        router.push({ name: "CustomersList", replace: replace });
      },

      New: (replace = false) => {
        router.push({ name: "CustomersNew", replace: replace });
      },

      Details: ({ customerId } = {}, replace = false) => {
        router.push({ name: "CustomersDetails", params: { customerId }, replace: replace });
      },

      Edit: ({ customerId } = {}, replace = false) => {
        router.push({ name: "CustomersEdit", params: { customerId }, replace: replace });
      },
    },
  };
};
