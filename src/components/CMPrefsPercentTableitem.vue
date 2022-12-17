<template>
  <tr @click="$emit('eventDetails', item)">
    <!-- <td>{{ item.id }}</td> -->
    <td class="right aligned">
      {{ prevTerm }} &ndash; <strong>{{ item.term }}</strong>
    </td>
    <td class="right aligned">{{ item.percent }}</td>
    <!-- <td><span @click.stop="$emit('delete', item)">❌</span></td> -->
  </tr>
</template>

<script>
export default {
  name: "CMPrefsCompaniesListItem",

  components: {},

  props: {
    item: {
      type: Object,
      default: null,
    },
    prevTerm: {
      type: Number,
      default: null,
    },
  },

  emits: ["eventDetails", "delete"],
};
</script>
