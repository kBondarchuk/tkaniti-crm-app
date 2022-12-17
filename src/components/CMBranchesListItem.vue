<template>
  <tr @click="$emit('eventDetails', item.id)">
    <td>{{ item.id }}</td>
    <td>{{ item.name }}</td>
    <td class="right aligned">{{ $filters.money(item.kassa_balance) }}</td>
    <td>{{ item.description }}</td>
  </tr>
</template>

<script>
export default {
  name: "CMBranchesListItem",

  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
};
</script>
