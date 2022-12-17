<template>
  <tr :class="{ parent: !item.parent_id }" @click="$emit('eventDetails', item)">
    <td>{{ item.id }}</td>
    <td>{{ item.parent_id }}</td>
    <td>{{ types[item.expense_type_id] }}</td>
    <td>{{ select[item.selectable] }}</td>
    <td>{{ item.name }}</td>
    <td>{{ item.path }}</td>
  </tr>
</template>

<script>
export default {
  name: "CMPrefsExpensesCategoriesListItem",
  components: {},
  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],

  data() {
    return {
      types: ["Филиал", "Автомобиль"],
      select: ["Нет", "Да"],
    };
  },
};
</script>

<style scoped>
.parent {
  /* background-color: aliceblue; */
  font-weight: bold;
}
</style>
