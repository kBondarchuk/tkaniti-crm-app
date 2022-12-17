<template>
  <div>
    <table class="ui very compact small definition two column table" :class="{ loading: isLoading }">
      <!-- <thead>
        <tr>
          <th colspan="2">Детализация автомобиля ({{car.id}})</th>
        </tr>
      </thead>-->
      <tbody>
        <tr>
          <td>Статус</td>
          <td>
            <!-- <CMCarStatusBadge :value="car.ref_car_status" /> -->
          </td>
        </tr>
        <tr>
          <td>Инвестор</td>
          <td>{{ car.investor }}</td>
        </tr>
        <tr>
          <td>Филиал</td>
          <td>{{ car.branch }}</td>
        </tr>
        <tr>
          <td>Юр. лицо</td>
          <td>{{ car.company }}</td>
        </tr>
      </tbody>
    </table>
    <!--  -->

    <table class="ui very compact small definition two column table" :class="{ loading: isLoading }">
      <tbody>
        <tr>
          <td>Цена продажи</td>
          <td>
            <strong>{{ $filters.money2(car.price) }}</strong>
          </td>
        </tr>
        <tr>
          <td>Цена закупки</td>
          <td>{{ $filters.money2(car.purchase_price) }}</td>
        </tr>
        <tr>
          <td>Цена аренды</td>
          <td>{{ $filters.money2(car.rent_price) }}</td>
        </tr>
      </tbody>
    </table>
    <!--  -->
    <table class="ui very compact small definition two column table" :class="{ loading: isLoading }">
      <!-- <thead>
        <tr>
          <th colspan="2">Детализация автомобиля ({{car.id}})</th>
        </tr>
      </thead>-->
      <tbody>
        <tr>
          <td>Марка</td>
          <td>{{ car.brand }}</td>
        </tr>
        <tr>
          <td>Модель</td>
          <td>{{ car.model }}</td>
        </tr>
        <tr>
          <td>Год выпуска</td>
          <td>{{ car.year_of_issue }}</td>
        </tr>
        <tr>
          <td>Пробег</td>
          <td>
            {{ $filters.number(car.mileage) }}
            <span v-if="car.mileage_last" class="text-color-grey"
              >({{ $filters.number(car.mileage_first) }}&mdash;{{ $filters.number(car.mileage_last) }})</span
            >
          </td>
        </tr>
        <tr>
          <td>Гос. номер</td>
          <td><CMCarPlate :value="car.plate_number" /></td>
        </tr>
        <tr>
          <td>Цвет</td>
          <td>{{ car.color }}</td>
        </tr>
        <tr>
          <td>Номер кузова</td>
          <td :class="validateFrameNo">{{ $filters.vin(car.frame_no) }}</td>
        </tr>
        <tr>
          <td>Номер двигателя</td>
          <td>{{ car.engine_no }}</td>
        </tr>
        <tr>
          <td>VIN</td>
          <td :class="validateVin">{{ $filters.vin(car.vin) }}</td>
        </tr>
        <tr>
          <td>Номер рамы</td>
          <td :class="validateChassisNo">{{ $filters.vin(car.chassis_no) }}</td>
        </tr>
        <tr>
          <td>Категория ТС</td>
          <td>{{ car.vehicle_category }}</td>
        </tr>
        <tr>
          <td>Тип ТС</td>
          <td>{{ car.vehicle_type }}</td>
        </tr>
        <tr>
          <td>Производитель (Страна)</td>
          <td>{{ car.manufacturer }}</td>
        </tr>
        <tr>
          <td>Номер ПТС</td>
          <td>{{ $filters.pts(car.pts_no) }}</td>
        </tr>
        <tr>
          <td>Номер свидетельства ТС</td>
          <td style="white-space: nowrap">
            <span class="nobr" v-html="$filters.ctc(car.svid_no, true)"></span>
            &nbsp;
            <CMGibddSyncBadge :value="car.gibdd_valid_number" />
          </td>
        </tr>
      </tbody>
    </table>

    <table class="ui very compact small definition two column table" :class="{ loading: isLoading }">
      <tbody>
        <tr>
          <td>Страховая компания</td>
          <td>{{ car.insurence_company }}</td>
        </tr>
        <tr>
          <td>Номер страхового свидетельства</td>
          <td>{{ car.insurence_police_no }}</td>
        </tr>
        <tr>
          <td>Срок страхования</td>
          <td>{{ $filters.date(car.insurence_date, 0) }}</td>
        </tr>
        <tr>
          <td>Номер диагностической карты</td>
          <td>{{ car.diag_card_no }}</td>
        </tr>
        <tr>
          <td>Дата выдачи</td>
          <td>{{ $filters.date(car.diag_card_issue_date, 0) }}</td>
        </tr>
        <tr>
          <td>Срок действия до</td>
          <td>{{ $filters.date(car.diag_card_valid_date, 0) }}</td>
        </tr>
      </tbody>
    </table>
    <table class="ui very compact small table" :class="{ loading: isLoading }">
      <tbody>
        <tr>
          <td v-if="car.notes" colspan="2">
            <i class="exclamation icon"></i>
            {{ car.notes }}
          </td>
          <td v-else colspan="2">Нет заметок</td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="ui segment" v-if="car.notes">
      <h4 class="ui header">Заметки</h4>
      <p>{{ car.notes }}</p>
    </div>-->
  </div>
</template>

<script>
import CMCarStatusBadge from "@/components/CMCarStatusBadge.vue";
import CMCarPlate from "@/components/CMCarPlate.vue";
import CMGibddSyncBadge from "@/components/CMGibddSyncBadge.vue";

import { vin_regx, frame_regx } from "@/utils/regexps";

export default {
  name: "CMCarDetails",

  components: {
    CMCarStatusBadge,
    CMCarPlate,
    CMGibddSyncBadge,
  },

  props: {
    car: {
      type: Object,
    },
  },

  data() {
    return {
      // car: {},
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
};
</script>

<style scoped>
/* .ui.definition.table tr td.definition,
.ui.definition.table tr td:first-child:not(.ignored) {
  background-color: #f9fafb;
  font-weight: 500;
} */
</style>
