<template>
  <tr @click="$emit('eventDetails', item.id)">
    <td>{{ item.id }}</td>
    <td><CMBudgetStatusBadge :value="item.status" /></td>
    <td>{{ $filters.date(item.created_dt) }}</td>
    <!-- <td>{{$filters.date(item.updated_dt )}}</td> -->
    <td>{{ item.last_name }} {{ item.first_name }} {{ item.second_name }}</td>
    <td>{{ $filters.phone(item.phone) }}</td>
    <td>{{ item.email }}</td>
    <td>{{ item.branch }}</td>
    <td>{{ item.user }}</td>
    <td>{{ item.notes }}</td>
  </tr>
</template>

<script>
import CMBudgetStatusBadge from "@/components/CMBudgetStatusBadge.vue";

export default {
  name: "CMRegistrationRequestsListItem",
  components: { CMBudgetStatusBadge },
  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
};
</script>
