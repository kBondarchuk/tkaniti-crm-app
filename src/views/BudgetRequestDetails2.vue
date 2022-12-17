<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton icon="left arrow" type="basic labeled" @click="back('budget_request_list')">Назад</UIButton>
      <!-- <div class="ui small compact button icon basic labeled" style="visibility: hidden">S</div> -->
      <!-- 1: Черновик -->
      <!-- <div class="" style="display: inline-block; background-color: red; margin: 0 2em">What?</div> -->
      <UIButton
        v-if="request.status == 0 || request.status == 3"
        text="На согласование"
        icon="arrow right"
        type="blue right labeled "
        :class="{ disabled: !checkAuthRole('budget.create') || mode != 'view' }"
        @click="stageTo(1)"
      />

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
      <!--  -->
    </template>
    <!-- /Toolbar -->

    <!--  -->
    <div class="ui grid">
      <!-- fist column -->
      <div
        :class="{
          'sixteen wide column': mode == 'edit' || mode == 'new',
          'twelve wide column': mode == 'view',
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
              <td>Тип</td>
              <td>{{ request_types[requestType] }}</td>
            </tr>
            <tr>
              <td>Подотчетное лицо</td>
              <td class="text-bold">{{ request.recipient_user }}</td>
            </tr>
            <tr>
              <td>Описание заявки</td>
              <td class="text-bold">{{ request.notes }}</td>
            </tr>
            <tr>
              <td>Сумма</td>
              <td class="text-bold">{{ $filters.money(request.total_sum) }}</td>
            </tr>
          </tbody>
        </table>
        <!-- /Table -->

        <!-- New Expense Form -->
        <CMBudgetRequestForm
          v-if="mode != 'view'"
          ref="req_form"
          :request-id="request.id"
          :car-id="car_id"
          :request_type="requestType"
          @saved="requestSaved"
          @update:approvable="updateApprovable"
        />

        <!-- <UIButton
          icon="green plus"
          type="basic"
          @click.prevent="newItem"
          text="Добавить расход"
          v-if="mode != 'view'"
        /> -->

        <!-- Items -->
        <CMBudgetItemList
          v-if="mode == 'view'"
          :items="request.items"
          :total-sum="request.total_sum"
          :is-loading="isLoading"
        />
        <!-- /Items -->

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
      <div class="four wide second column">
        <!-- Stages -->
        <CMBudgetStagesList
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
    <FormBudgetStage
      :active="modals.stage"
      :request-id="request.id"
      :status="stageStatus"
      @hide="modals.stage = false"
      @saved="stageDone"
    />
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import CMBudgetStatusBadge from "@/components/CMBudgetStatusBadge.vue";
import CMBudgetRequestForm from "@/components/CMBudgetRequestForm2.vue";
import FormBudgetStage from "@/components/FormBudgetStage.vue";
import CMBudgetStagesList from "@/components/CMBudgetStagesList.vue";
import CMBudgetItemList from "@/components/CMBudgetItemList.vue";
// import CMLinkCar from "@/components/CMLinkCar.vue";
import CMDocuments from "@/components/CMDocuments.vue";
// import ModalEditBugetItem from "@/components/ModalEditBugetItem.vue";
const _request_types = {
  income: "Продажа",
  expense: "Расход",
  advance_report: "Авансовый отчет",
};

export default {
  name: "BudgetRequestDetails2",

  components: {
    CMBudgetStatusBadge,
    CMBudgetRequestForm,
    FormBudgetStage,
    CMBudgetStagesList,
    CMBudgetItemList,
    // CMLinkCar,
    CMDocuments,
    // ModalEditBugetItem,
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
    request_type: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      // View
      view: { title: "Заявка на расход", subTitle: "Детализация" },
      isLoading: false,
      isApprovable: false,
      // tabsComponent: 1,
      mode: "view", // new, edit, view
      // Models
      request: {
        items: [],
        total_sum: "0.0",
      },
      stageStatus: null,
      requestType: "",
      request_types: _request_types,
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
          this.requestType = this.request_type;
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
      if (this.requestType == "income") {
        this.view.title = "Заявка на продажу " + this.request.id;
      } else if (this.requestType == "expense") {
        this.view.title = "Заявка на оплату " + this.request.id;
      } else if (this.requestType == "advance_report") {
        this.view.title = "Авансовый отчет " + this.request.id;
      }
      this.view.subTitle = this.request.status_string;
    },
    setTitleNew() {
      if (this.requestType == "income") {
        this.view.title = "Новая продажа ";
      } else if (this.requestType == "expense") {
        this.view.title = "Новая оплата ";
      } else if (this.requestType == "advance_report") {
        this.view.title = "Новый авансовый отчет";
      }
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
        this.request = await apiService.getBudgetRequest(request_id);
        this.requestType = this.request.request_type;
        this.setTitle();
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchRequestDelete(request_id) {
      this.isLoading = true;
      try {
        this.request = await apiService.deleteBudgetRequest(request_id);
        this.$UIService.showSuccess(null, "Заявка удалена!");
        this.$router.push({ name: "budget_request_list" });
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchRequestApply(request_id) {
      this.isLoading = true;
      try {
        await apiService.applyBudgetRequest(request_id);
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
