<template>
  <div
    class="ui vertical fluid small secondary menu"
    :class="{ sticked: stickyAt != null }"
    :style="{ top: stickyAt + 'px' }"
    v-bind="$attrs"
  >
    <div v-if="header" class="header item">{{ header }}</div>
    <a
      v-for="item in items"
      :key="item.id"
      class="item"
      :class="{ active: item.id == modelValue, 'text-bold': item.id == modelValue }"
      @click="$emit('update:modelValue', item.id)"
    >
      <i :class="[item.id != modelValue ? 'grey' : tintColor, item.icon]" class="icon" />
      {{ item.name }}
      <div v-if="item.label" class="ui label">{{ item.label }}</div>
    </a>
  </div>
</template>

<script>
export default {
  name: "LayoutSideMenu",

  props: {
    items: Array,
    modelValue: Number,
    header: String,
    stickyAt: {
      type: Number,
      default: null,
    },
    tintColor: {
      type: String,
      default: "black",
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      // selected: 0
      // items: [
      //   // { id: 1, name: "Новый договор", icon: "plus", label: "" },
      //   // { id: 2, name: "Список", icon: "list", label: "" },
      //   // { id: 3, name: "Выплаченные", icon: "list", label: "" },
      //   // { id: 4, name: "Закрытые", icon: "list", label: "" },
      //   // { id: 5, name: "Удаленные", icon: "list", label: "" }
      // ]
    };
  },

  mounted() {
    // $(this.$refs.sticky).sticky({
    //   context: ".ui-main",
    //   offset: 60,
    // });
  },
};
</script>

<style scoped>
.ui.menu {
  margin-left: 0;
}

.ui.vertical.menu .item > .label {
  background: rgba(0, 0, 0, 0.02);
  /* #99999930; */
  color: #000;

  /* fix */
  margin-top: -0.25em;
}

.ui.vertical.menu .item.active > .label {
  background: transparent;
  /* #99999930; */
  color: rgb(0, 0, 0);
}
</style>
