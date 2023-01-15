<template>
  <div>
    <UIButton
      icon="plus"
      type="right labeled"
      @click="
        selectedBranch = null;
        modals.branch = true;
      "
    >
      Добавить процент
    </UIButton>

    <UITableList
      id="CMPrefsPercentTable"
      :headers="headers"
      :items-count="items.length"
      :is-loading="isLoading"
      bordered
      no-sort
      class="collapsing"
    >
      <!-- Items -->
      <CMPrefsPercentTableitem
        v-for="(item, index) in items"
        :key="item.term"
        :item="item"
        :prev-term="index > 0 ? items[index - 1].term + 1 : 1"
        @event-details="handleDetails"
        @delete="handleDelete(item)"
      />
    </UITableList>
    <!-- New Expense Modal -->
    <ModalPercentTable
      :active="modals.branch"
      :selected-item="selectedBranch"
      @hide="modals.branch = false"
      @did-change="didChange"
    />
    <!------->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMPrefsPercentTableitem from "@/components/CMPrefsPercentTableitem.vue";
import ModalPercentTable from "@/components/ModalPercentTable.vue";

export default {
  name: "CMPrefsPercentTable",

  components: {
    CMPrefsPercentTableitem,
    ModalPercentTable,
  },

  emits: ["eventEdit", "eventDelete"],

  data() {
    return {
      percentTable: [],
      // View
      headers: [
        // { id: "id", name: "id", class: "" },
        { id: "term", name: "Срок в днях", class: "right aligned" },
        { id: "percent", name: "Дневной процент", class: "right aligned" },
        // { id: "delete", name: "Удалить", class: "" },
      ],
      filter: {},
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
      return this.percentTable;
    },
  },

  // Modal
  created() {
    console.log("[CMPrefsPercentTable]: created");
    this.refetch(this.filter);
  },

  methods: {
    handleHeaderSort(filter) {
      this.filter = filter;
      this.refetch(filter);
    },
    handleDelete(item) {
      // expense_id
      console.log("delete clicked: " + item);
    },
    handleDetails(item) {
      this.selectedBranch = item;
      if (item != null) {
        this.modals.branch = true;
      }
    },

    didChange() {
      this.refetch(this.filter);
    },

    // Network
    async refetch(filter) {
      this.isLoading = true;

      try {
        let result = await apiService.getLeasePercentTable();
        // console.log(result);
        this.percentTable = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
