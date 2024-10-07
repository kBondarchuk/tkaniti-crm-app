<template>
  <tr :class="{ warning: item.warnings > 0 }" @click="$emit('eventDetails', item)">
    <td>{{ item.id }}</td>
    <td>{{ item.name }}</td>
    <td>{{ item.notes }}</td>
    <td>{{ item.payload?.api_login }}</td>
    <td>{{ item.payload?.api_url }}</td>
    <!-- <td>{{ item.payload?.success_url }}</td> -->
    <!-- <td>{{ item.payload?.fail_url }}</td> -->
    <td>{{ item.enabled == 1 ? "ДА" : "НЕТ" }}</td>
  </tr>
</template>

<script>
export default {
  name: "CMPrefsPaymentsAcquiringListItem",

  props: {
    item: {
      type: Object,
      default: null,
    },
  },

  emits: ["eventDetails"],
};
</script>
