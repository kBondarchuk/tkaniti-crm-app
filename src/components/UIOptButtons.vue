<template>
  <div class="ui compact basic buttons" :class="type">
    <!--  -->
    <button
      v-for="item in options"
      :key="item.id"
      class="ui button"
      :class="{ active: modelValue == item.id, disabled: item.disabled || disabled }"
      :title="item.title"
      @click="select(item.id)"
    >
      {{ item.name }}
      <i v-if="item.icon" :class="item.icon" class="icon"></i>
    </button>
    <!--  -->
  </div>
</template>

<script>
export default {
  name: "UIOptButtons",

  props: {
    modelValue: {
      type: Number,
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "text", // icon
    },
  },

  emits: ["update:modelValue"],

  //   data() {
  //     return {
  //       options: [
  //         { id: 0, name: "", title: "Текстовый табличный вид", icon: "table", disabled: true },
  //         { id: 1, name: "", title: "Табличный вид с фото", icon: "list" },
  //         { id: 2, name: "", title: "Галлерея", icon: "th" },
  //       ],
  //       selected: null,
  //     };
  //   },

  methods: {
    select(id) {
      this.$emit("update:modelValue", id);
    },
  },
};
</script>
