const AccessRightsEnum = Object.freeze({
  User: "user",
  Admin: "admin",
  Sysadmin: "sysadmin",
  Upload: "upload",
  ProfileEdit: "profile.edit",
  Operations: "operations",
  Acquiring: "acquiring",
  CustomersView: "customers.view",
  CustomersEdit: "customers.edit",
  GoodsView: "goods.view",
  GoodsEdit: "goods.edit",
  OrdersView: "orders.view",
  OrdersEdit: "orders.edit",
  OrdersForward: "orders.forward",
  OrdersRevert: "orders.revert",
  OrdersCancel: "orders.cancel",
  PaymentsDeposit: "payments.deposit",
  PaymentsRefund: "payments.refund",
  Reports: "reports",
});

export default AccessRightsEnum;
