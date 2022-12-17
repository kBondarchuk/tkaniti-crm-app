<template>
  <div class="badge" :class="color">{{ name }}</div>
</template>

<script>
export default {
  name: "CMContractStatus",
  props: {
    value: Number,
  },
  data() {
    return {
      strings: [
        "Удалён",
        "Ожидание",
        "Активен",
        "Завершён",
        "Выплачен",
        "В архиве",
        "Неизвестный5",
        "Неизвестный6",
        "Неизвестный7",
        "Неизвестный8",
        "Неизвестный9",
        "Возврат",
        "Обмен",
      ],
      colors: [
        "",
        "background-color-orange text-color-white",
        "background-color-green text-color-white",
        "background-color-teal text-color-white",
        "background-color-blue text-color-white",
        "",
        "",
        "",
        "",
        "",
        "",
        "background-color-violet text-color-white",
        "background-color-violet text-color-white",
      ],
    };
  },
  computed: {
    name() {
      return this.strings[this.value + 1];
    },
    color() {
      return this.colors[this.value + 1];
    },
  },
};
</script>
<style lang="css" scoped>
div.badge {
  display: inline-block;
  font-size: 10px;
  padding: 3px 8px;
  color: rgba(0, 0, 0, 0.6);
  background: #e8e8e8;
  border-radius: 8px;
  font-weight: normal;
  white-space: nowrap;
  text-align: center;
  line-height: 14px;
  text-transform: uppercase;
  /* opacity: 0.3; */
}
</style>
