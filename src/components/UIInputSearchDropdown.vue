<template>
  <div class="field" :class="{ disabled: disabled }">
    <!--  -->
    <label :for="name">
      <slot />
      <template v-if="label">{{ label }}</template>
    </label>
    <!--  -->
    <div class="group">
      <div ref="search" class="ui search selection dropdown">
        <input type="hidden" name="input" />
        <i class="dropdown icon"></i>
        <div class="default text">{{ placeholder }}</div>
      </div>
      <div class="ui compact button" @click="$emit('buttonDidClick')">Выбрать</div>
      <!-- style="flex: 0 0 auto; border-top-left-radius: 0; border-bottom-left-radius: 0;" -->
    </div>
    <!--  -->
  </div>
</template>

<script>
export default {
  name: "UIInputSearchDropdown",

  props: {
    value: [Number],
    placeholder: String,
    label: String,
    name: String,
    disabled: Boolean,
    options: Array,
    searchUrl: String,
  },

  emits: ["buttonDidClick"],

  watch: {
    name(newValue) {
      if (!newValue) {
        $(this.$refs.search).dropdown("clear");
      } else {
        $(this.$refs.search).dropdown("set text", newValue);
      }
    },
    value(newValue) {
      if (!newValue) {
        $(this.$refs.search).dropdown("clear");
      } else {
        $(this.$refs.search).dropdown("set value", newValue);
      }
    },
  },

  mounted() {
    const url_base = import.meta.env.VUE_APP_API_BASE;
    const jwt = localStorage.getItem("JWT");

    var self = this;
    $(this.$refs.search).dropdown({
      clearable: true,
      message: {
        noResults: "Не найдено.",
      },
      apiSettings: {
        // this url parses query server side and re turns filtered results
        url: url_base + this.searchUrl,
        cache: false,
        beforeXHR: (xhr) => {
          // Set Custom Headers here
          xhr.setRequestHeader("Authorization", "Bearer " + jwt);
        },
        onResponse: (response) => {
          // Modify your JSON response into the format SUI wants
          // console.log(response.data);

          const c1 = response.data.map((item) => {
            return { value: item.id, name: item.name };
          });
          var res = {
            results: c1,
          };

          return res;
        },
      },
      onChange: function (value, text) {
        // console.log(value, text, $selectedItem);
        let newValue = parseInt(value);
        if (isNaN(newValue)) {
          newValue = null;
        }

        if (newValue != self.value) {
          self.$emit("input", newValue, text);
        }
      },
    });

    if (this.name) {
      $(this.$refs.search).dropdown("set text", this.name);
      $(this.$refs.search).dropdown("set value", this.value);
    }
  },

  methods: {
    handleChange(event) {
      console.log(event);

      // let value = parseInt(event.target.value);
      // if (isNaN(value)) {
      //   value = null;
      // }
      // this.$emit("input", value);
    },
  },
};
</script>

<style scoped>
.group {
  display: inline-flex;
  width: 100%;
}

.group > .ui.search.selection.dropdown {
  flex: 1 0 auto;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.group > .ui.button {
  flex: 0 0 auto;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
