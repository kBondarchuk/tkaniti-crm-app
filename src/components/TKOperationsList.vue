<template>
  <UITableList
    :id="$options.name"
    :headers="headers"
    :items-count="list.length"
    :is-loading="isLoading"
    :pagination="pagination"
    :bordered="!noBorder"
    :size="$attrs['size']"
    :striped="$attrs['striped']"
    not-selectable
    no-sort
    @paging:up="handlePagingUp"
    @paging:down="handlePagingDown"
    @paging:first="handlePagingFirst"
    @paging:last="handlePagingLast"
    @header:sort="handleHeaderSort"
  >
    <TKOperationsListItem
      v-for="item in list"
      :key="item.id"
      :item="item"
      :show-id="showId"
      :show-branch="showBranch"
      :show-author="showAuthor"
      :show-basis="showBasis"
      :show-double-amount="showDoubleAmount"
      :show-subjects="showSubjects"
      :show-object="showObject"
      @event-details="$emit('eventDetails', item)"
    />
  </UITableList>
</template>

<script>
import apiService from "@/services/api.service.js";
import UITableList from "@/components/UITableList.vue";
import TKOperationsListItem from "@/components/TKOperationsListItem.vue";

export default {
  name: "TKOperationsList",

  components: {
    TKOperationsListItem,
    UITableList,
  },

  props: {
    operationsType: {
      type: String,
      default: null,
      validator: function (value) {
        // The value must match one of these strings
        return ["orders"].indexOf(value) !== -1;
      },
    },
    operationsSubType: {
      type: String,
      default: null,
      validator: function (value) {
        // The value must match one of these strings
        return ["investments", ""].indexOf(value) !== -1;
      },
    },
    operationsSubjectId: {
      type: Number,
      default: null,
    },
    showId: {
      type: Boolean,
      default: true,
    },
    showBranch: {
      type: Boolean,
      default: false,
    },
    showAuthor: {
      type: Boolean,
      default: true,
    },
    showBasis: {
      type: Boolean,
      default: true,
    },
    showDoubleAmount: {
      type: Boolean,
      default: true,
    },
    showSubjects: {
      type: Boolean,
      default: false,
    },
    showObject: {
      type: Boolean,
      default: false,
    },
    noBorder: {
      type: Boolean,
      default: false,
    },
    displayedItems: {
      type: Number,
      default: 30,
    },
  },
  emits: ["eventDetails"],

  data() {
    return {
      list: [],
      isLoading: false,
      pagination: {
        page: 0,
        per_page: this.displayedItems,
      },
      sort: { sort_by: "dt", sort_order: "desc" },
    };
  },

  computed: {
    headers() {
      var headers = [
        { name: "No.", id: "id" },
        { name: "Дата", id: "dt" },
        { name: "Тип", id: "operation_name" },
        { name: "Объект", id: "object_name" },
        // { name: "Статья расхода", id: "category_name" },
        { name: "Филиал", id: "branch" },
        { name: "Куда", id: "subject1_type" },
        { name: "Откуда", id: "subject2_type" },
        { name: "Создал", id: "user" },
        { name: "Сумма", class: "right aligned", id: "amount" },
        { name: "Сумма +", class: "right aligned", id: "amount_plus" },
        { name: "Сумма -", class: "right aligned", id: "amount_minus" },
        { name: "Заказ", id: "basis" },
        { name: "Примечание", id: "notes" },
      ];

      // show id
      if (!this.showId) {
        headers = headers.filter((item) => {
          return item.id != "id";
        });
      }
      // show branch
      if (!this.showBranch) {
        headers = headers.filter((item) => {
          return item.id != "branch";
        });
      }
      // show author
      if (!this.showAuthor) {
        headers = headers.filter((item) => {
          return item.id != "user"; //&& item.id != "category_name";
        });
      }
      // show basis
      if (!this.showBasis) {
        headers = headers.filter((item) => {
          return item.id != "basis"; //&& item.id != "category_name";
        });
      }
      // show object
      if (!this.showObject) {
        headers = headers.filter((item) => {
          return item.id != "object_name"; //&& item.id != "category_name";
        });
      }
      // show Subjects
      if (!this.showSubjects) {
        headers = headers.filter((item) => {
          return item.id != "subject1_type" && item.id != "subject2_type";
        });
      }
      // show showDoubleAmount
      if (!this.showDoubleAmount) {
        headers = headers.filter((item) => {
          return item.id != "amount_minus" && item.id != "amount_plus";
        });
      } else {
        headers = headers.filter((item) => {
          return item.id != "amount";
        });
      }

      // show basis
      if (!this.showSubjects) {
        headers = headers.filter((item) => {
          return item.id != "subject1" && item.id != "subject2";
        });
      }

      return headers;
    },
  },

  watch: {
    operationsType(_new, _old) {
      console.log("operations_type:", _old, " -> ", _new);

      this.pagination.page = 0;
      this.refetch();
    },
    operationsSubjectId(_new, _old) {
      console.log("operationsSubjectId:", _old, " -> ", _new);

      this.pagination.page = 0;
      this.refetch();
    },
  },
  mounted() {
    this.refetch();
    // console.log(this.$attrs);
  },

  methods: {
    eventDetails(item) {
      console.log("Details clicked id: " + item.id);
    },
    handleHeaderSort(item) {
      console.log(item, " SORTING DISABLED");

      // this.sort = item;
      // this.refetch();
    },
    handlePagingUp() {
      this.pagination.page++;
      console.log(this.pagination);
      this.refetch();
    },
    handlePagingDown() {
      this.pagination.page--;
      console.log(this.pagination);
      this.refetch();
    },
    handlePagingFirst() {
      this.pagination.page = 0;
      this.refetch();
    },
    handlePagingLast() {
      this.pagination.page = this.pagination.total_pages - 1;
      this.refetch();
    },

    // Network
    async refetch() {
      var filter = { ...this.sort, ...this.pagination };

      this.isLoading = true;
      try {
        let data, meta;

        if (this.operationsType !== null) {
          ({ data, meta } = await apiService.getOperationsFor(
            this.operationsType,
            this.operationsSubType,
            this.operationsSubjectId,
            filter
          ));
        } else {
          ({ data, meta } = await apiService.getOperationsAll(filter));
        }

        // Items
        this.list = data || [];
        // Meta
        if (meta) {
          console.log(meta);
          this.pagination.total_count = meta.total_count;
          this.pagination.total_pages = meta.total_pages;
        } else {
          this.pagination.total_count = 0;
          this.pagination.total_pages = 0;
        }
        //
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
