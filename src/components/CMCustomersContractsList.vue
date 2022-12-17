<template>
  <div>
    <UITable
      :headers="headers"
      :count="leasingContracts.length + rentContracts.length"
      :loading="isLoading"
      :empty-text="emptyText"
    >
      <!-- Lease -->
      <tr v-for="item in leasingContracts" :key="item.id" :item="item" @click="handleDetails(item)">
        <td>{{ item.id }}</td>
        <td>
          <CMContractStatus :value="item.status" />
          № {{ item.contract_number }} от {{ $filters.date(item.contract_date) }}
        </td>
        <td v-if="customer_id">
          {{ item.car }}
          <CMLinkCar :car-id="item.car_id" />
        </td>
        <td v-if="customer_id">{{ $filters.money(item.car_price) }}</td>
        <td v-if="car_id">Выкуп</td>
        <td v-if="car_id">
          {{ item.fio }}
          <CMLinkCustomer :customer-id="item.customer_id" />
        </td>
      </tr>
      <!-- Rent -->
      <tr v-for="item in rentContracts" :key="item.id" :item="item" @click="handleRentDetails(item)">
        <td>{{ item.id }}</td>
        <td>
          <CMRentContractStatus :value="item.status" />
          № {{ item.contract_number }} от {{ $filters.date(item.contract_date) }}
        </td>
        <td v-if="customer_id">
          {{ item.car }}
          <CMLinkCar :car-id="item.car_id" />
        </td>
        <td v-if="customer_id">{{ $filters.money(item.car_price) }}</td>
        <td v-if="car_id">Аренда</td>
        <td v-if="car_id">
          {{ item.fio }}
          <CMLinkCustomer :customer-id="item.customer_id" />
        </td>
      </tr>
    </UITable>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITable from "@/components/UITable.vue";
import CMContractStatus from "@/components/CMContractStatus.vue";
import CMRentContractStatus from "@/components/CMRentContractStatus.vue";
import CMLinkCar from "@/components/CMLinkCar.vue";
import CMLinkCustomer from "@/components/CMLinkCustomer.vue";

export default {
  name: "CMCustomersContractsList",
  components: {
    UITable,
    CMContractStatus,
    CMRentContractStatus,
    CMLinkCar,
    CMLinkCustomer,
  },
  props: {
    customer_id: {
      type: Number,
    },
    car_id: {
      type: Number,
    },
  },
  data() {
    return {
      leasingContracts: [],
      rentContracts: [],
      isLoading: false,
    };
  },
  computed: {
    headers() {
      if (this.customer_id > 0) {
        return ["No.", "Договор", "Автомобиль", "Стоимость"];
      } else if (this.car_id > 0) {
        return ["No.", "Договор", "Тип", "Клиент"];
      } else {
        return [];
      }
    },
    emptyText() {
      if (this.customer_id > 0) {
        return "Нет договоров у данного клиента";
      } else if (this.car_id > 0) {
        return "Нет договоров с данным автомобилем";
      } else {
        return "";
      }
    },
  },
  watch: {
    customer_id: {
      immediate: true,
      handler(newValue) {
        if (newValue != null) {
          this.refetch();
        }
      },
    },
    car_id: {
      immediate: true,
      handler(newValue) {
        if (newValue != null) {
          this.refetch();
        }
      },
    },
  },
  methods: {
    handleDetails(item) {
      console.log("details clicked: " + item.id);
      this.$router.push({
        name: "contract_details",
        params: { id: item.id },
      });
    },
    handleRentDetails(item) {
      console.log("details clicked: " + item.id);
      this.$router.push({
        name: "contract_rent_details",
        params: { id: item.id },
      });
    },
    async refetch() {
      this.isLoading = true;
      try {
        if (this.customer_id != null) {
          this.leasingContracts = await apiService.getContractsForCustomer(
            this.customer_id,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
          );
        } else if (this.car_id != null) {
          this.leasingContracts = await apiService.getContractsForCar(
            this.car_id,
            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
          );
          this.rentContracts = await apiService.getRentContractsForCar(this.car_id, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        }
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
  // mounted() {
  //   if (this.customer_id != null || this.car_id != null) {
  //     this.refetch();
  //   }
  // },
};
</script>
