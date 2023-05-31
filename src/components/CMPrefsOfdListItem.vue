<template>
  <tr :class="{ warning: item.warnings > 0 }" @click="$emit('eventDetails', item)">
    <td>{{ item.id }}</td>
    <td>{{ item.name }}</td>
    <td>{{ item.notes }}</td>
    <td>{{ item.payload?.api_login }}</td>
    <td>{{ item.payload?.item_label }}</td>
    <td>{{ item.enabled == 1 ? "ДА" : "НЕТ" }}</td>
  </tr>
</template>

<script>
export default {
  name: "CMPrefsOfdListItem",

  props: {
    item: {
      type: Object,
      default: null,
    },
  },

  emits: ["eventDetails"],
};
</script>
