<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton icon="left arrow" type="basic labeled" @click="back('registration_requests_list')">Назад</UIButton>
      <!--  -->
      <div class="" style="display: inline-block; background-color: red; margin: 0 2em"></div>
      <UIButton
        v-if="request.status == 0 || request.status == 3"
        icon="arrow right"
        type="blue right labeled "
        :class="{ disabled: !checkAuthRole('budget.create') || mode != 'view' }"
        style="margin-left: 1em"
        @click="stageTo(1)"
        >На согласование</UIButton
      >

      <!-- 1: Согласование -->
      <UIButton
        v-if="request.status == 1"
        icon="close"
        type="red right labeled"
        :class="{ disabled: !checkAuthRole('budget.approve') }"
        style="margin-left: 1rem"
        @click="stageTo(2)"
        >Отказать</UIButton
      >
      <UIButton
        v-if="request.status == 1"
        icon="check"
        type="green right labeled"
        :class="{ disabled: !checkAuthRole('budget.approve') }"
        style="margin-left: 1em"
        @click="stageTo(4)"
        >Согласовать</UIButton
      >
      <!-- 2: Отклонена -->
      <UIButton
        v-if="request.status == 2"
        icon="undo alternate"
        type="right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        style="margin-left: 1em"
        @click="stageTo(3)"
        >На исправление</UIButton
      >
      <!-- 4: Исполнение -->
      <UIButton
        v-if="request.status == 4"
        icon="paper plane"
        type="blue right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        style="margin-left: 1em"
        @click="applyRequest()"
        >Исполнить</UIButton
      >
      <UISpacer />
      <!-- 1: Черновик -->
      <!-- Удалить -->
      <UIButton
        v-if="(request.status == 0 || request.status == 3) && mode == 'view'"
        icon="trash"
        type="red left labeled"
        style="margin-left: 1rem"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="delete2"
        >Удалить</UIButton
      >
      <!-- Cancel -->
      <UIButton
        v-if="(request.status == 0 || request.status == 3) && mode != 'view'"
        icon="cancel"
        type="basic labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        style="margin-left: 1em"
        @click="cancel"
        >Отменить</UIButton
      >

      <!-- Save -->
      <UIButton
        v-if="((request.status == 0 || request.status == 3) && mode == 'edit') || mode == 'new'"
        icon="save"
        type="green labeled"
        :class="{ disabled: !checkAuthRole('budget.create') || !isApprovable }"
        style="margin-left: 1em"
        @click="save"
        >Сохранить</UIButton
      >
      <!-- Edit -->
      <UIButton
        v-if="(request.status == 0 || request.status == 3) && mode == 'view'"
        icon="edit"
        type="basic labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        style="margin-left: 1em"
        @click="edit"
        >Изменить</UIButton
      >

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
          <!-- <thead>
            <tr>
              <th colspan="2">Расход</th>
            </tr>
          </thead> -->
          <tbody>
            <tr>
              <td>Статус</td>
              <td><CMBudgetStatusBadge :value="request.status" /></td>
            </tr>
            <tr>
              <td>Фимилия</td>
              <td>{{ request.last_name }}</td>
            </tr>
            <tr>
              <td>Имя</td>
              <td>{{ request.first_name }}</td>
            </tr>
            <tr>
              <td>Отчество</td>
              <td>{{ request.second_name }}</td>
            </tr>
            <tr>
              <td>Номер телефона</td>
              <td>{{ $filters.phone(request.phone) }}</td>
            </tr>
            <tr>
              <td>EMail</td>
              <td>{{ request.email }}</td>
            </tr>
            <tr v-if="request.branch">
              <td>Филиал</td>
              <td>{{ request.branch }}</td>
            </tr>
            <tr>
              <td>Коментарий</td>
              <td class="text-bold">{{ request.notes }}</td>
            </tr>
          </tbody>
        </table>
        <!-- /Table -->

        <!-- New Expense Form -->
        <CMRegistrationRequestForm
          v-if="mode != 'view'"
          ref="req_form"
          :request-id="request.id"
          @saved="requestSaved"
          @update:approvable="updateApprovable"
        ></CMRegistrationRequestForm>

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
        <CMRegistrationStagesList
          v-if="mode == 'view'"
          :key="key"
          :request-id="request.id"
          :request-date="request.created_dt"
          :request-author="request.user"
        />
        <!--  -->
      </div>
    </div>

    <!-- Modals -->
    <!-- Stage Modal -->
    <FormRegistraitionStage
      :active="modals.stage"
      :request-id="request.id"
      :status="stageStatus"
      @hide="modals.stage = false"
      @saved="stageDone"
    ></FormRegistraitionStage>
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import LayoutPage from "@/components/LayoutPage.vue";
import UIButton from "@/components/UIButton.vue";
import CMBudgetStatusBadge from "@/components/CMBudgetStatusBadge.vue";
import CMRegistrationRequestForm from "@/components/CMRegistrationRequestForm.vue";
import FormRegistraitionStage from "@/components/FormRegistraitionStage.vue";
import CMRegistrationStagesList from "@/components/CMRegistrationStagesList.vue";
import CMDocuments from "@/components/CMDocuments.vue";

export default {
  name: "RegistrationRequestDetails",
  components: {
    LayoutPage,
    UIButton,
    CMBudgetStatusBadge,
    CMRegistrationRequestForm,
    FormRegistraitionStage,
    CMRegistrationStagesList,
    CMDocuments,
  },
  mixins: [viewMixin],
  props: {
    request_id: {
      type: Number,
      default: null,
    },
    car_id: {
      type: Number,
      default: null,
    },
  },

  data() {
    return {
      // View
      view: { title: "Заявка на регистрацию", subTitle: "Детализация" },
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
      this.view.title = "Заявка на регистрацию " + this.request.id;
      this.view.subTitle = this.request.status_string;
    },
    setTitleNew() {
      this.view.title = "Новая заявка на регистрацию";
      this.view.subTitle = "Создание заявки";
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
          name: "budget_request_details",
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
    async fetchRequest(request_id) {
      this.isLoading = true;
      try {
        this.request = await apiService.getRegistrationRequest(request_id);
        this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchRequestDelete(request_id) {
      this.isLoading = true;
      try {
        this.request = await apiService.deleteRegistrationRequest(request_id);
        this.$UIService.showSuccess(null, "Заявка удалена!");
        this.$router.push({ name: "registration_requests_list" });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchRequestApply(request_id) {
      this.isLoading = true;
      try {
        await apiService.applyRegistrationRequest(request_id);
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
