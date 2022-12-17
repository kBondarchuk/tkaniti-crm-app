<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <!--  -->
      <UIButton text="Назад" icon="left arrow" type="basic labeled" @click="back('advance_request_list')" />
      <!--  -->
      <!-- 1: Черновик -->
      <div class="" style="display: inline-block; background-color: red; margin: 0 2em"></div>
      <!--  -->
      <UIButton
        v-if="request.status == 0 || request.status == 3"
        text="На согласование"
        icon="arrow right"
        type="blue right labeled "
        :class="{ disabled: !checkAuthRole('budget.create') || mode != 'view' }"
        @click="stageTo(1)"
      />
      <!--  -->
      <UISpacer />
      <!-- Удалить -->
      <UIButton
        v-if="(request.status == 0 || request.status == 3) && mode == 'view'"
        text="Удалить"
        icon="trash"
        type="red left labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="delete2"
      />
      <!-- Cancel -->
      <UIButton
        v-if="(request.status == 0 || request.status == 3) && mode != 'view'"
        text="Отменить"
        icon="cancel"
        type="basic labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="cancel"
      />
      <!-- Save -->
      <UIButton
        v-if="((request.status == 0 || request.status == 3) && mode == 'edit') || mode == 'new'"
        text="Сохранить"
        icon="save"
        type="green labeled"
        :class="{ disabled: !checkAuthRole('budget.create') || !isApprovable }"
        @click="save"
      />
      <!-- Edit -->
      <UIButton
        v-if="(request.status == 0 || request.status == 3) && mode == 'view'"
        text="Изменить"
        icon="edit"
        type="basic labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="edit"
      />

      <!-- 1: Согласование -->
      <UIButton
        v-if="request.status == 1"
        text="Отказать"
        icon="close"
        type="red right labeled"
        :class="{ disabled: !checkAuthRole('budget.approve') }"
        style="margin-left: 1rem"
        @click="stageTo(2)"
      />
      <!--  -->
      <UIButton
        v-if="request.status == 1"
        text="Согласовать"
        icon="check"
        type="green right labeled"
        :class="{ disabled: !checkAuthRole('budget.approve') }"
        @click="stageTo(4)"
      />
      <!-- 2: Отклонена -->
      <UIButton
        v-if="request.status == 2 || request.status == 4"
        text="На исправление"
        icon="undo alternate"
        type="right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="stageTo(3)"
      />
      <!-- 4: Исполнение -->
      <UIButton
        v-if="request.status == 4"
        text="Исполнить"
        icon="paper plane"
        type="blue right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="applyRequest()"
      />

      <!-- Создать Авансовый отчет -->
      <!-- <UIButton @click="actionCreateReport" v-if="request.status == 5 && mode == 'view'">
        Создать Авансовый отчет
      </UIButton> -->
      <!--  -->
    </template>
    <!-- /Toolbar -->

    <!--  -->
    <div class="ui grid">
      <!-- fist column -->
      <div
        :class="{
          'twelve wide column': mode == 'edit' || mode == 'new',
          'eight wide column': mode == 'view',
        }"
      >
        <!--  -->
        <table
          v-if="mode == 'view'"
          class="ui very compact celled small definition table"
          :class="{ loading: isLoading }"
        >
          <tbody>
            <tr>
              <td>Тип</td>
              <td>{{ request.type_name }}</td>
            </tr>
            <tr>
              <td>Статус</td>
              <td><CMBudgetStatusBadge :value="request.status" /></td>
            </tr>

            <!-- <tr>
              <td colspan="2"></td>
            </tr> -->
            <tr>
              <td>Описание</td>
              <td>{{ request.title }}</td>
            </tr>
            <tr>
              <td>Сумма</td>
              <td class="text-bold">{{ $filters.money(request.amount) }}</td>
            </tr>
            <tr>
              <td>Подотчетное лицо</td>
              <td>{{ request.user_recipient }}</td>
            </tr>
            <tr>
              <td>Подробно</td>
              <td>{{ request.notes }}</td>
            </tr>
          </tbody>
        </table>
        <!-- /Table -->

        <!-- Edit Form Request -->
        <CMAdvanceRequestForm
          v-if="mode != 'view' && request.type_id == 0"
          ref="req_form"
          :request-id="request.id"
          :type_id="type_id"
          @saved="requestSaved"
          @update:approvable="updateApprovable"
        />
        <!-- Edit Form Report -->
        <CMAdvanceReportForm
          v-if="mode != 'view' && request.type_id == 1"
          ref="req_form"
          :type_id="type_id"
          :report-id="request.id"
          @saved="requestSaved"
          @update:approvable="updateApprovable"
        />

        <!-- Documents -->

        <div v-if="mode != 'new'" class="ui horizontal divider" style="margin-top: 3rem">Документы</div>
        <!-- v-if="(request.status == 0 || request.status == 3) && request.expense_category_id > 0" -->
        <!-- :class="{ disabled: !checkAuthRole('budget.create') }" -->
        <CMDocuments
          v-if="mode != 'new'"
          :folder-uuid="request.folder_uuid"
          :disabled="!checkAuthRole('budget.create') || [5].includes(request.status)"
        />
        <!-- :disabled="!(checkAuthRole('budget.create') && (request.status == 0 || request.status == 3))" -->
      </div>
      <!-- second column -->
      <div class="eight wide second column">
        <!-- Stages -->
        <CMGenericStagesList
          v-if="mode == 'view'"
          :key="key"
          :request-id="request.id"
          :request-date="request.created_dt"
          :request-author="request.user"
          :get-stages-function="getAdvanceRequestStages"
        />
        <!--  -->
      </div>
    </div>

    <!-- Modals -->
    <!-- Stage Modal -->
    <ModalGenericStage
      :active="modals.stage"
      :request-id="request.id"
      :status="stageStatus"
      :stage-request-function="doStageRequestFunction"
      @hide="modals.stage = false"
      @saved="stageDone"
    />
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import CMBudgetStatusBadge from "@/components/CMBudgetStatusBadge.vue";
import CMAdvanceRequestForm from "@/components/CMAdvanceRequestForm.vue";
import CMAdvanceReportForm from "@/components/CMAdvanceReportForm.vue";
import ModalGenericStage from "@/components/ModalGenericStage.vue";
import CMGenericStagesList from "@/components/CMGenericStagesList.vue";
// import CMLinkCar from "@/components/CMLinkCar.vue";
import CMDocuments from "@/components/CMDocuments.vue";

