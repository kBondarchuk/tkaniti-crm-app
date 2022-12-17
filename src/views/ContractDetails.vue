<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton type="basic labeled" text="Назад" icon="left arrow" @click="back('contracts')" />
      <UIButton type="basic labeled" text="Обновить" icon="refresh" @click="reload" />
      <UISpacer />
      <!--  -->
      <UIButtonDropdownMenu title="Скачать документы" icon="download" :loading="isContractDownloading">
        <!-- style="margin-right: 10rem" -->
        <UIButtonDropdownMenuItem
          title="Договор"
          icon="download"
          :loading="isContractDownloading"
          :disabled="isContractDownloading || disabledDownload"
          @click="actionDownloadDocument('contract')"
        />
        <UIButtonDropdownMenuItem
          title="Акт передачи"
          icon="download"
          :loading="isContractDownloading"
          :disabled="isContractDownloading || disabledDownload"
          @click="actionDownloadDocument('handover')"
        />
        <UIButtonDropdownMenuItem
          title="Акт приёма"
          icon="download"
          :loading="isContractDownloading"
          :disabled="isContractDownloading || disabledDownload"
          @click="actionDownloadDocument('acceptance')"
        />
        <UIButtonDropdownMenuItem
          title="График платежей"
          icon="download"
          :loading="isContractDownloading"
          :disabled="isContractDownloading || disabledDownload"
          @click="actionDownloadDocument('schedule')"
        />
        <UIButtonDropdownMenuItem
          title="Соглашение"
          icon="download"
          :loading="isContractDownloading"
          :disabled="isContractDownloading || disabledDownload"
          @click="actionDownloadDocument('agreement')"
        />
        <UIButtonDropdownMenuItem
          title="Сводный отчёт по расчётам"
          icon="download"
          :loading="isContractDownloading"
          :disabled="isContractDownloading"
          @click="actionDownloadDocument('resume')"
        />
      </UIButtonDropdownMenu>
      <!--  -->
      <!-- <UISpacer /> -->
      <!--  -->
      <UIButton
        v-if="contract.status == 0"
        type="red"
        text="Удалить договор"
        :class="{ disabled: !checkAuthRole('abort_contract') }"
        @click="actionDeleteContract"
      />
      <!-- <UIButton
        type="red"
        text="Закрыть договор"
        :class="{ disabled: disabledForAbort || !checkAuthRole('abort_contract') }"
        @click="actionAbortContract"
        v-if="checkAuthRole('manager')"
      /> -->
      <UIButton
        v-if="checkAuthRole('corp_director')"
        type="red"
        text="Закрыть договор 2"
        :class="{ disabled: disabledForAbort || !checkAuthRole('abort_contract') }"
        @click="actionAbortContract2"
      />
      <UIButton
        v-if="contract.status == 3"
        type="green"
        text="В архив"
        :class="{ disabled: disabled }"
        @click="actionFinishContract"
      />
      <!--  -->
    </template>
    <!-- /Toolbar -->

    <!-- Tabs -->
    <div class="ui top tabular menu">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="item"
        :class="{ active: tabIsActive(tab.id) }"
        @click="tabLink(tab.id)"
      >
        {{ tab.name }}
      </div>
    </div>

    <!-- Pages -->
    <div class="ui active tab">
      <router-view :key="keys.update" :contract="contract" @need-refetch="fetchContract(contract_id)"></router-view>
    </div>

    <!-- Abort Modal -->
    <!-- <FormAbortContract
      :active="modals.abort"
      :contract-id="contract_id"
      @hide="modals.abort = false"
      @saved="abortDone"
    /> -->
    <!-- Abort Modal New -->
    <ModalAbortContractSuper
      :active="modals.abort2"
      :contract-id="contract_id"
      @hide="modals.abort2 = false"
      @saved="abort2Done"
    />
    <!-- Finish Modal -->
    <FormFinishContract
      :active="modals.finish"
      :contract-id="contract_id"
      @hide="modals.finish = false"
      @saved="finishDone"
    />
    <!------->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";

import UIButtonDropdownMenu from "@/components/UIButtonDropdownMenu.vue";
import UIButtonDropdownMenuItem from "@/components/UIButtonDropdownMenuItem.vue";
// import FormAbortContract from "@/components/FormAbortContract.vue";
import FormFinishContract from "@/components/FormFinishContract.vue";
import ModalAbortContractSuper from "@/components/ModalAbortContractSuper.vue";
// import FormAddPhotoVue from "@/components/FormAddPhoto.vue";

