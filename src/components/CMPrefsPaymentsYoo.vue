<template>
  <PagesPage>
    <UIButton
      text="Новые настройки Ю-кассы"
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
      <CMPrefsPaymentsAcquiringListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @event-details="handleDetails"
        @event-edit="$emit('eventEdit', item.id)"
        @event-delete="$emit('eventDelete', item.id)"
      />
    </UITableList>
    <!-- New Expense Modal -->
    <ModalPrefsYooItemEdit
      :active="modals.item"
      :selected-item="selectedItem"
      @hide="modals.item = false"
      @did-change="itemCreated"
    />
    <!------->
  </PagesPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMPrefsPaymentsAcquiringListItem from "@/components/CMPrefsPaymentsAcquiringListItem.vue";
import ModalPrefsYooItemEdit from "@/components/ModalPrefsYooItemEdit.vue";
import PagesPage from "@/components/PagesPage.vue";

export default {
  name: "CMPrefsPaymentsYoo",

  components: {
    CMPrefsPaymentsAcquiringListItem,
    ModalPrefsYooItemEdit,
    PagesPage,
  },

  emits: ["eventEdit", "eventDelete"],

  data() {
    return {
      headers: [
        { id: "id", name: "ID", class: "" },
        { id: "name", name: "Название", class: "" },
        { id: "notes", name: "Описание", class: "" },
        { id: "api_login", name: "API Login", class: "" },
        { id: "api_url", name: "API URL", class: "" },
        // { id: "success_url", name: "Success callback URL", class: "" },
        // { id: "fail_url", name: "Fail callback URL", class: "" },
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

      filter["settings_type"] = "yoo";

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