export default {
  name: "AdvanceRequestDetails",

  components: {
    CMBudgetStatusBadge,
    CMAdvanceRequestForm,
    CMAdvanceReportForm,
    CMGenericStagesList,
    CMDocuments,
    ModalGenericStage,
  },

  mixins: [viewMixin],

  props: {
    request_id: {
      type: Number,
      default: null,
    },
    reported_id: {
      type: Number,
      default: null,
    },
    type_id: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      // View
      view: { title: "Заявка на выдачу денег под отчёт", subTitle: "Детализация" },
      isLoading: false,
      isApprovable: false,
      // tabsComponent: 1,
      mode: "view", // new, edit, view
      // Models
      request: {},
      stageStatus: null,
      // Modals
      modals: {
        stage: false,
      },
      // Keys
      key: 0,
    };
  },

  watch: {
    request_id: {
      immediate: true,
      handler() {
        console.log(">>>> new req id: " + this.request_id);
        if (!this.request_id) {
          this.mode = "new";
          this.request.type_id = this.type_id;
          this.setTitleNew();
        } else {
          this.mode = "view";
          this.fetchRequest(this.request_id);
        }
      },
    },
  },
  created() {
    console.log("Created Params.id: " + this.request_id);
  },

  methods: {
    setTitle() {
      if (this.request.type_id == 1) {
        this.view.title = "Авансовый отчёт " + this.request.id;
      } else if (this.request.type_id === 0) {
        this.view.title = "Заявка на выдачу денег под отчёт " + this.request.id;
      }
      this.view.subTitle = this.request.status_string;
    },
    setTitleNew() {
      if (this.type_id == 1) {
        this.view.title = "Авансовый отчёт";
      } else if (this.type_id === 0) {
        this.view.title = "Заявка на выдачу денег под отчёт ";
      }
      this.view.subTitle = "Создание";
    },

    // Actions
    edit() {
      this.mode = "edit";
    },
    cancel() {
      this.mode = "view";
    },
    save() {
      this.$refs.req_form.formApproved();
    },
    delete2() {
      // this.$router.push({ name: "cars_edit" });
      var confirmed = confirm("Вы действительно хотите удалить заявку?");
      if (confirmed) {
        this.fetchRequestDelete(this.request.id);
      }
    },
    actionCreateReport() {
      this.$router.push({
        name: "advance_request_new",
        params: { type_id: 1, reported_id: this.request.id },
      });
    },
    // Apply
    applyRequest() {
      var confirmed = confirm("Вы действительно хотите исполнить заявку?");
      if (confirmed) {
        this.fetchRequestApply(this.request.id);
      }
    },

    // Form callback
    requestSaved(new_id) {
      if (this.mode == "new") {
        this.$router.push({
          name: "advance_request_details",
          params: { request_id: new_id },
        });
      } else {
        this.fetchRequest(this.request_id);
      }

      //
      // this.key++;
      this.mode = "view";
    },
    updateApprovable(status) {
      this.isApprovable = status;
    },
    // Modals
    stageTo(status) {
      this.stageStatus = status;
      this.modals.stage = true;
    },

    // Stage
    stageDone() {
      this.key++;
      this.fetchRequest(this.request_id);
    },

    // Networking
    getAdvanceRequestStages(request_id) {
      return apiService.getAdvanceRequestStages(request_id);
    },
    doStageRequestFunction(request_id, status, notes) {
      return apiService.stageAdvanceRequest(request_id, status, notes);
    },
    async fetchRequest(request_id) {
      this.isLoading = true;
      try {
        this.request = await apiService.getAdvanceRequest(request_id);
        // this.type_id = this.request.request_type;
        // console.log("+++", this.request.type_id);
        this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchRequestDelete(request_id) {
      this.isLoading = true;
      try {
        this.request = await apiService.deleteAdvanceRequest(request_id);
        this.$UIService.showSuccess(null, "Заявка удалена!");
        this.$router.push({ name: "advance_request_list" });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchRequestApply(request_id) {
      this.isLoading = true;
      try {
        await apiService.applyAdvanceRequest(request_id);
        this.fetchRequest(request_id);
        this.$UIService.showSuccess(null, "Заявка исполнена!");
        this.key++;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
  // mounted() {

  // },
};
</script>