const kTABS = [
  { name: "ПАРАМЕТРЫ", id: "general", access: "contracts.view" },
  { name: "РАСЧЁТЫ", id: "accounts", access: "contracts.view" },
  { name: "ГРАФИК ПЛАТЕЖЕЙ", id: "schedule", access: "contracts.view" },
  { name: "ИСТОРИЯ", id: "history", access: "contracts.view" },
  { name: "НАСТРОЙКИ", id: "options", access: "manager" },
];

export default {
  name: "ContractDetails",

  components: {
    UIButtonDropdownMenu,
    UIButtonDropdownMenuItem,
    // FormAbortContract,
    FormFinishContract,
    ModalAbortContractSuper,
  },

  mixins: [viewMixin],

  props: {
    contract_id: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      // View
      view: { title: "Договор", subTitle: "Работа с договором" },
      isLoading: false,
      isContractDownloading: false,
      isAgreementDownloading: false,
      isGraphDownloading: false,
      isResumeDownloading: false,
      // Data
      contract: {},
      // Keys
      keys: { update: 0 },
      // Modals
      modals: {
        abort: false,
        abort2: false,
        finish: false,
        // carFine: false,
      },
      // Tabs
      tabs: [],
    };
  },

  computed: {
    disabled() {
      // Deleted Or Closed
      return this.contract.status == -1 || this.contract.status == 10 || this.contract.status == 11;
    },
    disabledDownload() {
      // Deleted Or Closed
      return this.contract.status == -1;
    },
    disabledForAbort() {
      // Deleted Or Closed
      return (
        this.contract.status == -1 ||
        this.contract.status == 3 ||
        this.contract.status == 4 ||
        this.contract.status == 10 ||
        this.contract.status == 11
      );
    },
  },
  // created() {
  //   console.log("Created Params.id: " + this.$route.params.id);
  //   // Get ID from params
  //   //this.contract_id = this.$route.params.id === undefined ? null : parseInt(this.$route.params.id);
  // },

  created() {
    // console.log(">> ", this.$store.getters["auth/getAuthRights"]);

    //
    this.createTabs();
  },

  mounted() {
    if (this.contract_id) {
      this.setTitle();
      this.fetchContract(this.contract_id);
    }
  },

  methods: {
    setTitle() {
      if (this.contract.contract_number) {
        this.view.title =
          "Договор " +
          this.contract_id +
          ": " +
          this.contract.contract_number +
          " от " +
          this.$filters.date(this.contract.contract_date);
        this.view.subTitle = "Статус: " + this.$filters.contract_status(this.contract.status);
      } else {
        this.view.title = "Договор " + this.contract_id;
      }
    },
    // Tabs
    createTabs() {
      //
      // console.warn(">> ", this.$store.getters["auth/getAuthRights"]);

      this.tabs = [];

      kTABS.forEach((element) => {
        // console.warn(element.access);

        if (this.checkAuthRole(element.access)) {
          this.tabs.push(element);
        }
      });

      // console.warn(">>>", this.tabs);
    },
    tabIsActive(name) {
      const paths = this.$route.path.split("/");
      return paths[paths.length - 1] == name;
    },
    tabLink(name) {
      if (!this.tabIsActive(name)) {
        this.$router.push({ name: `contract_details_${name}`, params: { id: this.contract_id } });
      }
    },
    reload() {
      this.fetchContract(this.contract_id);
    },
    actionAbortContract() {
      this.modals.abort = true;
    },
    actionAbortContract2() {
      this.modals.abort2 = true;
    },
    actionDeleteContract() {
      var confirmed = confirm("Вы действительно хотите удалить договор?");
      if (confirmed) {
        this.fetchDeleteContract(this.contract_id);
      }
    },
    actionFinishContract() {
      this.modals.finish = true;
    },
    actionDownloadDocument(doc_type) {
      this.downloadDocument(this.contract_id, doc_type);
    },
    // Events
    abortDone() {
      this.reload();
    },
    abort2Done() {
      this.reload();
    },
    finishDone() {
      this.reload();
    },
    startDownload(filename, token) {
      // Make URL
      let fileUrl = this.$store.state.url_download_base + "?file=" + filename + "&jwt=" + token + "&saving=yes";

      // Start Download
      window.location = fileUrl;
    },

    // Networking
    async fetchContract(contract_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getContract(contract_id);
        this.contract = result;
        this.keys.update++;
        this.setTitle();
        this.createTabs();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchDeleteContract(contract_id) {
      this.isLoading = true;
      try {
        await apiService.contractDelete(contract_id);
        //
        this.$UIService.showSuccess("", "Договор " + contract_id + " удалён.");
        // Return to Contract list
        this.$router.push({ name: "contracts" });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async downloadDocument(contract_id, document_type) {
      this.isContractDownloading = true;
      try {
        let result = await apiService.getPrintedDocument(contract_id, document_type);
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
