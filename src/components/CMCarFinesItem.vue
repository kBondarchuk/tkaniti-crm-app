<template>
  <tr @click="$emit('eventDetails', item)">
    <td>{{ item.id }}</td>
    <td v-if="!hideCarColumn">
      <CMLinkCar :car-id="item.car_id" path="cars_details_car_fines" />
      {{ item.car }}
      <i class="search grey grow icon" title="Фильтр по автомобилю" @click.stop="$emit('filterCar', item.car_id)"></i>
    </td>
    <td>{{ item.decree_number }}</td>
    <td>{{ $filters.date(item.decree_date, false) }}</td>
    <UIMoneyCell :value="item.payed_amount ?? item.amount" class="text-bold" />
    <td><CMFinePayStatus :payed="item.payed && item.payed_amount ? item.payed : item.payed ? 3 : item.payed" /></td>
    <td><CMFineChargeStatus :charged="item.charged" /></td>
    <td>{{ $filters.date(item.offense_datetime, 0) }}</td>
    <td @click.stop>
      <a v-if="item.contract_id" @click.stop="linkToContract(item.contract_id)">{{ item.contract_id }}</a>
      <a v-else-if="item.rent_contract_id" @click.stop="linkToRentContract(item.rent_contract_id)">
        A{{ item.rent_contract_id }}
      </a>
      <!-- {{ item.contract_status }} -->
    </td>
    <!-- <td>{{ item.user }}</td> -->
    <!-- <td>{{$filters.date(item.gibdd_updated_ts )}}</td> -->
    <td>{{ $filters.date(item.created_dt) }}</td>
  </tr>
</template>

<script>
import CMLinkCar from "@/components/CMLinkCar.vue";
import CMFinePayStatus from "@/components/CMFinePayStatus.vue";
import CMFineChargeStatus from "@/components/CMFineChargeStatus.vue";

export default {
  name: "CMCarFinesItem",

  components: {
    CMLinkCar,
    CMFinePayStatus,
    CMFineChargeStatus,
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
    hideCarColumn: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["filterCar", "eventDetails"],

  methods: {
    linkToContract(id) {
      this.$router.push({
        name: "contract_details",
        params: { id: id },
      });
    },
    linkToRentContract(id) {
      this.$router.push({
        name: "contract_rent_details",
        params: { id: id },
      });
    },
  },
};
</script>
