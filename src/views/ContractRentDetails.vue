<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton type="basic labeled" text="Назад" icon="left arrow" @click="back('contracts_rent')" />
      <UIButton type="basic labeled" text="Обновить" icon="refresh" @click="reload" />
      <!-- <UIButton
        type="red right floated"
        @click="actionDeleteContract"
        :class="{ disabled: !checkAuthRole('abort_contract') }"
        v-if="contract.status == 0"
        >Удалить договор</UIButton
      > -->
      <UISpacer />
      <!--  -->
      <UIButtonDropdownMenu title="Скачать документы" icon="download" :loading="isContractDownloading">
        <!-- style="margin-right: 10rem" -->
        <UIButtonDropdownMenuItem
          title="Договор"
          icon="download"
          :loading="isContractDownloading"
          :disabled="isContractDownloading"
          @click="actionDownloadDocument('rent_contract')"
        />
        <UIButtonDropdownMenuItem
          title="Акт передачи"
          icon="download"
          :loading="isContractDownloading"
          :disabled="isContractDownloading"
          @click="actionDownloadDocument('rent_handover')"
        />
        <UIButtonDropdownMenuItem
          title="Акт приёма"
          icon="download"
          :loading="isContractDownloading"
          :disabled="isContractDownloading"
          @click="actionDownloadDocument('rent_acceptance')"
        />
      </UIButtonDropdownMenu>
      <!--  -->
      <UIButton
        type="red"
        text="Завершить договор"
        :disabled="![0, 1, 2].includes(contract.status)"
        @click="actionFinishContract"
      />
      <!-- <UIButton
        type="green right floated"
        @click="actionFinishContract"
        :class="{ disabled: disabled }"
        v-if="contract.status == 3"
        >В архив</UIButton
      > -->
      <!--  -->
    </template>
    <!-- /Toolbar -->
    <!-- Tabs -->
    <div class="ui top tabular menu">
      <div class="item" :class="{ active: tabsComponent == 1 }" @click="tabSelect(1)">ПАРАМЕТРЫ</div>
      <div class="item" :class="{ active: tabsComponent == 2 }" @click="tabSelect(2)">РАСЧЁТЫ</div>
      <div class="item" :class="{ active: tabsComponent == 5 }" @click="tabSelect(5)">ИСТОРИЯ</div>
      <div class="item" :class="{ active: tabsComponent == 4 }" @click="tabSelect(4)">НАСТРОЙКИ</div>
    </div>
    <!-- Pages -->
    <!-- Page 1: General -->
    <div class="ui tab" :class="{ active: tabsComponent == 1 }">
      <!-- Toolbar -->

      <!-- /Toolbar -->

      <!-- Page 1 Grid -->
      <div class="ui grid">
        <!-- Fist Column -->
        <div class="eight wide column">
          <!-- Contract Details -->
          <!-- <UITransition mode="out-in" appear> -->
          <CMRentContractDetails
            :key="keys.update + '-details'"
            :preloaded-contract="contract"
            :is-loading-external="isLoading"
          />
          <!-- </UITransition> -->
          <!-- Car Fines -->
          <CMCarFinesTotalsList v-if="checkAuthRole('manager')" :rent-contract-id="contract_id" />
          <!-- warnings -->
          <CMWarningsList
            v-if="contract.car_id > 0"
            :key="keys.update + '-car'"
            :car-id="contract.car_id"
            style="margin-top: 1em"
          />
          <!-- /warnings -->
        </div>

        <!-- Second column -->
        <div class="eight wide column">
          <!-- Car Details -->
          <CMCarDetailsWidget :key="keys.update + '-car'" :car-id="contract.car_id" />
          <!-- Customer Details -->
          <CMCustomerDetailsWidget :key="keys.update + '-customer'" :customer_id="contract.customer_id" />
        </div>
      </div>
      <!-- /Page 1 Grid -->
    </div>
    <!-- /Page 1 -->
    <!-- Page 2: Transactions -->
    <div class="ui tab" :class="{ active: tabsComponent == 2 }">
      <!-- Toolbar -->
      <div class="ui-tool-bar-local">
        <UIButton
          text="Депозит"
          color="blue"
          icon="right chevron"
          type="compact right labeled"
          :class="{ disabled: disabled }"
          @click="actionDeposit"
        />
        <UIButton
          text="Возврат залога"
          color="teal"
          icon="right chevron"
          type="compact right labeled"
          :class="{ disabled: disabled }"
          @click="actionPledge"
        />
      </div>

      <div class="ui divider"></div>
      <!-- /Toolbar -->
      <!-- Grid -->
      <!-- <div class="ui grid"> -->
      <!-- Fist Column -->
      <!-- <div class="eight wide column"> -->
      <CMRentTransactionsResults :key="keys.transactions + '-result'" :contract_id="contract_id" />
      <!-- </div>
          <div class="eight wide column">1</div>
      </div>-->
      <!-- <CMTransactionsList
        :contract_id="contract_id"
        contract_type="rent"
        :show-basis="false"
        :key="keys.transactions + '-list'"
        :showBranch="false"
      /> -->
      <CMOperationsList
        :key="keys.transactions + '-list'"
        operations-type="rent_contracts"
        :operations-subject-id="contract_id"
        :show-basis="false"
        :show-branch="false"
      />
    </div>
    <!-- /Page 2 -->
    <!-- Page 5: History -->
    <div class="ui tab" :class="{ active: tabsComponent == 5 }">
      <!-- Live Schedule -->
      <CMRentHistoryStatusList
        v-if="contract_id"
        :key="keys.schedule + 'history'"
        :contract_id="contract_id"
        style="max-width: 50%"
      />
      <!-- /Live Schedule -->
    </div>
    <!-- /Page 5 -->
    <!-- Page 4: Optiont -->
    <div class="ui tab" :class="{ active: tabsComponent == 4 }">
      <div style="margin-left: 1em">
        <!--  -->
        <UICheckbox
          id="acquiring"
          v-model="contract.option_online_pay"
          label="Онлайн оплата (Эквайринг)"
          style="margin-bottom: 1em"
          :class="{ disabled: loading_options['online_pay'] }"
          @update:model-value="changedPayOnline"
        />
        <br />
        <!--  -->
        <UICheckbox
          id="pay_fines"
          v-model="contract.option_car_fines_pay"
          label="Автоматически оплачивать штрафы ГИБДД"
          :class="{ disabled: loading_options['car_fines_pay'] }"
          @update:model-value="changedPayFine"
        />
        <!--  -->
      </div>
    </div>
    <!-- /Page 4 -->
    <!-- /Pages -->

    <!-- New Deposit Modal -->
    <FormDeposit
      :active="modals.deposit"
      :contract-id="contract_id"
      type="rent"
      @hide="modals.deposit = false"
      @saved="depositCreated"
    />
    <!-- Abort Modal -->
    <FormFinishRentContract
      :active="modals.finish"
      :contract-id="contract_id"
      @hide="modals.finish = false"
      @saved="finishDone"
    />
    <!-- New Pledge Modal -->
    <FormPledgeRentContract
      :active="modals.pledge"
      :contract-id="contract_id"
      @hide="modals.pledge = false"
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
import CMRentContractDetails from "@/components/CMRentContractDetails.vue";
import CMCustomerDetailsWidget from "@/components/CMCustomerDetailsWidget.vue";
import CMCarDetailsWidget from "@/components/CMCarDetailsWidget.vue";
import CMRentTransactionsResults from "@/components/CMRentTransactionsResults.vue";
import CMOperationsList from "@/components/CMOperationsList.vue";
import FormDeposit from "@/components/FormDeposit.vue";
import FormFinishRentContract from "@/components/FormFinishRentContract.vue";
import FormPledgeRentContract from "@/components/FormPledgeRentContract.vue";
import CMWarningsList from "@/components/CMWarningsList.vue";
import CMRentHistoryStatusList from "@/components/CMRentHistoryStatusList.vue";
import CMCarFinesTotalsList from "@/components/CMCarFinesTotalsList.vue";

