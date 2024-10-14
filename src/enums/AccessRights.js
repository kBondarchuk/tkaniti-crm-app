const AccessRights = Object.freeze({
  User: "user",
  Admin: "admin",
  Sysadmin: "sysadmin",
  Upload: "upload",
  ProfileEdit: "profile.edit",
  Operations: "operations",
  Acquiring: "acquiring",
  Customers: {
    View: "customers.view",
    Edit: "customers.edit",
  },
  GoodsView: "goods.view",
  GoodsEdit: "goods.edit",
  OrdersView: "orders.view",
  OrdersEdit: "orders.edit",
  OrdersForward: "orders.forward",
  OrdersRevert: "orders.revert",
  OrdersCancel: "orders.cancel",
  PaymentsDeposit: "payments.deposit",
  PaymentsRefund: "payments.refund",
  Reports: {
    Access: "reports",
    Finances: "reports.finances",
    Logistics: "reports.logistics",
  },
});

export default AccessRights;
