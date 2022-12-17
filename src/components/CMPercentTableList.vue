<template>
  <div v-if="!length && !isLoading" class="ui center aligned basic segment">Список пуст</div>
  <table
    v-else
    class="ui very compact very small celled collapsing inverted popup percent-table table"
    style="min-width: 20em; font-size: 0.8em; z-index: 2009999"
  >
    <thead>
      <tr>
        <th>Срок в днях</th>
        <th>Дневной процент</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="item.term">
        <td class="center aligned">{{ index > 0 ? items[index - 1].term + 1 : 1 }} - {{ item.term }}</td>
        <td class="center aligned">{{ item.percent }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "CMPercentTableList",
  props: {
    items: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  computed: {
    length() {
      return this.items ? this.items.length : 0;
    },
  },
};
</script>
