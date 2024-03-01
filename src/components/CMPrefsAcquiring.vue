<template>
  <div>
    <UIButton
      text="Новые настройки эквайринга"
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
      <CMPrefsAcquiringListItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        @event-details="handleDetails"
        @event-edit="$emit('eventEdit', item.id)"
        @event-delete="$emit('eventDelete', item.id)"
      />
    </UITableList>
    <!-- New Expense Modal -->
    <ModalPrefsAcquiringItemEdit
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
import CMPrefsAcquiringListItem from "@/components/CMPrefsAcquiringListItem.vue";
import ModalPrefsAcquiringItemEdit from "@/components/ModalPrefsAcquiringItemEdit.vue";

export default {
  name: "CMPrefsAcquiring",

  components: {
    CMPrefsAcquiringListItem,
    ModalPrefsAcquiringItemEdit,
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

      filter["settings_type"] = "acq";

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
