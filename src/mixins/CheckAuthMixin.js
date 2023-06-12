import { AccessRightsEnum } from "@/enums/index";

export const CheckAuthMixin = {
  computed: {
    // Customers
    checkAuthNewCustomer() {
      return this.checkAuthRole(AccessRightsEnum.CustomersEdit);
    },
    checkAuthEditCustomer() {
      return this.checkAuthRole(AccessRightsEnum.CustomersEdit);
    },
    // Goods
    checkAuthNewGood() {
      return this.checkAuthRole(AccessRightsEnum.GoodsEdit);
    },
    checkAuthEditGood() {
      return this.checkAuthRole(AccessRightsEnum.GoodsEdit);
    },
    // Orders
    checkAuthNewOrder() {
      return this.checkAuthRole(AccessRightsEnum.OrdersEdit);
    },
    checkAuthEditOrder() {
      return this.checkAuthRole(AccessRightsEnum.OrdersEdit);
    },
    checkAuthCancelOrder() {
      return this.checkAuthRole(AccessRightsEnum.OrdersCancel);
    },
    checkAuthRevertOrder() {
      return this.checkAuthRole(AccessRightsEnum.OrdersRevert);
    },
    checkAuthForwardOrder() {
      return this.checkAuthRole(AccessRightsEnum.OrdersForward);
    },
    checkAuthPaymentsDeposit() {
      return this.checkAuthRole(AccessRightsEnum.PaymentsDeposit);
    },
    checkAuthPaymentsRefund() {
      return this.checkAuthRole(AccessRightsEnum.PaymentsRefund);
    },
    checkAuthPaymentsAcquiring() {
      return this.checkAuthRole(AccessRightsEnum.Acquiring);
    },
  },
  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
  },
};
