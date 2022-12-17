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
            <th colspan="2"></th>
            <th colspan="2" class="ui center aligned">НАЧИСЛЕНИЯ</th>
            <th colspan="3" class="ui center aligned">ОПЛАТА</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class></td>
            <td class="ui right aligned gray_bg">Всего</td>
            <td class="ui right aligned gray_bg">Начислено</td>
            <td class="ui right aligned gray_bg">Осталось</td>
            <td class="ui right aligned gray_bg">Оплачено</td>
            <td class="ui right aligned gray_bg">Осталось</td>
            <td class="ui right aligned gray_bg">Текущ. задолж.</td>
          </tr>
          <tr>
            <td class="gray_bg">Основной долг</td>
            <UIMoneyCell :value="accounts.contract_debt" />
            <UIMoneyCell :value="accounts.debt_credit" />
            <UIMoneyCell :value="accounts.contract_debt_left" />
            <UIMoneyCell :value="accounts.debt_debet" />
            <UIMoneyCell :value="accounts.contract_debt_to_pay" />
            <UIMoneyCell :value="accounts.debt_balance" colored />
          </tr>
          <tr>
            <td class="gray_bg">Проценты</td>
            <UIMoneyCell :value="accounts.contract_interest" />
            <UIMoneyCell :value="accounts.interest_credit" />
            <UIMoneyCell :value="accounts.contract_interest_left" />
            <UIMoneyCell :value="accounts.interest_debet" />
            <UIMoneyCell :value="accounts.contract_interest_to_pay" />
            <UIMoneyCell :value="accounts.interest_balance" colored />
          </tr>
          <tr>
            <td class="right aligned">Итого по долгу</td>
            <UIMoneyCell :value="accounts.contract_total" class="gray_bg" />
            <UIMoneyCell :value="accounts.total_net_credit" class="gray_bg" />
            <UIMoneyCell :value="accounts.contract_total_left" class="gray_bg" />
            <UIMoneyCell :value="accounts.total_net_debet" class="gray_bg" />
            <UIMoneyCell :value="accounts.contract_total_to_pay" class="gray_bg" />
            <UIMoneyCell :value="accounts.total_net_balance" class="gray_bg" />
          </tr>
          <tr>
            <td class="gray_bg">Пеня</td>
            <td></td>
            <UIMoneyCell :value="accounts.penalty_credit" />
            <td></td>
            <UIMoneyCell :value="accounts.penalty_debet" />
            <td></td>
            <UIMoneyCell :value="accounts.penalty_balance" colored />
          </tr>
          <tr>
            <td class="gray_bg">Штрафы</td>
            <td></td>
            <UIMoneyCell :value="accounts.car_fines_credit" />
            <td></td>
            <UIMoneyCell :value="accounts.car_fines_debet" />
            <td></td>
            <UIMoneyCell :value="accounts.car_fines_balance" colored />
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th class="right aligned">Итого</th>
            <td></td>
            <UIMoneyCell :value="accounts.total_credit" class="text-bold" />
            <td></td>
            <UIMoneyCell :value="accounts.total_debet" class="text-bold" />
            <td></td>
            <UIMoneyCell :value="accounts.total_balance" class="text-bold" />
          </tr>
        </tfoot>
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
            <UIMoneyCell :value="accounts.deposit_debet" />
            <UIMoneyCell :value="accounts.deposit_credit" />
            <UIMoneyCell :value="accounts.deposit_balance" />
          </tr>
        </tbody>
      </table>
      <!-- </div> -->
      <table class="ui very compact small celled unstackable table" :class="{ loading: isLoading }">
        <thead>
          <tr>
            <th colspan="3" class="ui center aligned">СУММА ДЛЯ ПОЛНОГО ДОСРОЧНОГО ПОГАШЕНИЯ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="ui positive center aligned">
              {{
                $filters.money(
                  (
                    -parseFloat(accounts.total_balance) +
                    parseFloat(accounts.contract_debt_left) -
                    parseFloat(accounts.deposit_balance)
                  ).toFixed(2)
                )
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMTransactionsResults",
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
        let result = await apiService.getAccountsForContract(contract_id);
        this.accounts = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
