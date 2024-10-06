<template>
  <table class="ui very compact small celled table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="2">Платёжная операция Ю-касса</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Номер операции</td>
        <td>{{ order.payment_id }}</td>
      </tr>
      <tr>
        <td>Статус</td>
        <td><CMPaymentYooStatus :value="order.status" /></td>
      </tr>
      <tr>
        <td>Сумма оплаты</td>
        <td>{{ $filters.money(order.amount) }}</td>
      </tr>
      <tr>
        <td>Сумма возврата</td>
        <td>{{ $filters.money(order.refunded_amount) }}</td>
      </tr>
      <tr>
        <td>Время операции</td>
        <td>{{ $filters.date(order.created_at) }}</td>
      </tr>
      <tr>
        <td>Метод оплаты</td>
        <td>{{ order.payment_method_type }}</td>
      </tr>
      <tr>
        <td>Признак оплаты</td>
        <td>{{ order.is_paid }}</td>
      </tr>
      <tr>
        <td>Возможность возврата</td>
        <td>{{ order.is_refundable }}</td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>Тип подтверждения</td>
        <td>{{ order.confirmation_type }}</td>
      </tr>
      <tr>
        <td>URL страницы оплаты</td>
        <td>
          <a
            v-if="order.confirmation_data?.confirmation_url"
            :href="order.confirmation_data?.confirmation_url"
            target="_blank"
          >
            Открыть страницу оплаты
          </a>
        </td>
      </tr>
      <tr>
        <td>Страница возврата</td>
        <td>{{ order.confirmation_data?.return_url }}</td>
      </tr>
      <tr>
        <td>confirmation_data</td>
        <td>{{ order.confirmation_data }}</td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>Данные метода оплаты</td>
        <td>{{ order.payment_method_data }}</td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>Данные авторизации</td>
        <td>{{ order.authorization_details }}</td>
      </tr>
      <tr>
        <td>Данные по отмене</td>
        <td>{{ order.cancellation_details }}</td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>Возвраты</td>
        <td>{{ order.refunds }}</td>
      </tr>
      <tr>
        <td colspan="2"></td>
      </tr>
      <tr>
        <td>Профиль платёжной системы</td>
        <td>{{ order.settings_name }} ({{ order.settings_id }})</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import CMPaymentYooStatus from "@/components/CMPaymentYooStatus.vue";

/// PROPS

const props = defineProps({
  order: {
    type: Object,
    default: () => {},
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>
