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

<script setup>
// name: "TKOrderDetailsTabGeneral",

import { ref, computed } from "vue";

import { useNavigation } from "@/composables/navigation";
import { useCheckAuth } from "@/composables/checkAuth";

import AccessRights from "@/enums/AccessRights";

import TKOrderDetails from "@/components/TKOrderDetails.vue";
import TKOrderBasket from "@/components/TKOrderBasket.vue";

/// PROPS

const props = defineProps({
  order: {
    type: Object,
    default: null,
  },
});

/// SETUP

const { checkAuthRole } = useCheckAuth();
const { navigateTo } = useNavigation();

/// COMPUTED

const checkAuthEditOrder = computed(() => {
  return checkAuthRole(AccessRights.OrdersEdit);
});

const validateEdit = computed(() => {
  // FIXME: order?.status.fixed - это временная затычка
  return checkAuthEditOrder.value && (props.order?.status.editable == 1 || props.order?.status.fixed == 1);
});

/// FUNCTIONS

function edit() {
  navigateTo.Orders.Edit({ goodId: props.order.id });
}
</script>
