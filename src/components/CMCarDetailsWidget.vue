<template>
  <table class="ui very compact small celled unstackable table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="4" class="ui center aligned">
          <CMLinkCar :car-id="car.id" />
          АВТОМОБИЛЬ ({{ car.id }})
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td colspan="1" class="gray_bg">Статус</td>
        <td colspan="1">
          <CMCarStatusBadge :value="car.ref_car_status" />
        </td>
        <td colspan="1" class="gray_bg">Филиал</td>
        <td colspan="1">{{ car.branch }}</td>
      </tr>
      <tr>
        <td colspan="1" class="gray_bg">Юр. лицо</td>
        <td colspan="1">{{ car.company }}</td>
        <td colspan="1" class="gray_bg">Инвестор</td>
        <td colspan="1">{{ car.investor }}</td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="1" class="gray_bg">Цена продажи</td>
        <td colspan="1">{{ $filters.money2(car.price) }} &#8381;</td>
        <td colspan="1" class="gray_bg">Цена закупки</td>
        <td>{{ $filters.money2(car.purchase_price) }} &#8381;</td>
      </tr>
      <tr>
        <td colspan="1" class="gray_bg">Цена аренды</td>
        <td colspan="1">
          <template v-if="car.rent_price">{{ $filters.money2(car.rent_price) }} &#8381;</template>
        </td>
        <td colspan="1" class="gray_bg"></td>
        <td></td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td class="gray_bg">Марка</td>
        <td>{{ car.brand }} {{ car.model }} {{ car.year_of_issue }}</td>
        <td class="gray_bg">Гос. номер</td>
        <td><CMCarPlate v-if="car.plate_number" :value="car.plate_number" /><span v-else>&mdash;</span></td>
      </tr>
      <tr>
        <td class="gray_bg">Пробег</td>
        <td>
          <!--  {{ $filters.number(car.mileage ) }} -->
          <span v-if="car.mileage_last"
            >{{ $filters.number(car.mileage_first) }}&mdash;{{ $filters.number(car.mileage_last) }}</span
          >
        </td>
        <td class="gray_bg">Цвет</td>
        <td>{{ car.color }}</td>
      </tr>
      <tr>
        <td class="gray_bg">Номер кузова</td>
        <td :class="validateFrameNo">{{ $filters.vin(car.frame_no) }}</td>
        <td class="gray_bg">Номер двигателя</td>
        <td>{{ car.engine_no }}</td>
      </tr>
      <tr>
        <td class="gray_bg">VIN</td>
        <td :class="validateVin">{{ $filters.vin(car.vin) }}</td>
        <td class="gray_bg">Номер рамы</td>
        <td :class="validateChassisNo">{{ $filters.vin(car.chassis_no) }}</td>
      </tr>
      <tr>
        <td class="gray_bg">Категория ТС</td>
        <td>{{ car.vehicle_category }}</td>
        <td class="gray_bg">Тип ТС</td>
        <td>{{ car.vehicle_type }}</td>
      </tr>
      <tr>
        <td colspan="1" class="gray_bg">Производитель</td>
        <td colspan="3">{{ car.manufacturer }}</td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td class="gray_bg">Номер ПТС</td>
        <td>{{ $filters.pts(car.pts_no) }}</td>
        <td class="gray_bg">Номер СТС</td>
        <td style="white-space: nowrap">
          <span v-html="$filters.ctc(car.svid_no, true)"></span>
          &nbsp;
          <CMGibddSyncBadge :value="car.gibdd_valid_number" />
        </td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="1" class="gray_bg">Страховая компания</td>
        <td colspan="3">{{ car.insurence_company }}</td>
      </tr>
      <tr>
        <td class="gray_bg">Номер страх. свид.</td>
        <td>{{ car.insurence_police_no }}</td>
        <td class="gray_bg">Срок страхования</td>
        <td>{{ $filters.date(car.insurence_date, 0) }}</td>
      </tr>
      <tr>
        <td colspan="1" class="gray_bg">Номер диагн. карты</td>
        <td colspan="3">{{ car.diag_card_no }}</td>
      </tr>
      <tr>
        <td class="gray_bg">Дата выдачи</td>
        <td>{{ $filters.date(car.diag_card_issue_date, 0) }}</td>
        <td class="gray_bg">Срок действия до</td>
        <td>{{ $filters.date(car.diag_card_valid_date, 0) }}</td>
      </tr>
      <tr>
        <td v-if="car.notes" colspan="4">
          <i class="exclamation icon"></i>
          {{ car.notes }}
        </td>
        <td v-else colspan="4">Нет заметок</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import apiService from "@/services/api.service.js";

import CMCarStatusBadge from "@/components/CMCarStatusBadge.vue";
import CMLinkCar from "@/components/CMLinkCar.vue";
import CMCarPlate from "@/components/CMCarPlate.vue";
import CMGibddSyncBadge from "@/components/CMGibddSyncBadge.vue";

import { vin_regx, frame_regx } from "@/utils/regexps";

export default {
  name: "CMCarDetailsWidget",

  components: {
    CMCarStatusBadge,
    CMLinkCar,
    CMCarPlate,
    CMGibddSyncBadge,
  },

  props: {
    carId: {
      type: Number,
    },
  },

  data() {
    return {
      car: {},
      isLoading: false,
    };
  },

  computed: {
    validateVin() {
      if (this.car.vin === null) return;

      var check = vin_regx.test(this.car.vin);
      return check ? "" : "error";
    },
    validateFrameNo() {
      if (this.car.frame_no === null) return;

      var check = frame_regx.test(this.car.frame_no);
      return check ? "" : "error";
    },
    validateChassisNo() {
      if (this.car.chassis_no === null) return;

      var check = vin_regx.test(this.car.chassis_no);
      return check ? "" : "error";
    },
  },

  mounted() {
    if (this.carId !== undefined) {
      this.fetchItem(this.carId);
    }
  },

  methods: {
    async fetchItem(carId) {
      this.isLoading = true;
      try {
        let result = await apiService.getCar(carId);
        this.car = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
