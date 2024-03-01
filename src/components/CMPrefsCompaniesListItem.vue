<template>
  <tr :class="{ warning: item.warnings > 0 }" @click="$emit('eventDetails', item)">
    <td>{{ item.id }}</td>
    <td class="nobr">{{ item.name }}</td>
    <!-- <td class="nobr">{{ item.acq_settings_name }}</td>
    <td class="nobr">{{ item.sbp_settings_name }}</td>
    <td class="nobr">{{ item.acq_ofd_settings_name }}</td>
    <td class="nobr">{{ item.sbp_ofd_settings_name }}</td> -->
    <td>{{ item.details }}</td>
    <td>{{ item.bank_details }}</td>
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
  },
  emits: ["eventDetails"],
};
</script>
