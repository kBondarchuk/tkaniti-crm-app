<template>
  <form class="ui form segment">
    <div class="ui header">{{ header }}</div>
    <input
      :ref="templateName"
      type="file"
      accept=".doc, .docx"
      style="display: none"
      :name="templateName + '_file'"
      @change="handleTemplateSelect(templateName)"
    />
    <!-- Select File -->
    <UIInputSelect placeholder="Файл не выбран" :value="file.name" @button-did-click="fileSelect(templateName)"
      >Файл</UIInputSelect
    >
    <!-- /Select File -->
    <div class="two fields">
      <div class="field">
        <a
          class="ui small compact basic button"
          :class="{ loading: isLoading, disabled: isLoading }"
          @click="downloadTemplateFile(templateName)"
        >
          Скачать текущий шаблон
          <i class="right download icon"></i>
        </a>
      </div>
      <div class="field">
        <a
          class="ui primary submit small right floated compact button"
          :class="{
            loading: isUploading,
            disabled: isUploading,
            disabled: !file,
          }"
          @click="uploadTemplateFile(templateName)"
        >
          Загрузить выбранный файл
          <i class="right upload icon"></i>
        </a>
      </div>
    </div>
    <!-- </div> -->
    <div class="ui error message"></div>
  </form>
</template>

<script>
import apiService from "@/services/api.service.js";

export default {
  name: "CMPrefsTemplateItemForm",

  props: {
    header: {
      type: String,
    },
    templateName: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      file: "",
      isLoading: false,
      isUploading: false,
    };
  },

  methods: {
    fileSelect(name) {
      this.$refs[name].click();
    },
    handleTemplateSelect(template_name) {
      this.file = this.$refs[template_name].files[0];
      console.log(this.file);
    },
    startDownload(filename, token) {
      // Make URL
      let fileUrl = this.$store.state.url_download_base + "?file=" + filename + "&jwt=" + token + "&saving=yes";

      // Start Download
      window.location = fileUrl;
    },
    // Network
    async uploadTemplateFile(template_name) {
      this.isUploading = true;

      try {
        await apiService.uploadTemplateFile(template_name, this.file);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }

      this.$UIService.showSuccess("Шаблон загружен.");
      this.isUploading = false;
    },
    async downloadTemplateFile(template_name) {
      this.isContractDownloading = true;
      try {
        let result = await apiService.getTemplate(template_name);
        // Get Token
        let token = await apiService.getDownloadToken();
        // Start Download
        this.startDownload(result.file, token);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isContractDownloading = false;
    },
  },
};
</script>
