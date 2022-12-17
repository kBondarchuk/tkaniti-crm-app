<template>
  <div
    class="ui vertical fluid small secondary menu"
    :class="{ sticked: stickyAt != null }"
    :style="{ top: stickyAt + 'px' }"
  >
    <div class="header item">{{ header }}</div>
    <a
      v-for="item in items"
      :key="item.id"
      class="item"
      :class="{ active: modelValue.includes(item.id) }"
      @click="click(item.id)"
    >
      <i v-if="modelValue.includes(item.id)" class="check circle icon" :class="tintColor" />
      <i v-if="!modelValue.includes(item.id)" class="circle outline icon grey" />
      {{ item[name] }}
      <div v-if="item.label" class="ui label">{{ item.label }}</div>
    </a>
  </div>
</template>

<script>
export default {
  name: "MultipleSideMenu",

  props: {
    items: Array,
    modelValue: Array,
    name: {
      type: String,
      default: "name",
    },
    header: String,
    tintColor: {
      type: String,
      default: "blue",
    },
    stickyAt: {
      type: Number,
      default: null,
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

  methods: {
    click(id) {
      // $emit("input", item.id);
      // console.log(id, this.modelValue);

      if (this.modelValue.includes(id)) {
        // console.log("убрать");
        const arr = this.modelValue.filter((_id) => _id != id);
        // console.log(arr);
        this.$emit("update:modelValue", arr);
      } else {
        // console.log("добавить");
        const arr = this.modelValue;

        arr.push(id);

        // console.log(arr);
        this.$emit("update:modelValue", arr);
      }
    },
  },

  // mounted() {
  // $(this.$refs.sticky).sticky({
  //   context: ".ui-main",
  //   offset: 60,
  // });
  // },
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
