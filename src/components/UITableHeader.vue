<template>
  <thead>
    <tr v-if="title">
      <th colspan="10" class="ui center aligned" style="text-transform: uppercase">{{ title }}</th>
    </tr>
    <tr v-if="headers.length > 0">
      <template v-for="header in headers" :key="header.id">
        <!-- array -->
        <!-- <th
          v-if="Array.isArray(header)"
          :class="[header.class, headerClass(header[0].id)]"
          :style="[header.style, { top: stickyAt + 'px' }]"
          @click="handleHeaderClick(header[0].id)"
        >
          <template v-for="item in header" :key="item.id">
            <span style="margin-left: 0.5em" @click.stop="handleHeaderClick(item.id)">{{ item.name }} </span>
          </template>
        </th> -->
        <!-- string -->
        <th
          :class="[header.class, headerClass(header.id)]"
          :style="[header.style, { top: stickyAt + 'px' }]"
          @click="handleHeaderClick(header.id)"
        >
          {{ header.name }}
        </th>
      </template>

      <!--  -->
    </tr>
  </thead>
</template>

<script>
export default {
  name: "UITableHeader",

  props: {
    title: {
      type: String,
      default: null,
    },
    headers: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: Object,
      default() {
        return { sort_by: "id", sort_order: "desc" };
      },
    },
    stickyAt: {
      type: Number,
      default: null,
    },
    noSort: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["header:sort"],

  methods: {
    handleHeaderClick(id) {
      if (this.noSort) return;
      console.log(id);

      let newFilter = this.filter;

      if (this.filter.sort_by == id) {
        if (this.filter.sort_order == "asc") {
          newFilter.sort_order = "desc";
        } else {
          newFilter.sort_order = "asc";
        }
      } else {
        newFilter.sort_by = id;
      }
      this.$emit("header:sort", newFilter);
    },

    headerClass(header_id) {
      return [
        {
          sorted: header_id == this.filter.sort_by,
          " descending": header_id == this.filter.sort_by && this.filter.sort_order == "desc",
          " ascending": header_id == this.filter.sort_by && this.filter.sort_order == "asc",
        },
        { sticked: this.stickyAt != null },
      ];
    },
  },
};
</script>

<style scoped>
.ui.basic.table > thead > tr > th.sticked {
  background: #f9fafb;
}
</style>
