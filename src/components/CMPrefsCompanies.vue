<template>
  <div>
    <UIButton
      icon="plus"
      type="right labeled"
      text="Новое юр. лицо"
      @click="
        selectedBranch = null;
        modals.branch = true;
      "
    />

    <UITableList
      :id="$options.name"
      :headers="headers"
      :items-count="branches.length"
      :is-loading="isLoading"
      bordered
      @header:sort="handleHeaderSort"
    >
      <!-- Items -->
      <CMPrefsCompaniesListItem
        v-for="item in branches"
        :key="item.id + '-branch-' + item.customer_id"
        :item="item"
        @event-details="handleDetails"
        @event-edit="$emit('eventEdit', item.id)"
        @event-delete="$emit('eventDelete', item.id)"
      />
    </UITableList>
    <!-- New Expense Modal -->
    <ModalCompanyEdit
      :active="modals.branch"
      :selected-item="selectedBranch"
      @hide="modals.branch = false"
      @did-change="branchCreated"
    />
    <!------->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMPrefsCompaniesListItem from "@/components/CMPrefsCompaniesListItem.vue";
import ModalCompanyEdit from "@/components/ModalCompanyEdit.vue";
// import UIButton from "@/components/UIButton.vue";

export default {
  name: "CMPrefsCompanies",
  components: {
    CMPrefsCompaniesListItem,
    ModalCompanyEdit,
    // UIButton,
  },
  emits: ["eventEdit", "eventDelete"],
  data() {
    return {
      headers: [
        { id: "id", name: "ID", class: "" },
        { id: "name", name: "Название", class: "" },
        // { id: "inn", name: "ИНН", class: "" },
        // { id: "acq_settings_name", name: "Эквайринг", class: "" },
        // { id: "sbp_settings_name", name: "СБП", class: "" },
        // { id: "acq_ofd_settings_name", name: "Касса экв.", class: "" },
        // { id: "sbp_ofd_settings_name", name: "Касса СБП", class: "" },
        { id: "details", name: "Реквизиты", class: "" },
        { id: "bank_details", name: "Банковские реквизиты", class: "" },
      ],
      filter: {},
      branches: [],
      isLoading: false,
      // Modals
      modals: {
        branch: false,
      },
      selectedBranch: {},
    };
  },
  computed: {
    items() {
      return this.report;
    },
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
      this.selectedBranch = item;
      if (item != null) {
        this.modals.branch = true;
      }
    },
    // Modal
    branchCreated() {
      // console.log("branch changed!");
      this.refetch(this.filter);
    },
    // Network
    async refetch(filter) {
      this.isLoading = true;

      try {
        let result = await apiService.getCompanies(filter);
        // console.log(result);
        this.branches = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
