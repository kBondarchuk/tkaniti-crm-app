<template>
  <!-- <div
    class="ui"
    v-if="value!=null"
    :class="statuses[value].color"
  > {{statuses[value].name}} ({{ value }})</div>-->
  <div v-if="value != null" class="ui">
    <span :class="statuses[value].color" v-html="statuses[value].icon"></span>
    {{ statuses[value].name }}
  </div>
</template>

<script>
export default {
  name: "CMSberStatus",
  props: {
    value: Number,
  },
  data() {
    return {
      statuses: [
        { name: "Создан", icon: "&#9471;", color: "text-color-grey" },
        { name: "Подтверждён", icon: "&#10102;", color: "text-color-olive" },
        { name: "Завершён", icon: "&#10103;", color: "text-color-olive" },
        { name: "Отменён", icon: "&#10104;", color: "text-color-orange" },
        { name: "Возврат", icon: "&#10105;", color: "text-color-red" },
        { name: "Авторизация", icon: "&#10106;", color: "text-color-blue" },
        { name: "Отклонён", icon: "&#10107;", color: "text-color-pink" },
      ],
    };
  },
};
</script>
