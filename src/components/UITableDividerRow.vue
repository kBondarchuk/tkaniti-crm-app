<template>
  <tr>
    <td :colspan="cols" class="background-color-white"></td>
  </tr>
</template>

<script>
export default {
  name: "UITableDividerRow",

  props: {
    cols: {
      type: Number,
      default: 2,
    },
  },
};
</script>
