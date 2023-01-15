<template>
  <div>
    <!-- Toolbar -->
    <UIButton
      v-if="!disabled"
      text="Добавить документ"
      color=""
      icon="paperclip"
      type="basic right "
      :class="{ disabled: disabled || !folderUuid }"
      @click="addDocument()"
    />

    <div v-if="!disabled" class="ui divider"></div>
    <!-- /Toolbar -->
    <UITableList
      id="documents"
      :headers="headers"
      :items-count="records.length"
      :is-loading="isLoading"
      :bordered="true"
      @header:sort="handleHeaderSort"
    >
      <template v-for="item in records">
        <CMDocumentsListItemRequired
          v-if="item.required == 1"
          :key="item.id"
          :item="item"
          @event-details="handleRequiredItemClick"
        />
        <CMDocumentsListItem
          v-else
          :key="'else' + item.id"
          :item="item"
          :disabled="deleteDisabled"
          @event-details="handleItemClick"
          @event-edit="handleItemEdit"
          @event-delete="handleItemDelete"
        />
      </template>
    </UITableList>
    <!-- Modals -->
    <FormAddDocument
      :active="modals.addPhoto"
      :folder-uuid="folderUuid"
      :edit-item="editItem"
      :type-id-to-add="documentTypeIdToAdd"
      :type-category="category"
      @hide="modals.addPhoto = false"
      @saved="addDocumentDone"
    />
    <!-- --- -->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

import FormAddDocument from "@/components/FormAddDocument.vue";
import CMDocumentsListItem from "@/components/CMDocumentsListItem.vue";
import CMDocumentsListItemRequired from "@/components/CMDocumentsListItemRequired.vue";

export default {
  name: "CMDocuments",

  components: {
    FormAddDocument,
    CMDocumentsListItem,
    CMDocumentsListItemRequired,
  },

  props: {
    folderUuid: {
      type: String,
      required: false,
      default: null,
    },
    category: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    deleteDisabled: {
      type: Boolean,
      default: false,
    },
    ignoreTypes: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      headers: [
        // { id: "id", name: "No.", class: "" },
        { id: "upload_ts", name: "Дата добавления", class: "" },
        { id: "document_type", name: "Тип документа", class: "" },
        { id: "description", name: "Комментарий", class: "" },
        { id: "filename", name: "Файл", class: "" },
        { id: "user_id", name: "Загрузил", class: "" },
        { id: "", name: "", class: "" },
      ],
      records: [],
      isLoading: false,
      updateKey: 0,
      url_download_base: this.$store.state.url_download_base,
      token: "",
      editItem: null,
      documentTypeIdToAdd: null,
      document_types: [],
      // Modals
      modals: {
        addPhoto: false,
      },
    };
  },

  watch: {
    folderUuid: {
      immediate: true,
      handler(newValue) {
        console.log("fetching totals for: " + this.folderUuid);

        if (newValue) {
          this.fetchDocuments(this.folderUuid);
        }
      },
    },
  },

  mounted() {
    this.fetchToken();
  },

  methods: {
    handleHeaderSort() {
      // filter
      // this.fetchDocuments(this.folderUuid, filter);
    },
    handleRequiredItemClick(item) {
      // console.log(item);
      this.addDocument(item.document_type_id);
    },
    handleItemClick(item) {
      const fileUrl = this.url_download_base + "?file=documents/" + item.filename + "&saving=0" + "&jwt=" + this.token;

      // console.log(fileUrl);

      // Start Download
      // window.location = fileUrl;
      window.open(fileUrl, "_blank");
    },
    handleItemEdit(id) {
      console.log("edit: ", id);
      this.editItem = this.records.find((x) => x.id === id);
      this.modals.addPhoto = true;
    },
    handleItemDelete(id) {
      console.log("delete: ", id);
      this.deleteDocument(id);
    },
    addDocument(document_type_id) {
      console.log("addPhoto");
      this.editItem = null;
      this.documentTypeIdToAdd = document_type_id;
      this.modals.addPhoto = true;
    },
    addDocumentDone() {
      console.log("addDocumentDone");
      this.fetchDocuments(this.folderUuid);
    },
    deleteDocument(id) {
      console.log("deleteDocument: " + id);

      var confirmed = confirm("Вы действительно хотите удалить документ?");
      if (confirmed) {
        this.fetchDocumentDelete(id);
      }
    },
    checkRequired() {
      const self = this;
      this.document_types.forEach((type) => {
        if (!self.records.find((doc) => doc.document_type_id == type.value)) {
          // console.log("not found!");
          self.records.push({
            required: 1,
            description: "Требуется загрузка!",
            document_type: type.name,
            document_type_id: type.value,
          });
        }
      });
    },
    // Network
    async fetchDocuments(album_uuid) {
      console.log("fetchDocuments for: ", album_uuid);

      this.isLoading = true;
      try {
        await this.fetchTypes();
        let result = await apiService.getDocuments(album_uuid);
        this.records = result;
        this.checkRequired();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchDocumentDelete(id) {
      this.isLoading = true;
      try {
        await apiService.deleteDocument(id);
        // In ECMA6 (arrow function syntax):
        this.records = this.records.filter((e) => e.id !== id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchToken() {
      console.log("fetchToken");

      this.isLoading = true;
      try {
        let result = await apiService.getDownloadToken();
        this.token = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchTypes() {
      this.isLoading = true;
      const self = this;
      // console.warn(self.ignoreTypes);

      try {
        let result = await apiService.getDocumentsTypes();
        // console.log(result);
        this.document_types = result.filter(
          (item) => item.required === 1 && item.category === self.category && !self.ignoreTypes.includes(item.value)
        );
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
