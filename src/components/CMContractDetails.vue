<template>
  <!-- Contract Details -->
  <div :class="{ loading: loading }">
    <table class="ui very compact small celled two column unstackable table">
      <tbody>
        <tr>
          <td>Номер договора</td>
          <td class="ui right aligned">
            {{ contract.contract_number }} от {{ $filters.date(contract.contract_date) }}
          </td>
        </tr>
        <tr>
          <td>Юр. лицо</td>
          <td class="ui right aligned">{{ contract.company }}</td>
        </tr>
        <tr>
          <td>Статус</td>
          <td class="ui right aligned">
            <CMContractStatus id="status" :value="contract.status" />
          </td>
        </tr>
        <tr>
          <td>Инвестор</td>
          <td id="investor_id" class="ui right aligned">{{ contract.investor }}</td>
        </tr>
        <tr>
          <td>Филиал</td>
          <td class="ui right aligned">{{ contract.branch }}</td>
        </tr>
        <!-- Пеня отключена на период	с 2019-07-22 по 2019-07-22 -->
        <tr v-if="contract.date_fine_begin">
          <td class="negative">Пеня отключена на период</td>
          <td class="ui right aligned negative">
            с {{ $filters.date(contract.date_fine_begin) }} по {{ $filters.date(contract.date_fine_end) }}
          </td>
        </tr>
      </tbody>
    </table>
    <table class="ui very compact small celled two column unstackable table">
      <tbody>
        <tr>
          <td>Начальная дата &ndash; Конечная дата</td>
          <td class="ui right aligned">
            {{ $filters.date(contract.date_opened) }} &mdash; {{ $filters.date(contract.contract_end_date) }}
          </td>
        </tr>
        <tr>
          <td>Длительность</td>
          <td class="ui right aligned">{{ contract.current_period }} из {{ contract.contract_days }} дней</td>
        </tr>
      </tbody>
    </table>
    <table class="ui very compact small celled two column unstackable table">
      <tbody>
        <tr>
          <td>Стоимость автомобиля</td>
          <td class="ui right aligned">{{ $filters.money(contract.car_price) }} &#8381;</td>
        </tr>
        <tr>
          <td>Первоначальный взнос</td>
          <td class="ui right aligned">{{ $filters.money(contract.down_payment) }} &#8381;</td>
        </tr>
        <tr>
          <td>Основной долг (без перв. взноса)</td>
          <td class="ui right aligned">{{ $filters.money(contract.contract_debt) }} &#8381;</td>
        </tr>
        <tr>
          <td>Сумма процентов</td>
          <td class="ui right aligned">{{ $filters.money(contract.contract_interest) }} &#8381;</td>
        </tr>
        <tr>
          <td>Сумма всех платежей</td>
          <td class="ui right aligned">{{ $filters.money(contract.contract_total_payout) }} &#8381;</td>
        </tr>
      </tbody>
    </table>
    <table class="ui very compact small celled two column unstackable table">
      <tbody>
        <tr>
          <td>Текущий дневной процент</td>
          <td class="ui right aligned">{{ contract.current_daily_percentage }}</td>
        </tr>
        <tr>
          <td>Текущий дневной платеж</td>
          <td class="ui right aligned">
            <strong>{{ $filters.money(contract.current_daily_payment) }}</strong> &#8381;
          </td>
        </tr>
        <!-- <tr>
          <td>По периодам</td>
          <td class="ui right aligned">{{contract.daily_payments}}</td>
        </tr>-->
      </tbody>
    </table>

    <!-- Periods -->
    <table v-if="periods.length" class="ui very compact small celled unstackable table">
      <thead>
        <tr>
          <th colspan="4" class="ui center aligned">ИЗМЕНЕНИЯ ПАРАМЕТРОВ ДОГОВОРА</th>
        </tr>
        <tr>
          <th>Период</th>
          <th>Платёж</th>
          <th>Процент</th>
          <th>Комментарий</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="period in periods" :key="period.id">
          <td>{{ period.period }}</td>
          <td>{{ period.annuitet }}</td>
          <td>{{ period.percent }}</td>
          <td>{{ period.note }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Штраф -->
    <table class="ui very compact small celled two column unstackable table">
      <tbody>
        <tr>
          <td>Штраф за просрочку фото-отчета</td>
          <td class="ui right aligned">
            {{ $filters.money(contract.shtraf) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Заметки -->
    <div v-if="!contract.notes" class="ui center aligned segment empty text-color-grey">Нет заметок</div>
    <table v-else class="ui very compact small celled unstackable table">
      <tbody>
        <tr>
          <td colspan="2">
            <i class="exclamation icon"></i>
            {{ contract.notes }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- /Contract Details -->
</template>

<script>
import apiService from "@/services/api.service.js";

import CMContractStatus from "@/components/CMContractStatus.vue";

export default {
  name: "CMContractDetails",
  components: {
    CMContractStatus,
  },
  props: {
    contractId: {
      type: Number,
    },
    preloadedContract: {
      type: Object,
      required: false,
    },
    isLoadingExternal: {
      type: Boolean,
      required: false,
    },
  },

  data() {
    return {
      contract: {},
      isLoading: false,
    };
  },

  computed: {
    periods() {
      return this.contract.periods ? this.contract.periods.filter((el) => el.note) : [];
    },
    loading() {
      return this.isLoadingExternal || this.isLoading;
    },
  },
  watch: {
    preloadedContract() {
      this.contract = this.preloadedContract;
    },
  },
  mounted() {
    if (this.contractId !== undefined) {
      this.fetchItem(this.contractId);
    }

    // Check preloaded contract prop
    if (this.preloadedContract !== undefined) {
      this.contract = this.preloadedContract;
      // this.isLoading = Object.keys(this.preloadedContract).length === 0;
    }
  },
  methods: {
    async fetchItem(contract_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getContract(contract_id);
        this.contract = result;
      } catch (error) {
        // console.log("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
#status {
  margin-right: 0;
}

.segment.empty {
  box-shadow: none;
  -webkit-box-shadow: none;
}
</style>
