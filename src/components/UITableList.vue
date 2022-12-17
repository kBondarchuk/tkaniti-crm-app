<template>
  <table
    class="ui very compact unstackable table"
    :class="{
      loading: isLoading,
      'very basic': !bordered,
      selectable: !notSelectable,
      sortable: !noSort,
      small: size == 'small',
      big: size == 'big',
      striped: striped,
      complex: !striped,
    }"
    style="transition: opacity 0.2s; transition-timing-function: ease-in-out"
  >
    <UITableHeader
      :title="title"
      :headers="headers"
      :filter="sortParams"
      :sticky-at="headerStickedAt"
      :no-sort="noSort"
      @header:sort="onHeaderSort"
    />
    <tbody>
      <!-- Empty -->
      <tr v-if="!itemsCount">
        <td
          class="disabled"
          :colspan="headers.length"
          style="padding-top: 3rem; padding-bottom: 3rem; text-align: center; font-size: 1.5rem"
        >
          <!-- Loader -->
          <div v-if="isLoading" class="ui active inline center large double loader"></div>
          <span v-else-if="emptyText">{{ emptyText }}</span>
          <span v-else>Список пуст</span>
        </td>
      </tr>
      <!-- Items -->
      <slot />
    </tbody>
    <!-- <tfoot v-if="this.$slots.footer && itemsCount">
      <slot name="footer"></slot>
    </tfoot> -->
    <!-- Paging -->
    <UITableListFooter
      v-if="pagination !== null && !(hidePaging && (pagination.total_pages <= 1 || itemsCount == 0))"
      :page="pagination.page"
      :total-pages="pagination.total_pages"
      :total-count="pagination.total_count"
      :columns-count="_columnsCount"
      @paging:up="$emit('paging:up')"
      @paging:down="$emit('paging:down')"
      @paging:first="$emit('paging:first')"
      @paging:last="$emit('paging:last')"
    />
  </table>
</template>

<script>
import UITableHeader from "@/components/UITableHeader.vue";
import UITableListFooter from "@/components/UITableListFooter.vue";

export default {
  name: "UITableList",

  components: {
    UITableHeader,
    UITableListFooter,
  },

  props: {
    id: {
      type: String,
    },
    title: {
      type: String,
      default: null,
    },
    emptyText: {
      type: String,
      default: null,
    },
    headers: {
      type: Array,
      default: () => [],
    },
    headerStickedAt: {
      type: Number,
      default: null,
    },
    noSort: {
      type: Boolean,
      default: false,
    },
    notSelectable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "small",
      validator: function (value) {
        // The value must match one of these strings
        return ["", "small", "large", "big"].indexOf(value) !== -1;
      },
    },
    itemsCount: {
      type: Number,
      default: null,
    },
    columnsCount: {
      type: Number,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    striped: {
      type: Boolean,
      default: false,
    },
    hidePaging: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object,
      default: null,
    },
  },

  emits: ["header:sort", "paging:first", "paging:down", "paging:up", "paging:last"],

  data() {
    return {
      sortParams: { sort_by: "id", sort_order: "desc" },
      // pagination: { page: 0, per_page: 10 },
    };
  },

  computed: {
    _columnsCount() {
      return this.columnsCount >= this.headers.length ? this.columnsCount : this.headers.length;
    },
  },

  // mounted() {
  //   console.warn("UITableList: mounted: ", this.sortParams);
  //   let newFilter = { ...this.sortParams, ...this.pagination };
  //   this.$emit("header:sort", newFilter);
  // },

  created() {
    // Load table sort params
    if (this.id && !this.noSort) {
      const sort = JSON.parse(localStorage.getItem("lists.sort." + this.id));

      if (sort) {
        this.sortParams = sort;
      }
    }

    let newFilter = { ...this.sortParams, ...this.pagination };
    this.$emit("header:sort", newFilter);
  },

  methods: {
    onHeaderSort(filter) {
      let newFilter = { ...filter, ...this.pagination };
      this.$emit("header:sort", newFilter);
      // Save sort params
      if (this.id && !this.noSort) {
        localStorage.setItem("lists.sort." + this.id, JSON.stringify(filter));
      }
    },
    // Paging
    /*
    increasePage() {
      // this.pagination.page++;
      // let newFilter = { ...this.sortParams, ...this.pagination };
      this.$emit("paging:up");
    },
    decreasePage() {
      if (this.pagination.page == 0) return;
      // this.pagination.page--;
      // let newFilter = { ...this.sortParams, ...this.pagination };
      this.$emit("paging:down");
    },
    firstPage() {
      if (this.pagination.page == 0) return;
      this.$emit("paging:first");
    },
    lastPage() {
      this.$emit("paging:last");
    },
    */
  },
};
</script>
