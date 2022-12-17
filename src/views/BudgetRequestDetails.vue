<template>
  <LayoutPage>
    <!-- Toolbar -->
    <!-- Back -->
    <template #toolbar>
      <UIButton icon="left arrow" type="basic labeled" @click="back('budget_request_list')">Назад</UIButton>
      <!--  -->

      <!--  -->
      <!-- <div class="ui small compact button icon basic labeled" style="visibility: hidden">S</div> -->

      <!-- 1: Черновик -->

      <!--  -->
      <div class="" style="display: inline-block; background-color: red; margin: 0 2em"></div>
      <UIButton
        v-if="request.status == 0 || request.status == 3"
        icon="arrow right"
        type="blue right labeled "
        :class="{ disabled: !checkAuthRole('budget.create') || mode != 'view' }"
        @click="stageTo(1)"
        >На согласование</UIButton
      >
      <UISpacer />
      <!-- Удалить -->
      <UIButton
        v-if="(request.status == 0 || request.status == 3) && mode == 'view'"
        icon="trash"
        type="red left labeled"
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
        @click="cancel"
        >Отменить</UIButton
      >
      <!-- Save -->
      <UIButton
        v-if="((request.status == 0 || request.status == 3) && mode == 'edit') || mode == 'new'"
        icon="save"
        type="green labeled"
        :class="{ disabled: !checkAuthRole('budget.create') || !isApprovable }"
        @click="save"
        >Сохранить</UIButton
      >
      <!-- Edit -->
      <UIButton
        v-if="(request.status == 0 || request.status == 3) && mode == 'view'"
        icon="edit"
        type="basic labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="edit"
        >Изменить</UIButton
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
        @click="stageTo(4)"
        >Согласовать</UIButton
      >
      <!-- 2: Отклонена -->
      <UIButton
        v-if="request.status == 2 || request.status == 4"
        icon="undo alternate"
        type="right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="stageTo(3)"
        >На исправление</UIButton
      >
      <!-- 4: Исполнение -->
      <UIButton
        v-if="request.status == 4"
        icon="paper plane"
        type="blue right labeled"
        :class="{ disabled: !checkAuthRole('budget.create') }"
        @click="applyRequest()"
        >Исполнить</UIButton
      >

      <!--  -->
    </template>
    <!-- /Toolbar -->

    <!--  -->
    <div class="ui grid">
      <!-- fist column -->
      <div
        :class="{
          'fourteen wide column': mode == 'edit' || mode == 'new',
          'eleven wide column': mode == 'view',
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
              <td>Описание заявки</td>
              <td class="text-bold">{{ request.notes }}</td>
            </tr>
            <tr>
              <td>Дата учёта расхода</td>
              <td>{{ $filters.date(request.expense_dt) }}</td>
            </tr>
            <tr>
              <td>Тип</td>
              <td>{{ request.expense_type }}</td>
            </tr>
            <tr v-if="request.expense_car">
              <td>Автомобиль</td>
              <td><CMLinkCar :car-id="request.expense_car_id" /> {{ request.expense_car }} {{ request.car_branch }}</td>
            </tr>
            <tr>
              <td>Инвестор</td>
              <td>{{ request.investor }}</td>
            </tr>
            <tr>
              <td>Филиал</td>
              <td>{{ request.branch }}</td>
            </tr>

            <!-- <tr>
              <td>Сумма</td>
              <td class="text-bold">{{$filters.money(request.total_sum )}}</td>
            </tr> -->
          </tbody>
        </table>
        <!-- /Table -->

        <!-- Items -->
        <table v-if="mode == 'view'" class="ui very compact celled small table" :class="{ loading: isLoading }">
          <thead>
            <tr>
              <th>id</th>
              <th>Статья расхода</th>
              <th>Описание</th>
              <th>Документ</th>
              <th class="right aligned">Сумма, &#8381;</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in request.items" :key="index">
              <td>
                {{ item.id }}<span v-if="item.transaction_id">&ndash;{{ item.transaction_id }}</span>
              </td>
              <td>{{ item.expense_category_path }}</td>
              <td>{{ item.expense_notes }}</td>
              <td>{{ item.document }}</td>
              <td class="right aligned">
                <span class="nobr">{{ $filters.money(item.expense_amount) }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colspan="4" class="right aligned" style="font-weight: bold">ИТОГО</th>
              <th class="right aligned" style="font-weight: bold">
                <span class="nobr">{{ $filters.money(request.total_sum) }}</span>
              </th>
            </tr>
          </tfoot>
        </table>
        <!-- /Items -->

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
      <div v-if="mode == 'view'" class="five wide second column">
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
    ></FormBudgetStage>
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import apiService from "@/services/api.service.js";

import CMBudgetStatusBadge from "@/components/CMBudgetStatusBadge.vue";
import CMBudgetRequestForm from "@/components/CMBudgetRequestForm.vue";
import FormBudgetStage from "@/components/FormBudgetStage.vue";
import CMBudgetStagesList from "@/components/CMBudgetStagesList.vue";
import CMLinkCar from "@/components/CMLinkCar.vue";
import CMDocuments from "@/components/CMDocuments.vue";

export default {
  name: "BudgetRequestDetails",

  components: {
    CMBudgetStatusBadge,
    CMBudgetRequestForm,
    FormBudgetStage,
    CMBudgetStagesList,
    CMLinkCar,
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
    request_type: {
      type: String,
      default: "expense",
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
      request: {},
      stageStatus: null,
      requestType: "",
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
      if (this.request_type == "income") {
        this.view.title = "Заявка на продажу " + this.request.id;
      } else if (this.request_type == "expense") {
        this.view.title = "Заявка на расход " + this.request.id;
      }
      this.view.subTitle = this.request.status_string;
    },
    setTitleNew() {
      if (this.request_type == "income") {
        this.view.title = "Новая заявка на продажу ";
      } else if (this.request_type == "expense") {
        this.view.title = "Новая заявка на расход ";
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
