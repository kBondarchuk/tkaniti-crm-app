<template>
  <tr @click="$emit('eventDetails', item.id)">
    <!-- 1 -->
    <td class="right aligned">{{ item.id }}</td>
    <!-- 2 -->
    <td>
      <CMContractStatus :value="item.status" />
    </td>
    <!-- 3 -->
    <td v-if="showStatusDate">{{ $filters.date(item.closing_date) }}</td>
    <!-- 4 -->
    <td>{{ item.contract_number }} от {{ $filters.date(item.contract_date) }}</td>
    <!-- 5 -->
    <td style="white-space: nowrap" colspan="2">
      <!--  -->
      <div style="margin-bottom: 0.2em" :class="{ 'text-bold': sortBy == 'car' }">
        <CMLinkCar :car-id="item.car_id" :warnings="item.car_warnings" />
        {{ item.car }}
      </div>

      <div :class="{ 'text-bold': sortBy == 'fio' }">
        <CMLinkCustomer :customer-id="item.customer_id" />
        {{ item.fio }}
      </div>
    </td>
    <!-- 6 -->
    <!-- <td :class="{ warning: item.car_warnings > 0 }">
      <CMLinkCar :car-id="item.car_id" :warnings="item.car_warnings" />
      {{ item.car }}
    </td> -->
    <!-- 7 -->
    <td class="center aligned">
      <!-- <i class="red camera icon" title="Фото-отчёт отсутствует" v-if="item.photo_report_status === null"></i> -->
      <a click.stop="go(item.car_id)">
        <i
          v-if="item.photo_report_status !== null && item.photo_report_status < 5"
          class="orange camera icon grow"
          :title="'Фото-отчёт загружен. \nУтверждено ' + item.photo_report_status + ' снимков'"
        ></i>
        <i v-if="item.photo_report_status == 5" class="green camera icon grow" title="Фото-отчёт утверждён"></i>
      </a>
    </td>
    <!--  -->
    <td colspan="2">
      <span :class="{ 'text-bold': sortBy == 'branch' }">{{ item.branch }} </span><br />
      <span :class="{ 'text-bold': sortBy == 'city' }">
        {{ item.city }}
      </span>
    </td>
    <!-- <td>{{ item.branch }}</td> -->
    <!-- <td>{{ item.investor }}</td> -->
    <UIMoneyCell :value="item.contract_total_payout" />
    <UIMoneyCell :value="item.daily_payment" />
    <UIMoneyCell :value="item.balance" colored style="font-weight: bold" />
    <!-- <CMToggleOnlinePayCell :contract-id="item.id" :checked="item.option_online_pay" /> -->
    <td class="right aligned" style="padding-right: 1em" @click.stop>
      <!-- <div style="text-align: right"> -->
      <CMCheckboxContractOption
        id="option_online_pay"
        title="Онлайн оплата"
        style="margin-bottom: -4px; margin-top: -4px"
        option="online_pay"
        :contract-id="item.id"
        :checked="item.option_online_pay"
      />
      <CMCheckboxContractOption
        id="option_car_fines_pay"
        title="Оплачивать штрафы"
        style="margin-bottom: -4px; margin-top: -4px"
        option="car_fines_pay"
        :contract-id="item.id"
        :checked="item.option_car_fines_pay"
      />
      <!-- </div> -->
    </td>
  </tr>
</template>

<script>
import CMContractStatus from "@/components/CMContractStatus.vue";
import CMLinkCar from "@/components/CMLinkCar.vue";
import CMLinkCustomer from "@/components/CMLinkCustomer.vue";
// import CMToggleOnlinePayCell from "@/components/CMToggleOnlinePayCell.vue";
import CMCheckboxContractOption from "@/components/CMCheckboxContractOption.vue";

export default {
  name: "CMContractsListItem",

  components: {
    CMContractStatus,
    CMLinkCar,
    CMLinkCustomer,
    // CMToggleOnlinePayCell,
    CMCheckboxContractOption,
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
    showStatusDate: {
      type: Boolean,
    },
    sortBy: {
      type: String,
      default: null,
    },
  },

  emits: ["eventDetails"],

  methods: {
    go(car_id) {
      // "'/cars/' + item.car_id + '/photo_reports'
      this.$router.push({
        name: "cars_details_photo_reports",
        params: { id: car_id },
      });
    },
  },
  //
};
</script>
