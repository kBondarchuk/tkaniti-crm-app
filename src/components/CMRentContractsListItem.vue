<template>
  <tr @click="$emit('eventDetails', item.id)">
    <td class="right aligned">{{ item.id }}</td>
    <td class="center aligned">
      <CMRentContractStatus :value="item.status" />
    </td>
    <td>{{ item.contract_number }} от {{ $filters.date(item.contract_date) }}</td>
    <td style="white-space: nowrap">
      <CMLinkCustomer :customer-id="item.customer_id" />
      {{ item.fio }}
    </td>
    <td>
      <CMLinkCar :car-id="item.car_id" :warnings="item.car_warnings" />
      {{ item.car }}
    </td>
    <td>{{ item.city }}</td>
    <td>{{ item.branch }}</td>
    <UIMoneyCell :value="item.daily_payment" />
    <UIMoneyCell :value="item.current_debt" />
    <UIMoneyCell :value="item.pledge_balance" />
    <UIMoneyCell :value="item.balance" colored />
    <td class="right aligned" :class="{ negative: item.prepayed_days <= 0, positive: item.prepayed_days > 0 }">
      {{ item.prepayed_days }}
    </td>
  </tr>
</template>

<script>
// import apiService from "@/services/api.service.js";

import CMRentContractStatus from "@/components/CMRentContractStatus.vue";
// import CMWarningBadge from "@/components/CMWarningBadge.vue";
import CMLinkCar from "@/components/CMLinkCar.vue";
import CMLinkCustomer from "@/components/CMLinkCustomer.vue";

export default {
  name: "CMRentContractsListItem",
  components: {
    CMRentContractStatus,
    // CMWarningBadge,
    CMLinkCar,
    CMLinkCustomer,
  },
  props: {
    item: {
      type: Object,
      default: null,
    },
  },
  emits: ["eventDetails"],
  methods: {
    toggleOption(contractId) {
      console.log("toggle", event);
      if (document.getElementById("toggle-" + contractId).checked) {
        // set to 1
        this.fetchSetOption(contractId, 1);
      } else {
        // set to 0
        this.fetchSetOption(contractId, 0);
      }
    },
    setLoading(elementId) {
      var element = document.getElementById(elementId).parentElement;
      element.classList.add("loading");
    },
    resetLoading(elementId) {
      var element = document.getElementById(elementId).parentElement;
      element.classList.remove("loading");
    },
    // Network
    async fetchSetOption(contractId, value) {
      this.setLoading("toggle-" + contractId);
      console.log(value);

      // try {
      //   let result = await apiService.setContractOptions(contractId, value);
      //   console.log(result);
      // } catch (error) {
      //   this.$UIService.showNetworkError(error);
      // }
      this.resetLoading("toggle-" + contractId);
    },
  },
};
</script>
