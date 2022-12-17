<template>
  <!-- <div
    class="ui"
    v-if="value!=null"
    :class="statuses[value].color"
  > {{statuses[value].name}} ({{ value }})</div>-->
  <div v-if="value != null">
    <span :class="statuses[value + 1].color" v-html="statuses[value + 1].icon"></span>
    {{ statuses[value + 1].name }}
  </div>
</template>

<script>
export default {
  name: "CMCarStatus",
  props: {
    value: Number,
  },
  data() {
    return {
      statuses: [
        { name: "Удалён", icon: "&#9471;", color: "text-color-grey" },
        { name: "Черновик", icon: "&#9471;", color: "text-color-grey" },
        { name: "В гараже", icon: "&#10102;", color: "text-color-red" },
        { name: "В работе", icon: "&#10103;", color: "text-color-olive" },
        { name: "Выкуплен", icon: "&#10104;", color: "text-color-grey" },
        { name: "Продан", icon: "&#10105;", color: "text-color-black" },
        { name: "В ремонте", icon: "&#10106;", color: "text-color-blue" },
        { name: "Аренда", icon: "&#10107;", color: "text-color-purple" },
      ],
    };
  },
};
</script>
