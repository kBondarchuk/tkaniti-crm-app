<template>
  <tr @click="$emit('eventDetails', item.id)">
    <!-- <td>{{ item.id }}</td> -->
    <td :class="{ 'text-bold': item.parent_id === null, child: item.parent_id != null }">
      <span v-if="item.parent_id === null"><i class="folder blue icon"></i></span>
      <span v-if="item.parent_id != null"><i class="minus blue icon"></i></span>
      {{ item.name }}
    </td>
  </tr>
</template>

<script>
export default {
  name: "CMExpensesCategoriesItem",
  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
};
</script>

<style scoped>
.table > tbody > tr > td:first-child.child {
  padding-left: 3em !important;
}
</style>
