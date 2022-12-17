<template>
  <i :class="icon" style="vertical-align: unset" :style="style" :title="title"></i>
</template>

<script>
export default {
  name: "CMGibddSyncBadge",

  props: {
    value: Number,
  },

  computed: {
    icon() {
      if (this.value == 1) {
        return "sync alternate green icon";
      } else if (this.value == 0) {
        return "sync alternate red icon";
      } else if (this.value == -1) {
        return "sync alternate grey icon";
      } else {
        return "sync alternate white icon";
      }
    },
    style() {
      if (this.value == null) {
        return "opacity: 0";
      }
      return "opacity: 1";
    },
    title() {
      if (this.value == 1) {
        return "Мониторинг штрафов включен";
      } else if (this.value == 0) {
        return "Ошибка в Гос. номере или СТС";
      } else if (this.value == -1) {
        return "Мониторинг штрафов в процессе включения";
      } else {
        return "Мониторинг штрафов отключен";
      }
    },
  },
};
</script>
