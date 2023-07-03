<template>
  <LayoutPage no-vertical-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <!-- Back -->
      <YBackButton :to="isEditMode ? RouteNames.Goods.Details : RouteNames.Goods.List" force />
      <UISpacer />
      <!-- Save -->
      <UIButton text="Сохранить" type="primary" :class="validateSubmit" @click.prevent="actionsSave" />
    </template>

    <!-- Form -->
    <form
      class="ui form"
      method="post"
      action
      :class="{ loading: isLoading }"
      style="height: 100%; margin-top: 1rem; margin-bottom: 1rem"
    >
      <!-- Grid -->
      <div class="ui grid" style="height: 100%">
        <!-- fist column -->
        <div class="six wide column">
          <div class="two fields">
            <!-- Бренд -->
            <UITextfield v-model.trim.lazy="good.brand" label="Бренд" />
            <!-- Наименование -->
            <UITextfield v-model.trim.lazy="good.name" label="Наименование" />
          </div>

          <!-- Артикул -->
          <div class="two fields">
            <UITextfield v-model.trim.lazy="good.code" label="Артикул" />
          </div>

          <!-- Цена -->
          <UITextAria v-model="good.description" label="Описание" />

          <!-- Комментарий -->
          <UITextAria
            v-model="good.notes"
            label="Комментарий"
            placeholder="Для внутреннего использования. Не публикуется."
          />

          <div class="ui hidden divider"></div>

          <!-- <a class="negative ui button">Удалить запись</a> -->
          <div class="ui error message"></div>
        </div>

        <!-- 2 column -->
        <div class="six wide second column">
          <UITextfield v-for="item in categorySpecs" :key="item[0]" v-model="good.specs[item[0]]" :label="item[1]" />
        </div>

        <!-- 3 column -->
        <div class="four wide second column">
          <!-- Категория товара -->
          <UIInputDropdown
            v-model="good.category_id"
            label="Категория товара"
            :options="optionsCategories"
            :disabled="isEditMode"
          />

          <!-- Остаток -->
          <UIInputMoney
            :key="'ost' + measureFraction"
            v-model="good.quantity"
            :label="'Исходный остаток ' + measureName"
            :disabled="!good.category_id"
            :decimal-scale="measureFraction"
          />

          <!-- Цена -->
          <UIInputMoney v-model="good.price" label="Цена" />
        </div>
      </div>
      <br />
    </form>

    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";
import RouteNames from "@/router/routeNames";

import GoodObject from "@/objects/Good";

export default {
  name: "GoodEditView",

  mixins: [viewMixin],

  props: {
    goodId: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      // model data
      good: Object.assign({}, GoodObject),
      // measures: [],
      categories: [],
      // view
      view: {
        title: "Товар",
        subTitle: "Редактирование товара",
      },
      isLoading: false,
      RouteNames,
    };
  },

  computed: {
    isEditMode() {
      return this.goodId ? true : false;
    },
    // optionsMeasures() {
    //   let menu = [{ name: "Не выбран", value: null }].concat(
    //     this.measures.map((item) => {
    //       return { name: item.name, value: item.id };
    //     })
    //   );
    //   return menu;
    // },
    optionsCategories() {
      let menu = [{ name: "Не выбран", value: null }].concat(
        this.categories.map((item) => {
          return { name: item.name, value: item.id };
        })
      );
      return menu;
    },
    measureFraction() {
      const self = this;
      const _item = this.categories.find((item) => item.id == self.good.category_id);
      return _item?.measure_system_fraction;
    },
    measureName() {
      const self = this;
      const _item = this.categories.find((item) => item.id == self.good.category_id);
      return _item?.measure_name;
    },
    categorySpecs() {
      const self = this;
      const _item = this.categories.find((item) => item.id == self.good.category_id);
      return _item?.specs_meta ? Object.entries(JSON.parse(_item?.specs_meta)) : null;
    },
    validateSubmit() {
      return {
        disabled:
          !this.good.category_id ||
          !this.good.price ||
          !this.good.quantity ||
          !this.good.brand ||
          !this.good.description,
      };
    },
  },

  async created() {
    console.log("Created goodId: " + this.goodId);

    await this.fetchCategories();

    this.setTitle();
    this.reset();

    if (this.goodId) {
      await this.fetchGood(this.goodId);
    }
  },

  methods: {
    setTitle() {
      if (!this.isEditMode) {
        this.view.title = "Новый товар";
        this.view.subTitle = "Создание нового товара";
      } else {
        this.view.title = "Товар" + " " + this.goodId;
      }
    },
    // ---
    reset() {
      if (!this.isEditMode) {
        // If NEW good
        // Set default Good Category and Name
        const defaultCatId = this.categories.find((item) => item.default == 1);
        this.good.category_id = defaultCatId.id;
        this.good.name = defaultCatId?.name;
        // console.warn(defaultCatId.id);
      }
    },

    actionsSave() {
      console.log("[SAVE] " + JSON.stringify(this.good));
      if (!this.isEditMode) {
        console.log("create");
        this.create();
      } else {
        console.log("update");
        this.update();
      }
    },

    // Networking
    async fetchGood(good_id) {
      this.isLoading = true;
      try {
        this.good = await apiService.getGood(good_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchCategories() {
      this.isLoading = true;
      try {
        this.categories = await apiService.getGoodCategories();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async create() {
      console.log("Create ", this.good);
      this.isLoading = true;
      try {
        let result = await apiService.createGood(this.good);
        this.good = result;
        this.$router.push({ name: RouteNames.Goods.Details, params: { id: result.id } });
      } catch (error) {
        console.error("!!!! " + error);
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async update() {
      console.log("Update ", this.good);
      this.isLoading = true;
      try {
        let result = await apiService.updateGood(this.good.id, this.good);
        this.good = result;
        this.$router.push({ name: RouteNames.Goods.Details, params: { id: result.id } });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.second.column {
  border-left: 1px solid #80808040;
  padding-left: 1rem !important;
}
</style>
