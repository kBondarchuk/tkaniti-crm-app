<template>
  <tr :class="{ warning: item.warnings > 0 }" @click="$emit('eventDetails', item)">
    <td>{{ item.id }}</td>
    <td>{{ item.name }}</td>
    <td>{{ item.short_name }}</td>
    <td>{{ item.description }}</td>
  </tr>
</template>

<script>
export default {
  name: "CMPrefsBranchListItem",
  components: {},
  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
};
</script>
