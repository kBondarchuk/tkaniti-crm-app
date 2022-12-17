<template>
  <div>
    <!-- <div class="ui center aligned segment empty text-color-grey" v-if="!count && !loading">{{ emptyText }}</div> -->
    <table class="ui very compact small selectable sortable table" :class="{ loading: loading }">
      <thead>
        <tr v-if="title">
          <th colspan="10" class="ui center aligned" style="text-transform: uppercase">{{ title }}</th>
        </tr>
        <tr>
          <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <!-- Empty -->
        <tr v-if="!count && !loading">
          <td
            class="disabled"
            :colspan="headers.length"
            style="padding-top: 3rem; padding-bottom: 3rem; text-align: center; font-size: 1.5rem"
          >
            <div v-if="loading" class="ui active inline center large double loader"></div>
            <span v-else>Список пуст</span>
          </td>
        </tr>
        <slot @eventDetails="click"></slot>
      </tbody>
      <tfoot v-if="$slots.footer">
        <slot name="footer"></slot>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  name: "UITable",
  props: {
    title: {
      type: String,
    },
    emptyText: {
      type: String,
    },
    headers: {
      type: Array,
      default: () => [],
    },
    count: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    click() {
      console.log("clsikc");
    },
  },
};
</script>

<style scoped>
.segment.empty {
  box-shadow: none;
  -webkit-box-shadow: none;
}
</style>
