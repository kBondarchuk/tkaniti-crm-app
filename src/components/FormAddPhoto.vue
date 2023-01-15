<template>
  <!-- New params Modal -->
  <UIModal
    modal_id="modalAddPhoto"
    :title="title"
    :active="active"
    approve-button-text="Загрузить"
    @cancel="modalCancel"
    @approve="modalApproved"
    @did-show="didShow"
  >
    <form class="ui error form" :class="{ loading: isLoading }" @submit.prevent="modalApproved">
      <!-- Select File -->
      <input
        ref="image_file"
        type="file"
        name="photoFile"
        accept=".jpg, .jpeg"
        multiple
        style="display: none"
        @change="handleFileSelect()"
      />
      <UIInputSelect
        placeholder="Файл не выбран"
        :value="selectedFiles.length ? fileNames : null"
        :class="{ error: api_error && !selectedFiles[0] }"
        @button-did-click="fileSelect('image_file')"
        >Файл фотографии</UIInputSelect
      >
      <!-- /Select File -->
      <!-- Description -->
      <UITextfield v-model.trim.lazy="description" :disabled="isLoading">Описание</UITextfield>
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

export default {
  name: "FormAddPhoto",
  components: {},
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    albumUuid: {
      type: String,
      default: null,
    },
  },
  emits: ["hide", "saved"],
  data() {
    return {
      selectedFiles: [],
      description: "",
      // View
      title: "Добавление фото",
      isLoading: false,
      api_error: "",
    };
  },
  computed: {
    fileNames() {
      // console.log(this.selectedFiles);
      return Array.from(this.selectedFiles)
        .map((x) => x.name)
        .join(", ");
    },
  },
  methods: {
    fileSelect(name) {
      this.$refs[name].click();
    },
    handleFileSelect() {
      this.selectedFiles = this.$refs.image_file.files;
      console.log(this.selectedFiles);

      // обходит файлы используя цикл
      let fileNames = [];
      for (var i = 0; i < this.selectedFiles.length; i++) {
        // получаем сам файл
        let file = this.selectedFiles[i];
        if (file.size > 1024 * 1024 * 2) {
          fileNames.push(file.name);
        }
      }

      if (fileNames.length > 0) {
        this.api_error = "Файл слишком большой! Допускается загрузка файлов размером до 2 Мб.: " + fileNames.join(", ");
      } else {
        this.api_error = "";
      }
    },
    // Modal
    reset() {
      // this.params.price = "";
      // this.params.date = "";
      this.selectedFiles = [];
      this.description = "";

      this.api_error = "";
    },
    didShow() {
      // modal_id
      // console.log("didShow: " + modal_id);
      this.reset();
      // this.fetch();
    },
    modalApproved(modal_id) {
      console.log("approved: " + modal_id);
      if (this.selectedFiles.length > 0) {
        this.startUpload();
      } else {
        // console.log(this.selectedFiles);
        this.api_error = "Файл не выбран!";
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
      for (var i = 0; i < this.selectedFiles.length; i++) {
        // получаем сам файл
        let file = this.selectedFiles[i];
        if (file.size <= 1024 * 1024 * 2) {
          console.log(file.name + " upload. ", file);

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
        let result = await apiService.uploadImage(file, this.albumUuid, this.description);
        console.log(result);
        this.$UIService.showSuccess(null, "Новое фото добавлено");
        // saved
        this.$emit("saved");
        // close modal
        this.$emit("hide");
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
