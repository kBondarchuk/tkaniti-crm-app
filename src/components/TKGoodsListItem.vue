<template>
  <tr @click="$emit('eventDetails', item.id)">
    <!--  -->
    <td>
      {{ item.id }}
    </td>
    <!--  -->
    <td>
      <TKGoodStatus :value="item.status_id" />
      <!-- {{ item.category }} -->
    </td>
    <!--  -->
    <td>
      {{ item.name }}
    </td>
    <!--  -->
    <td>
      {{ item.brand }}
    </td>
    <!--  -->
    <td>
      {{ item.code }}
    </td>
    <!--  -->
    <UIMoneyCell :value="item.price" />
    <!--  -->
    <td class="right aligned">
      {{ item.quantity }}
    </td>
    <!--  -->
    <td :title="item.description" v-html="truncate(item.description, 30)"></td>
    <!--  -->
    <td :title="item.notes" v-html="$filters.truncate(item.notes, 30)"></td>
    <!--  -->
  </tr>
</template>

<script>
import UIMoneyCell from "@/components/UIMoneyCell.vue";
import TKGoodStatus from "@/components/TKGoodStatus.vue";

export default {
  name: "TKGoodsListItem",

  components: {
    UIMoneyCell,
    TKGoodStatus,
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
  },

  emits: ["eventDetails"],
};
</script>
