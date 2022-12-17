<template>
  <div class="field" :class="[{ disabled: disabled }, gridWidth]">
    <!--  -->
    <label v-if="$slots.default || label" :for="name">
      <slot />
      <template v-if="label">{{ label }}</template>
    </label>
    <!--  -->
    <!-- <div class="group">
      <div class="ui search selection dropdown" ref="search">
        <input type="hidden" name="input" @input="$emit('input', $event.target.value)" />
        <i class="dropdown icon"></i>
        <div class="default text">{{ placeholder }}</div>
      </div>
    </div> -->

    <!-- <div class="group"> -->
    <div ref="group" class="ui search selection dropdown" :class="{ focused, active: menuActive, visible: menuActive }">
      <!-- ui search selection dropdown active visible -->
      <!-- <input type="hidden" name="input" class="noselection" /> -->
      <i class="dropdown icon" @click="handleDrop"></i>
      <input
        ref="input"
        class="search"
        autocomplete="off"
        tabindex="0"
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInput($event.target.value)"
        @blur="handleBlur"
        @focus="handleFocus"
        @keyup.down="handleKeyDown"
        @keyup.up="handleKeyUp"
        @keydown.enter.stop.prevent="handleKeyEnter"
      />
      <div class="default text filtered"></div>
      <!-- menu -->
      <div
        ref="menu"
        class="menu transition hidden"
        tabindex="-1"
        :class="{ hidden: !menuActive, visible: menuActive }"
      >
        <div
          v-for="(item, index) in filteredValues"
          :key="index"
          class="item"
          :data-value="index"
          :class="{ selected: index == menuSelectedIndex }"
          @click="handleSelect(item)"
          @mousedown="handleMouseDown(item)"
        >
          {{ item }}
        </div>
        <!-- <div class="item" data-value="1">Хабаровск</div>
          <div class="item" data-value="2">Благовещенск</div> -->
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "UITextfieldHinted",

  props: {
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    name: String,
    disabled: Boolean,
    options: Array,
    hintName: String,
    gridWidth: {
      type: String,
      default: "",
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      hintValues: [],
      menuSelectedIndex: 0,
      menuActive: false,
      menuClicking: false,
      focused: false,
    };
  },

  computed: {
    filteredValues() {
      return this.hintValues.filter((strValue) => {
        // console.log(strValue, " <-> ", this.value);
        return strValue.toLowerCase().startsWith(this.modelValue ? this.modelValue.toLowerCase() : "");
      });
    },
  },

  mounted() {
    this.fetchAll();
  },

  methods: {
    handleSelect(value) {
      // console.log("selected", value);

      this.$emit("update:modelValue", value);
      this.hideMenu();
      this.$refs["input"].focus();
    },
    handleMouseDown(value) {
      // console.log("Mouse Down: ", value);
      this.menuClicking = true;
    },
    handleInput(value) {
      // console.log(value);
      this.$emit("update:modelValue", value);

      if (this.filteredValues.length > 0 && value.length > 0) {
        this.menuSelectedIndex = 0;
        this.showMenu();
      } else {
        this.hideMenu();
      }
    },
    handleBlur(event) {
      // console.log("Blur Input:", event);
      this.focused = false;
      if (!this.menuClicking) {
        this.hideMenu();
      }
    },
    handleFocus(event) {
      // console.log("focus", event);
      this.focused = true;
      // this.showMenu();
      // this.hideHint();
    },
    handleDrop() {
      // console.log("click");
      this.$refs["input"].focus();

      if (this.filteredValues.length > 0) {
        this.menuSelectedIndex = 0;
        this.showMenu();
      }
      // this.hideHint();
    },
    handleKeyDown() {
      // console.log("Key down");

      if (this.menuActive) {
        if (this.menuSelectedIndex < this.filteredValues.length - 1) {
          this.menuSelectedIndex += 1;
        } else {
          this.menuSelectedIndex = 0;
        }
      } else {
        if (this.filteredValues.length > 0) {
          this.menuSelectedIndex = 0;
          this.showMenu();
        }
      }
    },
    handleKeyUp() {
      // console.log("Key up");
      if (this.menuSelectedIndex > 0) {
        this.menuSelectedIndex -= 1;
      } else {
        this.menuSelectedIndex = this.filteredValues.length - 1;
      }
    },
    handleKeyEnter() {
      // console.log("Key Enter");
      if (this.filteredValues.length > 0 && this.menuActive) {
        this.handleSelect(this.filteredValues[this.menuSelectedIndex]);
      }
    },
    showMenu() {
      this.menuActive = true;
      // this.$refs["menu"].classList.remove("hidden");
      // this.$refs["menu"].classList.add("visible");
      this.$refs["menu"].style.cssText = "display: block !important";

      this.$refs["group"].classList.add("active", "visible");
    },
    hideMenu() {
      this.menuActive = false;
      this.menuClicking = false;

      // this.$refs["menu"].classList.remove("visible");
      // this.$refs["menu"].classList.add("hidden");
      this.$refs["menu"].style.cssText = "";

      this.$refs["group"].classList.remove("active", "visible");
    },
    // hideHint() {
    //   this.$refs["hint"].classList.add("filtered");
    // },

    // Networking
    async fetchAll() {
      try {
        let result = await apiService.getHint(this.hintName);
        this.hintValues = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
  },
};
</script>

<style scoped>
.focused {
  border-color: #85b7d9 !important;
}
</style>
