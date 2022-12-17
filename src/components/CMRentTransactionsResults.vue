<template>
  <!-- Transactions Results -->

  <!-- Page 1 Grid -->
  <div class="ui stackable grid">
    <!-- Fist Column -->
    <div class="ten wide column">
      <!-- <div class="segment"> -->
      <table class="ui very compact small celled unstackable table" :class="{ loading: isLoading }">
        <thead>
          <!-- <tr>
              <th colspan="7">Состояние расчётов по договору ({{contract_id}})</th>
            </tr>-->
          <tr>
            <th colspan="1"></th>
            <th colspan="1" class="ui center aligned">НАЧИСЛЕНИЯ</th>
            <th colspan="1" class="ui center aligned">ОПЛАТА</th>
            <th colspan="1" class="ui center aligned">ДОЛГ</th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr> -->
          <!-- <td class></td> -->
          <!-- <td class="ui right aligned gray_bg">Всего</td> -->
          <!-- <td class="ui right aligned gray_bg">Начислено</td> -->
          <!-- <td class="ui right aligned gray_bg">Осталось</td> -->
          <!-- <td class="ui right aligned gray_bg">Оплачено</td> -->
          <!-- <td class="ui right aligned gray_bg">Осталось</td> -->
          <!-- <td class="ui right aligned gray_bg">Текущ. задолж.</td> -->
          <!-- </tr>  -->
          <tr>
            <td class="gray_bg">Арендные платежи</td>
            <!-- <td class="ui right aligned">{{$filters.money(accounts.contract_debt )}}</td> -->
            <td class="ui right aligned">{{ $filters.money(accounts.debt_credit) }}</td>
            <!-- <td class="ui right aligned">{{$filters.money(accounts.contract_debt_left )}}</td> -->
            <td class="ui right aligned">{{ $filters.money(accounts.debt_debet) }}</td>
            <!-- <td class="ui right aligned">{{$filters.money(accounts.contract_debt_to_pay )}}</td> -->
            <!-- <td
              class="ui right aligned"
              :class="{ positive: accounts.debt_balance > 0, negative: accounts.debt_balance < 0 }"
            >
              {{ $filters.money(accounts.debt_balance) }}
            </td> -->
            <UIMoneyCell :value="accounts.debt_balance" colored />
          </tr>
          <tr>
            <td class="gray_bg">Штрафы</td>
            <UIMoneyCell :value="accounts.car_fines_credit" />
            <UIMoneyCell :value="accounts.car_fines_debet" />
            <UIMoneyCell :value="accounts.car_fines_balance" colored />
          </tr>
          <!-- <tr>
            <td class="gray_bg">Пеня</td>
            <td class="ui right aligned"></td>
            <td class="ui right aligned">{{$filters.money(accounts.penalty_credit )}}</td>
            <td class="ui right aligned"></td>
            <td class="ui right aligned">{{$filters.money(accounts.penalty_debet )}}</td>
            <td class="ui right aligned"></td>
            <td
              class="ui right aligned"
              :class="{ positive: accounts.penalty_balance > 0, negative: accounts.penalty_balance < 0 }"
            >
              {{$filters.money(accounts.penalty_balance )}}
            </td>
          </tr> -->
        </tbody>
        <!-- <tfoot>
          <tr>
            <th>ИТОГО</th>
            <th class="ui right aligned">{{$filters.money(accounts.contract_total )}}</th>
            <th class="ui right aligned">{{$filters.money(accounts.total_credit )}}</th>
            <th class="ui right aligned">{{$filters.money(accounts.contract_total_left )}}</th>
            <th class="ui right aligned">{{$filters.money(accounts.total_debet )}}</th>
            <th class="ui right aligned">{{$filters.money(accounts.contract_total_to_pay )}}</th>
            <th class="ui right aligned">{{$filters.money(accounts.total_balance )}}</th>
          </tr>
        </tfoot> -->
      </table>
      <!-- </div> -->
    </div>
    <div class="six wide column">
      <!-- <div class="segment"> -->
      <table class="ui very compact small celled unstackable table" :class="{ loading: isLoading }">
        <thead>
          <tr>
            <th colspan="3" class="ui center aligned">ДЕПОЗИТ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="ui right aligned gray_bg">Зачислено</td>
            <td class="ui right aligned gray_bg">Потрачено</td>
            <td class="ui right aligned gray_bg">Остаток</td>
          </tr>
          <tr>
            <td class="ui right aligned">{{ $filters.money(accounts.deposit_debet) }}</td>
            <td class="ui right aligned">{{ $filters.money(accounts.deposit_credit) }}</td>
            <td
              class="ui right aligned"
              :class="{ positive: accounts.deposit_balance > 0, negative: accounts.deposit_balance < 0 }"
            >
              {{ $filters.money(accounts.deposit_balance) }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Залог -->
      <table class="ui very compact small celled unstackable table" :class="{ loading: isLoading }">
        <thead>
          <tr>
            <th colspan="3" class="ui center aligned">ЗАЛОГ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="ui right aligned gray_bg">Зачислено</td>
            <td class="ui right aligned gray_bg">Потрачено</td>
            <td class="ui right aligned gray_bg">Остаток</td>
          </tr>
          <tr>
            <td class="ui right aligned">{{ $filters.money(accounts.pledge_debet) }}</td>
            <td class="ui right aligned">{{ $filters.money(accounts.pledge_credit) }}</td>
            <td
              class="ui right aligned"
              :class="{ positive: accounts.pledge_balance > 0, negative: accounts.pledge_balance < 0 }"
            >
              {{ $filters.money(accounts.pledge_balance) }}
            </td>
          </tr>
        </tbody>
      </table>
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMRentTransactionsResults",
  props: {
    contract_id: {
      type: Number,
    },
  },
  data() {
    return {
      accounts: {},
      isLoading: false,
    };
  },
  mounted() {
    if (this.contract_id !== undefined) {
      this.fetchItem(this.contract_id);
    }
  },
  methods: {
    async fetchItem(contract_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getAccountsForRentContract(contract_id);
        this.accounts = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
