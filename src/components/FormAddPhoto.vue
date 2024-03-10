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
        :accept="acceptedFileTypes"
        multiple
        style="display: none"
        @change="handleFileSelect()"
      />
      <UIInputSelect
        placeholder="Файл не выбран"
        :value="selectedFiles.length ? fileNames : null"
        :class="{ error: api_error && !selectedFiles[0] }"
        @button-did-click="fileSelect('image_file')"
      >
        {{ label }}
      </UIInputSelect>
      <!-- /Select File -->

      <!-- Description -->
      <UITextfield v-model.trim.lazy="description" :disabled="isLoading">Описание</UITextfield>

      <div v-if="progress">Загрузка: {{ progress }}%</div>

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
import { computed } from "vue";
import apiService from "@/services/api.service.js";

const _MAX_FILE_SIZE = 200;

export default {
  name: "FormAddPhoto",

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    albumUuid: {
      type: String,
      default: null,
    },
    fileType: {
      // photo | video
      type: String,
      default: "photo",
    },
  },

  emits: ["hide", "saved"],

  setup(props) {
    console.warn(props);
    const strings = {
      photo: { title: "Добавление фото", label: "Файл фотографии", acceptedFileTypes: ".jpg, .jpeg" },
      video: { title: "Добавление видео", label: "Файл видео", acceptedFileTypes: ".mp4, .mov" },
    };

    const title = computed(() => {
      return strings[props.fileType].title;
    });

    const label = computed(() => {
      return strings[props.fileType].label;
    });

    const acceptedFileTypes = computed(() => {
      return strings[props.fileType].acceptedFileTypes;
    });

    return { title, label, acceptedFileTypes };
  },

  data() {
    return {
      selectedFiles: [],
      description: "",
      // View
      progress: null,
      isLoading: false,
      api_error: "",
    };
  },

  computed: {
    fileNames() {
      // console.log(this.selectedFiles);
      return Array.from(this.selectedFiles)
        .map((x) => x.name + "(" + Number(x.size / 1024 / 1024).toFixed(1) + "mb)")
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
        if (file.size > 1024 * 1024 * _MAX_FILE_SIZE) {
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
      this.$refs.image_file.value = "";
      this.selectedFiles = [];
      this.description = "";
      this.progress = null;

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
        if (file.size <= 1024 * 1024 * _MAX_FILE_SIZE) {
          console.log(file.name + " upload. ", file);

          this.fetchUpload(file);
        } else {
          console.warn(file.name + "пропущен");
          this.$UIService.showWarning(
            null,
            "Файл " + file.name + " не загружен. Его размер превышает максимально допустимый"
          );
        }
      }
    },
    // Network
    async fetchUpload(file) {
      // const progressCallback = (progress) => {
      //   console.warn(progress);
      // };

      this.isLoading = true;
      try {
        if (this.fileType == "video") {
          let result = await apiService.uploadVideo(file, this.albumUuid, this.description, (progress) => {
            console.warn(progress);
            this.progress = progress;
          });
          console.log(result);
          this.$UIService.showSuccess(null, "Новое видео добавлено");
        } else {
          let result = await apiService.uploadImage(file, this.albumUuid, this.description);
          console.log(result);
          this.$UIService.showSuccess(null, "Новое фото добавлено");
        }
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