export default {
  name: "ContractRentDetails",

  components: {
    UIButtonDropdownMenu,
    UIButtonDropdownMenuItem,
    CMCarDetailsWidget,
    CMCustomerDetailsWidget,
    CMRentContractDetails,
    CMRentTransactionsResults,
    CMOperationsList,
    FormDeposit,
    FormFinishRentContract,
    FormPledgeRentContract,
    CMWarningsList,
    CMRentHistoryStatusList,
    CMCarFinesTotalsList,
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
      view: { title: "Договор аренды", subTitle: "Работа с договором" },
      isLoading: false,
      isContractDownloading: false,
      tabsComponent: 1,
      loading_options: {
        car_fines_pay: false,
        online_pay: false,
      },
      // Data
      contract: {},
      // Keys
      keys: { update: 0, transactions: 0, schedule: 0 },
      // Modals
      modals: {
        deposit: false,
        penalty: false,
        pledge: false,
        restruct: false,
        abort: false,
        finish: false,
      },
    };
  },

  computed: {
    disabled() {
      // Deleted Or Closed
      return this.contract.status == -1 || this.contract.status == 10;
    },
    disabledForAbort() {
      // Deleted Or Closed
      return (
        this.contract.status == -1 ||
        this.contract.status == 3 ||
        this.contract.status == 4 ||
        this.contract.status == 10
      );
    },
    disabledForRestruct() {
      // Deleted Or Closed
      return this.contract.status != 1;
    },
  },

  created() {
    console.log("Created Params.id: " + this.$route.params.id);
    // Get ID from params
    //this.contract_id = this.$route.params.id === undefined ? null : parseInt(this.$route.params.id);
  },

  mounted() {
    if (this.contract_id) {
      this.setTitle();
      this.fetchItem(this.contract_id);
    }
  },

  methods: {
    setTitle() {
      if (this.contract.contract_number) {
        this.view.title =
          "Договор аренды " +
          this.contract_id +
          ": " +
          this.contract.contract_number +
          " от " +
          this.$filters.date(this.contract.contract_date);
        this.view.subTitle = "Статус: " + this.$filters.contract_rent_status(this.contract.status);
      } else {
        this.view.title = "Договор " + this.contract_id;
      }
    },
    // Tabs
    tabSelect(id) {
      // console.log("tab: " + id);
      this.tabsComponent = id;
    },
    reload() {
      this.keys.transactions++;
      this.keys.schedule++;
      this.fetchItem(this.contract_id);
    },
    // Actions
    actionDeposit() {
      this.modals.deposit = true;
    },
    actionPenalty() {
      this.modals.penalty = true;
    },
    actionPayForward() {
      this.modals.payForward = true;
    },
    actionRestruct() {
      this.modals.restruct = true;
    },
    actionAbortContract() {
      this.modals.abort = true;
    },
    actionPledge() {
      this.modals.pledge = true;
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
    depositCreated() {
      this.keys.transactions++;
    },
    penaltyCreated() {
      // this.keys.transactions++;
    },
    payForwardCreated() {
      this.fetchItem(this.contract_id);
      this.keys.transactions++;
      this.keys.schedule++;
    },
    restructCreated() {
      this.fetchItem(this.contract_id);
      this.keys.schedule++;
    },
    abortDone() {
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
    changedPayOnline(newValue) {
      // console.log("A", newValue);
      this.contract.option_online_pay = newValue;
      this.fetchSetOption(this.contract.id, { online_pay: this.contract.option_online_pay });
    },
    changedPayFine(newValue) {
      // console.log(newValue);
      this.contract.option_car_fines_pay = newValue;
      this.fetchSetOption(this.contract.id, { car_fines_pay: this.contract.option_car_fines_pay });
    },

    // Network
    async fetchSetOption(contractId, options) {
      const keys = Object.keys(options);
      const values = Array(keys.length).fill(true);
      // const map = new Map([keys, values]);
      const loading = Object.fromEntries(values.map((value, index) => [keys[index], value]));

      this.loading_options = Object.assign(this.loading_options, loading);

      // console.warn("+++", this.loading);

      try {
        await apiService.setRentContractOptions(contractId, options);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }

      // this.loading = false;
      const values_false = Array(keys.length).fill(false);
      // const map = new Map([keys, values]);
      const loading_off = Object.fromEntries(values_false.map((value, index) => [keys[index], value]));

      this.loading_options = Object.assign(this.loading_options, loading_off);

      // console.warn("---", this.loading);
      // this.$emit("needRefetch");
    },

    async fetchItem(contract_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getRentContract(contract_id);
        this.contract = result;
        this.keys.update++;
        this.setTitle();
        // this.fetchCar(this.contract.car_id);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchDeleteContract(contract_id) {
      this.isLoading = true;
      try {
        // await apiService.contractDelete(contract_id);
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
        let result = await apiService.getRentPrintedDocument(contract_id, document_type);

        // Check for null filename
        if (result.file) {
          // Get Token
          let token = await apiService.getDownloadToken();
          // Start Download
          this.startDownload(result.file, token);
        } else {
          this.$UIService.showNetworkError("Произошла ошибка при запросе файла!");
        }
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isContractDownloading = false;
    },
  },
};
</script>
