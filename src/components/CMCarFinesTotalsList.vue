<template>
  <UITableList
    id="CMCarFinesTotalsList"
    title="Неоплаченные штрафы ГИБДД"
    bordered
    hide-paging
    :columns-count="3"
    :items-count="items.length"
    :is-loading="isLoading"
    :empty-text="emptyText"
  >
    <tr
      v-for="item in items"
      :key="item.name"
      :class="{ 'text-bold': item.name == 'all_unpaid' }"
      @click="handleDetails(item)"
    >
      <td class="">{{ names[item.name] }}</td>
      <td class="">{{ item.count }} шт.</td>
      <td class="right aligned"><UIMoney :value="item.sum" rub /></td>
    </tr>
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITableList from "@/components/UITableList.vue";

export default {
  name: "CMCarFinesTotalsList",

  components: {
    UITableList,
  },

  props: {
    general: {
      type: Boolean,
      default: false,
    },
    contractId: {
      type: Number,
      default: null,
    },
    rentContractId: {
      type: Number,
      default: null,
    },
    carId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      items: [],
      isLoading: false,
      names: {
        discount: "Со скидкой",
        no_discount: "Без скидки",
        expired: "Просроченные",
        all_unpaid: "Все неоплаченные",
      },
    };
  },

  computed: {
    headers() {
      return [];
    },
    emptyText() {
      return "Нет информации";
    },
  },

  watch: {
    carId: {
      // immediate: true,
      handler() {
        this.refetch();
      },
    },
    contractId: {
      // immediate: true,
      handler() {
        this.refetch();
      },
    },
  },

  mounted() {
    this.refetch();
  },

  methods: {
    handleDetails(item) {
      console.log("details clicked: " + item.name);

      // Discount
      if (item.name == "discount") {
        this.$router.push({
          name: "car_fines",
          query: { terms: 1, payed: 0, car_id: this.carId },
        });
      }

      // No Discount
      if (item.name == "no_discount") {
        this.$router.push({
          name: "car_fines",
          query: { terms: 0, payed: 0, car_id: this.carId },
        });
      }

      // Expired
      if (item.name == "expired") {
        this.$router.push({
          name: "car_fines",
          query: { terms: 2, payed: 0, car_id: this.carId },
        });
      }
    },

    refetch() {
      // console.log(">>>", this.general, "-", this.carId, " - ", this.contractId);

      if (this.contractId > 0) {
        this.refetchForContract(this.contractId);
      } else if (this.rentContractId > 0) {
        this.refetchForRentContract(this.rentContractId);
      } else if (this.carId > 0) {
        this.refetchForCar(this.carId);
      } else if (this.general) {
        this.refetchTotals();
      }
    },
    // Network
    async refetchTotals() {
      this.isLoading = true;

      try {
        this.items = await apiService.getCarFinesTotals();
        // console.log(this.items);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async refetchForContract(contract_id) {
      this.isLoading = true;

      try {
        this.items = await apiService.getCarFinesTotalsForContracts(contract_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async refetchForRentContract(rent_contract_id) {
      this.isLoading = true;

      try {
        this.items = await apiService.getCarFinesTotalsForRentContracts(rent_contract_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async refetchForCar(car_id) {
      this.isLoading = true;

      try {
        this.items = await apiService.getCarFinesTotalsForCar(car_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
