<template>
  <tr :class="{ active: selected }" @click="$emit('eventDetails', item.id)">
    <td>{{ item.id }}</td>
    <td>{{ item.last_name + " " + item.first_name + " " + item.second_name }}</td>
    <td class="nobr">{{ $filters.phone(item.phone) }}</td>
    <td class="nobr">{{ item.email }}</td>
    <td>{{ item.address_fact }}</td>
    <td>{{ item.option_skip_order_confirm ? "Да" : "" }}</td>
    <td :title="item.notes" v-html="$filters.truncate(item.notes, 30)"></td>
  </tr>
</template>

<script>
export default {
  name: "TKCustomersListItem",

  components: {},

  props: {
    item: {
      type: Object,
      default: null,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["eventDetails"],
};
</script>
