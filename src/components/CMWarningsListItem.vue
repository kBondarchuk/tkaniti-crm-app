<template>
  <tr>
    <td style="padding-left: 1rem; width: 50%; overflow: hidden">
      <span class="text-bold" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
        <template v-if="item.car">{{ item.car }}</template>
        <template v-if="item.customer">{{ item.customer }}</template>
      </span>
      <br />
      <!-- <span v-if="item.branch" class="text-color-grey">{{ item.branch }} филиал</span> -->
    </td>
    <td style="vertical-align: center">{{ item.message }}</td>
  </tr>
</template>

<script>
export default {
  name: "CMWarningsListItem",

  props: {
    item: {
      type: Object,
      default: null,
    },
  },
};
</script>
