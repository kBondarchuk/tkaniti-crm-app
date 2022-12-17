<template>
  <tr @click="$emit('eventDetails', item.id)">
    <td>{{ item.id }}</td>
    <td>{{ item.last_name + " " + item.first_name + " " + item.second_name }}</td>
    <!-- <td class="right aligned">{{$filters.money(item.debet )}}</td> -->
    <!-- <td class="right aligned">{{$filters.money(item.balance )}}</td> -->
    <td class="right aligned">{{ $filters.money(item.balance) }}</td>
    <td class="right aligned">{{ $filters.money(item.investments_balance) }}</td>
    <td class="right aligned">{{ $filters.money(item.interest_balance) }}</td>
    <td>{{ item.notes }}</td>
  </tr>
</template>

<script>
export default {
  name: "CMInvestorsListItem",
  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
  methods: {
    contextMenu($event) {
      $(".dropdown.circular.button").dropdown("hide");
      $($event.currentTarget).dropdown({ action: "hide" }).dropdown("show");
    },
  },
};
</script>

<style scoped>
.ui.circular.button {
  background-color: transparent;
  padding: 3px;
}
.ui.circular.button:hover {
  background-color: #cacbcd;
}
</style>
