<template>
  <div>
    <UIButton
      icon="plus"
      type="right labeled "
      @click="
        selectedBranch = {};
        modals.branch = true;
      "
      >Новый филиал</UIButton
    >

    <UITableList
      id="CMPrefsBranches"
      :headers="headers"
      :items-count="branches.length"
      :is-loading="isLoading"
      bordered
      @header:sort="handleHeaderSort"
    >
      <!-- Items -->
      <CMPrefsBranchListItem
        v-for="item in branches"
        :key="item.id + '-branch-' + item.customer_id"
        :item="item"
        @event-details="handleDetails"
        @event-edit="$emit('eventEdit', item.id)"
        @event-delete="$emit('eventDelete', item.id)"
      ></CMPrefsBranchListItem>
    </UITableList>
    <!-- New Expense Modal -->
    <FormBranchEdit
      :active="modals.branch"
      :branch-id="selectedBranch.id"
      :selected-item="selectedBranch"
      @hide="modals.branch = false"
      @did-change="branchCreated"
    ></FormBranchEdit>
    <!------->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMPrefsBranchListItem from "@/components/CMPrefsBranchListItem.vue";
import FormBranchEdit from "@/components/FormBranchEdit.vue";

export default {
  name: "CMPrefsBranches",
  components: {
    CMPrefsBranchListItem,
    FormBranchEdit,
  },
  emits: ["eventEdit", "eventDelete"],
  data() {
    return {
      headers: [
        { id: "id", name: "ID", class: "" },
        { id: "name", name: "Название", class: "" },
        { id: "short_name", name: "Сокр. название", class: "" },
        { id: "description", name: "Описание", class: "" },
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
        let result = await apiService.getBranches(filter);
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
