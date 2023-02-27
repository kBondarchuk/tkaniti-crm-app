<template>
  <tr @click="$emit('eventDetails', item.id)">
    <!--  -->
    <!-- <td>
      {{ item.id }}
    </td> -->

    <!--  -->
    <td colspan="3">
      <div style="display: flex; align-items: center">
        <div
          class="preview"
          style="
            position: relative;
            width: 60px;
            height: 45px;
            border-radius: 4px;
            margin-right: 1em;
            background: rgba(0, 0, 0, 0.05);
          "
        >
          <img
            v-if="item.thumbnail && token && baseUrl"
            loading="lazy"
            :src="baseUrl + '?file=images/' + item.thumbnail + '&jwt=' + token"
            :alt="item.name"
            width="60"
            height="45"
            style="border-radius: 4px; object-fit: cover"
          />
        </div>
        <div>
          {{ item.name }} ({{ item.id }})<br />
          {{ item.brand }}
        </div>
      </div>
    </td>
    <!--  -->
    <td>
      <TKGoodStatus :value="item.status_id" />
      <!-- {{ item.category }} -->
    </td>
    <!--  -->
    <td>
      {{ item.code }}
    </td>
    <!--  -->
    <UIMoneyCell :value="item.price" />
    <!--  -->
    <td class="right aligned">
      {{ item.remains }}
    </td>
    <!--  -->
    <!-- <td :title="item.description" v-html="$filters.truncate(item.description, 30)"></td> -->
    <!--  -->
    <td :title="item.notes" v-html="$filters.truncate(item.notes, 40)"></td>
    <!--  -->
  </tr>
</template>

<script>
import TKGoodStatus from "@/components/TKGoodStatus.vue";

export default {
  name: "TKGoodsListImageItem",

  components: {
    TKGoodStatus,
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
    baseUrl: {
      type: String,
      default: null,
    },
    token: {
      type: String,
      default: null,
    },
  },

  emits: ["eventDetails"],
};
</script>
