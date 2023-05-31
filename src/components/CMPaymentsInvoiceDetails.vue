<template>
  <table class="ui very compact small celled table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="2">Детализация счета ({{ invoice.id }})</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Статус счета</td>
        <td><CMInvoiceStatus :value="invoice.status" /></td>
      </tr>
      <tr>
        <td>Номер счета</td>
        <td>{{ invoice.invoice_number }} от {{ $filters.date(invoice.created_ts) }}</td>
      </tr>
      <tr>
        <td>Описание счета</td>
        <td>{{ invoice.invoice_description }}</td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>Тип договора</td>
        <td><CMAcquiringTypeStatus :type="invoice.subject_type" /></td>
      </tr>
      <tr>
        <td>ID Договора / Клиента</td>
        <td>
          {{ invoice.subject_id }}
          <a v-if="invoice.subject_type == 'lease'" @click.stop="go('lease')"> Перейти к договору </a>
          <a v-if="invoice.subject_type == 'rent'" @click.stop="go('rent')"> Перейти к договору </a>
          <a v-if="invoice.subject_type == 'accum'" @click.stop="go('accum')"> Перейти к клиенту </a>
        </td>
      </tr>
      <tr>
        <td>Юр. лицо договора</td>
        <td>{{ invoice.company_id }} {{ invoice.company_name }}</td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>

      <tr>
        <td>Сумма счета</td>
        <td class="text-bold">{{ $filters.money(invoice.deposit_amount) }}</td>
      </tr>

      <tr>
        <td>Платёж зачислен на договор</td>
        <td>{{ invoice.cleared ? "Да" : "Нет" }}</td>
      </tr>
      <tr>
        <td>Способ оплаты</td>
        <td><CMInvoicePaymentMethod :value="invoice.payment_method" /></td>
      </tr>
      <tr>
        <td>Чек</td>
        <td>{{ invoice.receipt_id }}</td>
      </tr>

      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>Время создания</td>
        <td>{{ $filters.date(invoice.created_ts) }}</td>
      </tr>
      <tr>
        <td>Последнее обновление</td>
        <td>{{ $filters.date(invoice.updated_ts) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import CMAcquiringTypeStatus from "@/components/CMAcquiringTypeStatus.vue";
import CMInvoiceStatus from "@/components/CMInvoiceStatus.vue";
import CMInvoicePaymentMethod from "@/components/CMInvoicePaymentMethod.vue";

export default {
  name: "CMPaymentsInvoiceDetails",

  components: {
    CMAcquiringTypeStatus,
    CMInvoiceStatus,
    CMInvoicePaymentMethod,
  },

  props: {
    invoice: {
      type: Object,
      default: () => {},
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    go(type) {
      switch (type) {
        case "lease":
          this.$router.push({
            name: "contract_details",
            params: { id: this.invoice.subject_id },
          });
          break;

        case "rent":
          this.$router.push({
            name: "contract_rent_details",
            params: { id: this.invoice.subject_id },
          });
          break;

        case "accum":
          this.$router.push({
            name: "customers_details",
            params: { id: this.invoice.subject_id },
          });
          break;

        default:
          return;
      }
    },
  },
};
</script>
