<template>
  <tr @click="$emit('eventDetails', item.id)">
    <!--  -->
    <td>
      {{ item.id }}
    </td>
    <!--  -->
    <td><TKOrderStatus :value="item.status_id" /></td>
    <!--  -->
    <td><TKOrderPaymentStatus :value="item.payment_status_id" /></td>
    <!-- Метод оплаты -->
    <td class="center aligned"><TKOrderPaymentMethod :value="item.payment_method_id" /></td>
    <td>
      {{ $filters.date(item.date) }}
    </td>

    <!-- Без проверки? -->
    <td><template v-if="item.skip_check">Да</template></td>

    <!-- Отложено до -->
    <td>
      {{ $filters.date(item.delivery_date) }}
    </td>
    <!--  -->
    <td class="right aligned">
      {{ item.goods_count }}
    </td>
    <!--  -->
    <td class="right aligned">
      {{ item.total_quantity }}
    </td>
    <!--  -->
    <UIMoneyCell :value="item.total_price" class="text-bold" />
    <!-- Клиент -->
    <td>
      {{ item.real_customer_fio }}
    </td>
    <!--  -->
    <td>
      {{ item.customer_fio }}
    </td>
    <!--  -->
    <td class="nobr">
      {{ $filters.phone(item.customer_phone) }}
    </td>
    <!--  -->
    <td>
      {{ item.parcel_number }}
    </td>
    <!--  -->
    <td :title="item.notes" v-html="$filters.truncate(item.notes, 30)"></td>
  </tr>
</template>

<script setup>
import TKOrderStatus from "@/components/TKOrderStatus.vue";
import TKOrderPaymentStatus from "@/components/TKOrderPaymentStatus.vue";
import TKOrderPaymentMethod from "@/components/TKOrderPaymentMethod.vue";

// name: "TKOrdersListItem",

/// PROPS

const props = defineProps({
  item: {
    type: Object,
    default: null,
  },
});

/// EMITS

const emit = defineEmits(["eventDetails"]);
</script>
