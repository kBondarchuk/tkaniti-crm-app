<template>
  <UIBadge :text="status?.name" :class="status?.class" />
</template>

<script>
import UIBadge from "@/components/UIBadge.vue";

export default {
  name: "TKGoodStatus",

  components: {
    UIBadge,
  },

  props: {
    value: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      statuses: [
        { id: "0", icon: "", name: "Новый", class: "background-color-red text-color-white" },
        { id: "1", icon: "", name: "На складе", class: "background-color-blue text-color-white" },
        { id: "2", icon: "", name: "В продаже", class: "background-color-green text-color-white" },
        { id: "3", icon: "", name: "Продано", class: "" },
      ],
    };
  },

  computed: {
    status() {
      const sid = 1;
      return this.statuses.find((item) => item.id == this.value);
    },
  },
};
</script>
