<template>
  <!-- Contract Details -->
  <div :class="{ loading }">
    <table class="ui very compact small celled two column table">
      <tbody>
        <tr>
          <td>Номер договора</td>
          <td class="ui right aligned">
            {{ contract.contract_number }} от {{ $filters.date(contract.contract_date) }}
          </td>
        </tr>
        <tr>
          <td>Статус</td>
          <td class="ui right aligned">
            <CMRentContractStatus id="status" :value="contract.status" />
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
      </tbody>
    </table>
    <table class="ui very compact small celled two column table">
      <tbody>
        <tr>
          <td>Начальная дата</td>
          <td class="ui right aligned">
            {{ $filters.date(contract.date_opened, false) }}
          </td>
        </tr>
        <tr>
          <td>Срок договора</td>
          <td class="ui right aligned">
            {{ $filters.date(contract.date_opened, false) }} &mdash;
            {{ $filters.date(contract.contract_end_date, false) }} ({{ contract.contract_days }}
            дней)
          </td>
        </tr>
        <tr>
          <td>Текущий период</td>
          <td class="ui right aligned">{{ contract.current_period }} день</td>
        </tr>
      </tbody>
    </table>
    <table class="ui very compact small celled two column table">
      <tbody>
        <tr>
          <td>Платеж</td>
          <td class="ui right aligned">{{ $filters.money(contract.daily_payment) }} &#8381;</td>
        </tr>
        <tr>
          <td>Залог</td>
          <td class="ui right aligned">{{ $filters.money(contract.contract_pledge) }} &#8381;</td>
        </tr>
      </tbody>
    </table>

    <!-- Заметки -->
    <div v-if="!contract.notes" class="ui center aligned segment empty text-color-grey">Нет заметок</div>
    <table v-else class="ui very compact small celled table">
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

import CMRentContractStatus from "@/components/CMRentContractStatus.vue";

export default {
  name: "CMRentContractDetails",

  components: {
    CMRentContractStatus,
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
        let result = await apiService.getRentContract(contract_id);
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
