<template>
  <tfoot>
    <tr>
      <th :colspan="columnsCount">
        <!--  -->
        <UIButton
          icon="step backward"
          class="sm-btn basic"
          :class="{ disabled: page == 0 }"
          title="На первую страницу"
          @click="$emit('paging:first')"
        />
        <!--  -->
        <UIButton
          icon="left chevron"
          class="sm-btn basic"
          :class="{ disabled: page == 0 }"
          title="На предыдущую страницу"
          @click="$emit('paging:down')"
        />
        <!--  -->
        <UIButton class="sm-btn basic"
          >Страница: {{ page + 1 }}
          <span v-if="totalPages">из {{ totalPages }}</span>
        </UIButton>
        <!--  -->
        <UIButton
          icon="right chevron"
          class="sm-btn basic"
          title="На следующую страницу"
          :class="{
            disabled: totalPages == 0 || page == totalPages - 1,
          }"
          @click="$emit('paging:up')"
        />
        <!--  -->
        <UIButton
          icon="step forward"
          class="sm-btn basic"
          title="На последнюю страницу"
          :class="{
            disabled: totalPages == null || totalPages == 0 || page == totalPages - 1,
          }"
          @click="$emit('paging:last')"
        />
        <!--  -->
        <span v-if="totalCount" class="text-color-grey" style="margin-left: 3em">Всего {{ totalCount }} записей</span>
      </th>
    </tr>
  </tfoot>
</template>

<script>
export default {
  name: "UITableListFooter",

  props: {
    columnsCount: {
      type: Number,
    },
    page: {
      type: Number,
    },
    totalPages: {
      type: Number,
    },
    totalCount: {
      type: Number,
    },
  },

  emits: ["paging:first", "paging:down", "paging:up", "paging:last"],
};
</script>

<style scoped>
.sm-btn {
  padding-top: 0.34em !important;
  padding-bottom: 0.3em !important;
}
</style>
