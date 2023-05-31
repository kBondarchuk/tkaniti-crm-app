<template>
  <div>
    <UIButton
      text="Новые настройки кассы"
      icon="plus"
      type="right labeled"
      @click="
        selectedItem = null;
        modals.item = true;
      "
    />

    <UITableList
      :id="$options.name"
      :headers="headers"
      :items-count="items.length"
      :is-loading="isLoading"
      bordered
      @header:sort="handleHeaderSort"
    >
      <!-- Items -->
      <CMPrefsOfdListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @event-details="handleDetails"
        @event-edit="$emit('eventEdit', item.id)"
        @event-delete="$emit('eventDelete', item.id)"
      />
    </UITableList>
    <!-- New Expense Modal -->
    <ModalOfdPrefItemEdit
      :active="modals.item"
      :selected-item="selectedItem"
      @hide="modals.item = false"
      @did-change="itemCreated"
    />
    <!------->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMPrefsOfdListItem from "@/components/CMPrefsOfdListItem.vue";
import ModalOfdPrefItemEdit from "@/components/ModalOfdPrefItemEdit.vue";

export default {
  name: "CMPrefsOfd",

  components: {
    CMPrefsOfdListItem,
    ModalOfdPrefItemEdit,
  },

  emits: ["eventEdit", "eventDelete"],

  data() {
    return {
      // api_login: "fermatest1"
      // api_password: "Hjsf3321klsadfAA"
      // description: "ИП Каратаева Л.М."
      // enabled: 1
      // id: 1
      // item_label: "Оплата выкупа автомобиля"
      // name: "larisak"
      // payment_method: 4
      // payment_type: 0
      // taxation_system: "Common"
      // vat: "VatNo"
      headers: [
        { id: "id", name: "ID", class: "" },
        { id: "name", name: "Название", class: "" },
        { id: "notes", name: "Описание", class: "" },
        { id: "api_login", name: "API Login", class: "" },
        { id: "item_label", name: "Услуга", class: "" },
        { id: "enabled", name: "Включено", class: "" },
      ],
      filter: {},
      items: [],
      isLoading: false,
      // Modals
      modals: {
        item: false,
      },
      selectedItem: {},
    };
  },

  methods: {
    handleHeaderSort(filter) {
      this.filter = filter;
      this.refetch(filter);
    },
    handleDelete() {
      // expense_id
      // console.log("delete clicked: " + expense_id);
    },
    handleDetails(item) {
      this.selectedItem = item;
      if (item != null) {
        this.modals.item = true;
      }
    },
    // Modal
    itemCreated() {
      // console.log("branch changed!");
      this.refetch(this.filter);
    },

    parsePayload(items) {
      return items.map((element) => {
        element.payload = JSON.parse(element.payload);
        return element;
      });
    },

    // Network
    async refetch(filter) {
      this.isLoading = true;

      filter["settings_type"] = "ofd";

      try {
        let result = await apiService.getPaymentsSettings(filter);
        // console.log(result);
        this.items = this.parsePayload(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
