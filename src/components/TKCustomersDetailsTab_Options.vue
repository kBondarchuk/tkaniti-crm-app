<template>
  <div style="margin-left: 1em; padding-top: 1em">
    <!--  -->
    <UICheckbox
      id="optionSkip"
      v-model="optionSkip"
      label="Пропускать проверку заказов"
      style="margin-bottom: 1em"
      :disabled="isLoading"
      @update:model-value="(value) => changedOption('skip_order_confirm', value)"
    />
    <br />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import Alerts from "@/utils/alerts";
import apiService from "@/services/api.service.js";

// Name: "TKCustomersDetailsTabOptions",

/// PROPS

const props = defineProps({
  customer: {
    type: Object,
    default: () => {},
  },
});

/// EMITS

const emit = defineEmits(["update"]);

/// DATA

const optionSkip = ref(false);
const isLoading = ref(false);

/// WATCHERS

watch(
  () => props.customer?.options,
  (options) => {
    console.warn("watch:", options);
    if (options) {
      optionSkip.value = options.skip_order_confirm;
    }
  },
  { immediate: true }
);

/// FUNCTIONS

function changedOption(optionName, optionValue) {
  console.log("Changed option: ", optionName, optionValue);

  updateOption(optionName, optionValue);
}

// Network
async function updateOption(optionName, optionValue) {
  isLoading.value = true;
  try {
    await apiService.setCustomerOption(props.customer.id, optionName, optionValue);
    emit("update");
  } catch (error) {
    Alerts.showNetworkError(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
