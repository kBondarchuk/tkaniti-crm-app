<template>
  <table class="ui very compact celled small table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th>id</th>
        <th>Дата</th>
        <th>Документ</th>
        <!-- <th>Тип</th> -->
        <th>Филиал</th>
        <th>Инвестор</th>
        <th>Автомобиль</th>
        <th>Статья расхода</th>
        <th>Описание</th>
        <th class="right aligned">Сумма</th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="filteredItems.length == 0">
        <td colspan="9" class="center aligned">Нет записей</td>
      </tr>
      <tr v-for="(item, index) in filteredItems" :key="index" @click="$emit('editItem', item)">
        <td>
          {{ item.id }}<span v-if="item.op_id">&ndash;{{ item.op_id }}</span>
          <span v-if="mode == 'edit'" @click.stop="$emit('remove', item)">❌</span>
        </td>
        <td>{{ $filters.date(item.expense_dt, 0) }}</td>
        <td>{{ item.document }}</td>
        <!-- <td>{{ item.expense_type_id }}</td> -->
        <td>{{ item.branch }} ({{ item.branch_id }})</td>
        <td>{{ item.investor }} ({{ item.investor_id }})</td>
        <td><CMLinkCar :car-id="item.car_id" /> {{ item.car }} ({{ item.car_id }})</td>
        <!-- <td>{{ item.car }} ({{ item.car_id }})</td> -->
        <td>{{ item.expense_category_path }}</td>
        <td>{{ item.expense_notes }}</td>
        <td class="right aligned">
          <span class="nobr">{{ $filters.money(item.expense_amount) }}</span>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th colspan="8" class="right aligned" style="font-weight: bold">ИТОГО</th>
        <th class="right aligned" style="font-weight: bold">
          <span class="nobr">{{ $filters.money(totalSum) }}</span>
        </th>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import CMLinkCar from "@/components/CMLinkCar.vue";

export default {
  name: "CMBudgetItemList",

  components: {
    CMLinkCar,
  },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
    totalSum: {
      type: [String, Number],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    mode: {
      type: String,
      default: "view",
    },
  },
  emits: ["editItem", "remove"],

  computed: {
    filteredItems() {
      return this.items.filter((i) => {
        return !i.deleted || (i.deleted && i.deleted != 1);
      });
    },
  },
};
</script>
