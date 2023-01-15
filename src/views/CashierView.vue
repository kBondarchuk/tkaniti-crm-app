<template>
  <LayoutPage no-paddings>
    <!-- Side Menu -->
    <template #side>
      <div id="side" class="sticked" style="top: 61px">
        <!-- Filter -->
        <form class="ui form" @submit.prevent="reload">
          <!--  -->
          <UIInputDate v-model="filter.date1" label="Начальная дата" />
          <!--  -->
          <UIInputDate v-model="filter.date2" label="Конечная дата" />
          <!--  -->
          <UIInputDropdown
            v-model="filter.order_status"
            label="Статус оплаты"
            :options="[
              { name: 'Все', value: null },
              { name: 'Создан', value: 0 },
              { name: 'Подтверждён', value: 1 },
              { name: 'Завершён', value: 2 },
              { name: 'Отменён', value: 3 },
              { name: 'Возврат', value: 4 },
              { name: 'Авторизация', value: 5 },
              { name: 'Отклонён', value: 6 },
            ]"
          />
          <!--  -->
          <!-- <UIInputDropdown
          v-model.number="filter.cleared"
          @input="clearedDropDownChanged"
          :options="[{name:'Все',value: 0},{name:'Только зачисленные', value: 1},{name:'Только не зачисленные', value: 2}]"
        >Зачислено</UIInputDropdown>-->
          <!--  -->
          <UIButton class="primary">Обновить</UIButton>
        </form>
      </div>
    </template>

    <!-- Toolbar -->
    <!-- <template #toolbar>
      <UIButton icon="plus" type="labeled" style="visibility: hidden">x</UIButton>
    </template> -->
    <!-- /Toolbar -->

    <!-- List -->
    <CMAcquiringTransactionsList
      :key="key"
      :filter-date="filter"
      :header-sticked-at="42"
      @event-details="handleDetails"
    />
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";
import LayoutPage from "@/components/LayoutPage.vue";
import CMAcquiringTransactionsList from "@/components/CMAcquiringTransactionsList.vue";

export default {
  name: "CashierView",
  components: {
    LayoutPage,
    CMAcquiringTransactionsList,
  },
  mixins: [viewMixin],
  data() {
    return {
      view: { title: "Эквайринг", subTitle: "Список платёжных операций" },
      // Keys
      key: 0,
      // Data
      items: [],
      // Filters
      filter: {
        date1: "",
        date2: "",
        order_status: null,
        // cleared: 0
      },
    };
  },
  created() {
    // Load saved params
    let filter = JSON.parse(localStorage.getItem("cashier.filter"));
    if (filter != null) {
      this.filter = filter;
    }
  },
  methods: {
    handleDetails(item) {
      // console.log("row clicked: " + item.id);
      this.$router.push({
        name: "acquiringTransactions_details",
        params: { id: item.id },
      });
    },
    reload() {
      // Save params
      localStorage.setItem("cashier.filter", JSON.stringify(this.filter));
      // this.refetch(this.filter);
      this.key++;
    },
    // value
    orderStatusDropDownChanged() {},
    // clearedDropDownChanged(value) {
    //   switch (value) {
    //     case "0":
    //       this.filter.contract_id = 0;
    //       break;
    //     case "1":
    //       this.filter.contract_id = null;
    //       break;
    //     case "2":
    //       this.filter.contract_id = 1;
    //       break;
    //   }
    // },
  },
};
</script>
