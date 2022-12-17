<template>
  <tr @click="$emit('eventDetails', item)">
    <!-- <td>{{ item.id }}</td> -->
    <td>{{ $filters.date(item.upload_ts) }}</td>
    <td>{{ item.document_type }}</td>
    <td>{{ item.description }}</td>
    <td>{{ item.filename ? item.filename.split(".")[1].toUpperCase() : "" }}</td>
    <td>{{ item.username }}</td>
    <td class="right aligned">
      <div
        class="ui icon left pointing dropdown compact small circular button"
        :class="{ disabled }"
        @click.stop="contextMenu($event)"
      >
        <i class="bars icon"></i>
        <!-- Menu -->
        <UIContextMenu
          :items="[
            { name: 'Редактировать', icon: 'edit', eventName: 'eventEdit' },
            { name: 'Удалить', icon: 'delete', eventName: 'eventDelete' },
          ]"
          :return-value="item.id"
        />
        <!-- <div class="menu">
          <div class="item" @click.stop="$emit('eventEdit', item.id)">
            <i class="edit icon"></i> Редактировать
          </div>
          <div class="item" @click.stop="$emit('eventDelete', item.id)">
            <i class="delete icon"></i> Удалить
          </div>
        </div>-->
        <!-- /Menu -->
      </div>
    </td>
  </tr>
</template>

<script>
import UIContextMenu from "@/components/UIContextMenu.vue";

export default {
  name: "CMDocumentsListItem",
  components: {
    UIContextMenu,
  },
  props: {
    item: {
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["eventDetails"],

  methods: {
    contextMenu($event) {
      $(".dropdown.circular.button").dropdown("hide");
      $($event.currentTarget).dropdown({ action: "hide" }).dropdown("show");
    },
  },
};
</script>

<style scoped>
.ui.circular.button {
  background-color: transparent;
  padding: 3px;
}
.ui.circular.button:hover {
  background-color: #cacbcd;
}
</style>
