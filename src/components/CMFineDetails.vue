<template>
  <!-- Grid -->
  <div class="ui grid">
    <!-- fist column -->
    <div class="eight wide column">
      <!-- Details -->

      <!-- Статусы -->
      <table class="ui very compact small definition two column table" :class="{ loading: isLoading }">
        <tbody>
          <!--  -->
          <tr>
            <td>Статус оплаты</td>
            <td>
              <CMFinePayStatus :payed="fine.payed" />
            </td>
          </tr>
          <!--  -->
          <tr>
            <td>Статус начисления</td>
            <td>
              <CMFineChargeStatus :charged="fine.charged" />
            </td>
          </tr>
        </tbody>
      </table>

      <!--  -->
      <table class="ui very compact small definition two column table" :class="{ loading: isLoading }">
        <tbody>
          <!--  -->
          <tr>
            <td>Постановление</td>
            <td>{{ fine.decree_number }} от {{ $filters.date(fine.decree_date) }}</td>
          </tr>
          <tr>
            <td>Сумма штрафа</td>
            <td>
              <strong> {{ $filters.money(fine.amount) }}</strong>
            </td>
          </tr>
          <tr>
            <td>Сумма со скидкой</td>
            <td>{{ $filters.money(fine.discount_amount) }}</td>
          </tr>
          <tr>
            <td>Срок оплаты до</td>
            <td>{{ $filters.date(fine.decree_due_date) }}</td>
          </tr>
          <tr>
            <td>Срок оплаты со скидкой</td>
            <td>{{ $filters.date(fine.discount_date) }}</td>
          </tr>
          <tr>
            <td>Дата нарушения</td>
            <td :class="{ error: !fine.offense_datetime }">{{ $filters.date(fine.offense_datetime) }}</td>
          </tr>
          <tr>
            <td style="vertical-align: baseline">Описание нарушения</td>
            <td>{{ fine.notes }}</td>
          </tr>
          <tr>
            <td style="vertical-align: baseline">Место нарушения</td>
            <td>{{ fine.offense_location }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Даты создания -->
      <table class="ui very compact small definition two column table" :class="{ loading: isLoading }">
        <tbody>
          <!--  -->
          <tr>
            <td>Создано</td>
            <td>{{ $filters.date(fine.created_dt) }} {{ fine.user_id_created }}</td>
          </tr>
          <tr>
            <td>Обновлено</td>
            <td>{{ $filters.date(fine.gibdd_updated_ts) }} {{ fine.user }}</td>
          </tr>
        </tbody>
      </table>

      <!-- /Details -->
    </div>
    <!-- second column -->
    <div class="eight wide second column">
      <table class="ui very compact small definition two column table" :class="{ loading: isLoading }">
        <tbody>
          <!--  -->
          <tr>
            <td>Автомобиль</td>
            <td><CMLinkCar :car-id="fine.car_id" path="cars_details_car_fines" /> {{ fine.car }}</td>
          </tr>
          <tr>
            <td>Договор</td>
            <td
              :class="{
                error:
                  !fine.offense_datetime ||
                  !([0, 1].includes(fine.contract_status) || [1, 2].includes(fine.rent_contract_status)),
              }"
            >
              <template v-if="fine.contract_status != null">
                <CMContractStatus :value="fine.contract_status" />
                &nbsp;
                <a style="cursor: pointer" @click.stop="linkToContract(fine.contract_id)">{{ fine.contract_id }}</a>
              </template>
              <template v-else-if="fine.rent_contract_id != null">
                <CMRentContractStatus :value="fine.rent_contract_status" />
                &nbsp;
                <a style="cursor: pointer" @click.stop="linkToRentContract(fine.rent_contract_id)">{{
                  fine.rent_contract_id
                }}</a>
              </template>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Статус оплаты -->
      <table class="ui very compact small definition two column table" :class="{ loading: isLoading }">
        <tbody>
          <!--  -->
          <tr>
            <td>Оплаченная сумма штрафа</td>
            <td>
              <strong> {{ $filters.money(fine.payed_amount) }}</strong>
            </td>
          </tr>
          <tr>
            <td>Оплаченная комиссия</td>
            <td>
              <strong> {{ $filters.money(fine.payed_commission) }}</strong>
            </td>
          </tr>
          <tr>
            <td>Дата оплаты</td>
            <td>{{ $filters.date(fine.payed_ts) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Частичная оплата -->
      <table
        v-if="fine.already_payed == 1"
        class="ui very compact small two column table"
        :class="{ loading: isLoading }"
      >
        <!--  -->
        <thead>
          <tr>
            <th colspan="2">Частично оплачено!</th>
          </tr>
        </thead>
        <!--  -->
        <tbody>
          <!--  -->
          <tr class="warning">
            <td>Полная сумма штрафа</td>
            <td>
              <strong> {{ $filters.money(fine.full_bill_amount) }}</strong>
            </td>
          </tr>
          <!--  -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import CMFinePayStatus from "@/components/CMFinePayStatus.vue";
import CMFineChargeStatus from "@/components/CMFineChargeStatus.vue";
import CMLinkCar from "@/components/CMLinkCar.vue";
import CMContractStatus from "@/components/CMContractStatus.vue";
import CMRentContractStatus from "@/components/CMRentContractStatus.vue";

export default {
  name: "CMFineDetails",

  components: {
    CMFinePayStatus,
    CMFineChargeStatus,
    CMLinkCar,
    CMContractStatus,
    CMRentContractStatus,
  },

  props: {
    fine: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      // car: {},
      isLoading: false,
    };
  },

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
