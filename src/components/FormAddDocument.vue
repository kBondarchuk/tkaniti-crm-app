<template>
  <!-- New params Modal -->
  <UIModal
    modal_id="modalAddDocument"
    :title="title"
    :active="active"
    :approve-button-text="!editItem ? 'Загрузить' : 'Сохранить'"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <!-- Select File -->
      <input
        ref="image_file"
        type="file"
        name="documentFile"
        accept=".pdf, .jpg, .jpeg"
        multiple
        style="display: none"
        @change="handleFileSelect()"
      />
      <UIInputSelect
        v-if="!editItem"
        placeholder="Файл не выбран"
        :value="params.selectedFiles.length ? fileNames : null"
        :class="{ error: api_error && !params.selectedFiles[0] }"
        @button-did-click="fileSelect('image_file')"
        >Файл</UIInputSelect
      >
      <!-- /Select File -->
      <!-- Type  -->
      <UIInputDropdown v-model="params.document_type_id" :options="types">Тип документа</UIInputDropdown>
      <!-- Description -->
      <UITextfield v-model.trim.lazy="params.description" :disabled="isLoading">Описание</UITextfield>
      <!-- /Description -->
      <!-- error -->
      <div v-if="api_error" class="ui error message">
        <p>{{ api_error }}</p>
      </div>
      <!-- submit button -->
      <button type="submit" hidden>Submit</button>
    </form>
  </UIModal>
  <!-- /New Investor Modal -->
</template>

<script>
import apiService from "@/services/api.service.js";

import UIModal from "@/components/UIModal.vue";
import UITextfield from "@/components/UITextfield.vue";
import UIInputSelect from "@/components/UIInputSelect.vue";
import UIInputDropdown from "@/components/UIInputDropdown.vue";

export default {
  name: "FormAddDocument",
  components: {
    UIModal,
    UITextfield,
    UIInputSelect,
    UIInputDropdown,
  },
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    folderUuid: {
      type: String,
      default: null,
    },
    typeCategory: {
      type: String,
      default: null,
    },
    editItem: {
      type: Object,
      default: null,
    },
    typeIdToAdd: {
      type: Number,
      default: null,
    },
  },
  emits: ["saved", "hide"],
  data() {
    return {
      // Entity
      params: {
        id: null,
        selectedFiles: [],
        description: "",
        document_type_id: 0,
      },
      //
      document_types: [],
      // View
      title: "Добавление документа",
      isLoading: false,
      api_error: "",
      //
      maxSizeMb: 8,
    };
  },

  computed: {
    fileNames() {
      // console.log(this.selectedFiles);
      return Array.from(this.params.selectedFiles)
        .map((x) => x.name)
        .join(", ");
    },
    types() {
      const self = this;
      if (this.typeCategory) {
        return this.document_types.filter((item) => item.category === self.typeCategory || item.category === "");
      } else {
        return this.document_types;
      }
    },
  },
  mounted() {
    this.fetchTypes();
  },

  methods: {
    fileSelect(name) {
      this.$refs[name].click();
    },
    handleFileSelect() {
      this.params.selectedFiles = this.$refs.image_file.files;
      console.log(this.params.selectedFiles);

      // обходит файлы используя цикл
      let fileNames = [];
      for (var i = 0; i < this.params.selectedFiles.length; i++) {
        // получаем сам файл
        let file = this.params.selectedFiles[i];
        if (file.size > 1024 * 1024 * this.maxSizeMb) {
          fileNames.push(file.name);
        }
      }

      if (fileNames.length > 0) {
        this.api_error =
          "Файл слишком большой! Допускается загрузка файлов размером до " +
          this.maxSizeMb +
          " Мб.: " +
          fileNames.join(", ");
      } else {
        this.api_error = "";
      }
    },
    // Modal
    reset() {
      // Reset Entity
      this.$refs.image_file.value = "";
      this.params.selectedFiles = [];

      if (!this.editItem) {
        this.title = "Добавление документа";
        this.params.id = null;
        this.params.description = "";
        this.params.document_type_id = 0;
      } else {
        this.title = "Изменение документа";
        this.params.id = this.editItem.id;
        this.params.description = this.editItem.description;
        this.params.document_type_id = this.editItem.document_type_id;
      }
      //
      this.api_error = "";
    },
    didShow() {
      // modal_id
      this.reset();
      // console.log(this.typeIdToAdd);

      if (this.typeIdToAdd) {
        this.params.document_type_id = this.typeIdToAdd;
      }
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      if (!this.editItem) {
        console.log("Saving...");
        if (this.params.selectedFiles.length > 0) {
          this.startUpload();
        } else {
          // console.log(this.selectedFiles);
          this.api_error = "Файл не выбран!";
        }
      } else {
        console.log("Updating...");
        this.fetchUpdate();
      }
    },
    modalCancel(modal_id) {
      console.log("cancelled: " + modal_id);
      this.isLoading = false;
      this.$emit("hide");
    },
    startUpload() {
      // обходит файлы используя цикл
      // let fileNames = [];
      for (var i = 0; i < this.params.selectedFiles.length; i++) {
        // получаем сам файл
        let file = this.params.selectedFiles[i];
        if (file.size <= 1024 * 1024 * this.maxSizeMb) {
          this.fetchUpload(file);
        } else {
          console.log(file.name + "пропущен");
          this.$UIService.showWarning(
            null,
            "Файл " + file.name + " не загружен. Его размер превышает максимально допустимый"
          );
        }
      }
    },
    // Network
    async fetchUpload(file) {
      this.isLoading = true;
      try {
        let result = await apiService.uploadDocument(
          file,
          this.params.document_type_id,
          this.folderUuid,
          this.params.description
        );
        console.log(result);
        this.$UIService.showSuccess(null, "Новый документ добавлен.");
        // saved
        this.$emit("saved");
        // close modal
        this.$emit("hide");
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchUpdate() {
      this.isLoading = true;
      try {
        let result = await apiService.updateDocument({
          id: this.params.id,
          document_type_id: this.params.document_type_id,
          description: this.params.description,
        });
        console.log(result);
        this.$UIService.showSuccess(null, "Документ обновлен.");
        // saved
        this.$emit("saved");
        // close modal
        this.$emit("hide");
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchTypes() {
      this.isLoading = true;
      try {
        let result = await apiService.getDocumentsTypes();
        // console.log(result);
        this.document_types = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
