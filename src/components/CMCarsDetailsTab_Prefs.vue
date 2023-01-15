<template>
  <div>
    <!-- Toolbar -->
    <!-- <div class="ui-tool-bar-local">
      <UISpacer />
      <UIButton color="" icon="right chevron" type="right labeled" @click="actionNewData">Внести пробег</UIButton>
    </div> -->
    <!-- <div class="ui divider"></div> -->
    <!-- /Toolbar -->
    <!-- Grid -->
    <div class="ui grid">
      <!-- fist column -->
      <div class="eight wide column" style="margin-left: 1.5em">
        <h5>НЕ ПРОВЕРЯТЬ ДОКУМЕНТ</h5>
        <div style="padding-left: 1em">
          <!-- Docs ignores -->
          <div v-for="item in items" :key="item.value" style="margin-bottom: 0.5em">
            <UICheckbox
              :id="'check' + item.value"
              :model-value="params.includes(item.value)"
              :label="item.name"
              @update:model-value="doCheck(item.value)"
            />
          </div>
        </div>
        <!-- <UITableList
          id="CarPrefsCategories"
          :items-count="items.length"
          :is-loading="isLoading"
          no-sort
          title="Не проверять документ"
        > -->
        <!--  -->
        <!-- <tr v-for="item in items" :key="item.value">
            <td>
              <UICheckbox
                :id="'check' + item.value"
                :model-value="params.includes(item.value)"
                :label="item.name"
                @update:model-value="doCheck(item.value)"
              />
            </td>
          </tr> -->
        <!--  -->
        <!-- </UITableList> -->
      </div>
      <div class="eight wide column"></div>
    </div>
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

import UICheckbox from "@/components/UICheckbox.vue";

export default {
  name: "CMCarsDetailsTabPrefs",

  components: {
    UICheckbox,
  },

  props: {
    car: {
      type: Object,
      default: null,
    },
  },

  emits: ["update"],

  data() {
    return {
      items: [],
      params: [],
      category: "car",
      isLoading: false,
    };
  },

  watch: {
    car: {
      immediate: true,
      handler() {
        // console.log(this.car.id);
        if (this.car.id) {
          this.getPrefs();
        }
      },
    },
  },

  mounted() {
    this.refetch(1);
  },

  methods: {
    async doCheck(value) {
      const index = this.params.indexOf(value);

      if (index > -1) {
        this.params.splice(index, 1);
      } else {
        this.params.push(value);
      }
      // console.warn(this.params);
      await this.savePrefs();
      this.$emit("update");
    },

    // Networking
    // async save() {
    //   console.warn(this.params.join(","));
    // },
    async getPrefs() {
      this.isLoading = true;
      try {
        let result = await apiService.getCarPrefs(this.car.id);
        // console.warn(result);

        this.params = result.doc_types_ignore.split(",").filter(Boolean).map(Number);

        // console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async savePrefs() {
      this.isLoading = true;
      const joined = this.params.join(",");

      try {
        let result = await apiService.updateCarPrefs(this.car.id, { doc_types_ignore: joined });
        // console.warn(result);

        // console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      } finally {
        this.isLoading = false;
      }
    },
    async refetch() {
      this.isLoading = true;
      const self = this;

      try {
        let result = await apiService.getDocumentsTypes();
        this.items = result.filter((item) => item.required === 1 && item.category === self.category);
        // console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
