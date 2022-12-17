<template>
  <tr @click="$emit('eventDetails', item)">
    <!-- <td>{{ item.id }}</td> -->
    <td class="warning"><i class="red warning icon"></i></td>
    <td class="warning">{{ item.document_type }}</td>
    <td class="error">{{ item.description }}</td>
    <td class="warning">{{ item.filename ? item.filename.split(".")[1].toUpperCase() : "" }}</td>
    <td class="warning">{{ item.username }}</td>
    <td class="warning"></td>
  </tr>
</template>

<script>
export default {
  name: "CMDocumentsListItemRequired",

  props: {
    item: {
      type: Object,
    },
  },
  emits: ["eventDetails"],
};
</script>
