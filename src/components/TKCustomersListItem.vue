<template>
  <tr :class="{ active: selected }" @click="$emit('eventDetails', item.id)">
    <td>{{ item.id }}</td>
    <td>{{ item.last_name + " " + item.first_name + " " + item.second_name }}</td>
    <td class="nobr">{{ $filters.phone(item.phone) }}</td>
    <td class="nobr">{{ item.email }}</td>
    <td>{{ item.address_fact }}</td>
    <td :title="item.notes" v-html="truncate(item.notes, 30)"></td>
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

  methods: {
    truncate(str, n) {
      return str && str.length > n ? str.substr(0, n - 1) + "&hellip;" : str;
    },
  },
  //
};
</script>
