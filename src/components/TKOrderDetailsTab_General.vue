<template>
  <div>
    <!-- Toolbar -->
    <div class="ui-tool-bar-local">
      <UISpacer />
      <!-- Edit -->
      <UIButton type="basic labeled" text="Изменить" icon="edit" :class="{ disabled: !validateEdit }" @click="edit" />
    </div>
    <div class="ui divider"></div>

    <!-- Grid -->
    <LayoutTwoColumns>
      <!-- First column -->
      <TKOrderDetails :order="order" :is-loading="order == null" />
      <!-- Second column -->
      <template #second>
        <TKOrderBasket :order="order" />
      </template>
    </LayoutTwoColumns>
    <!--  -->
  </div>
</template>

<script>
import { useCheckAuth } from "@/composables/checkAuth";
import AccessRightsEnum from "@/enums/AccessRights";
import TKOrderDetails from "@/components/TKOrderDetails.vue";
import TKOrderBasket from "@/components/TKOrderBasket.vue";

// import UILayoutColumns from "@/components/UILayoutColumns.vue";

export default {
  name: "TKOrderDetailsTabGeneral",

  components: {
    TKOrderDetails,
    TKOrderBasket,
    // UILayoutColumns,
  },

  props: {
    order: {
      type: Object,
      default: null,
    },
  },

  setup() {
    const { checkAuthRole } = useCheckAuth();

    return { checkAuthRole };
  },

  computed: {
    checkAuthEditOrder() {
      return this.checkAuthRole(AccessRightsEnum.OrdersEdit);
    },
    validateEdit() {
      //
      // this.order?.status.fixed - это временная затычка
      return this.checkAuthEditOrder && (this.order?.status.editable == 1 || this.order?.status.fixed == 1);
    },
  },

  methods: {
    edit() {
      this.$router.push({ name: "order_edit" });
    },
  },
};
</script>
