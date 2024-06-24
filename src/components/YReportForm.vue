<template>
  <!-- Дата договора -->
  <form class="ui form" :class="{ loading: isLoading }" autocomplete="off" @submit.prevent>
    <div class="fields" style="margin: 0 -0.5em 0.5em">
      <!-- Date1 -->
      <UIInputDate v-if="dateMode != 'none'" v-model="date1" :type="dateType">{{
        date1Title || "Начальная дата"
      }}</UIInputDate>
      <!-- Date2 -->
      <UIInputDate v-if="dateMode == 'double'" v-model="date2" :type="dateType">Конечная дата</UIInputDate>
      <!-- Select Investor -->
      <!-- <UIInputDropdownMultiple
        v-if="showInvestors"
        v-model="investor_selected"
        label="Инвесторы"
        placeholder="Все"
        :options="investorsList"
        style="min-width: 10em"
      /> -->
      <!-- Buttons -->
      <div class="field">
        <div class="ui sub header" style="visibility: hidden">X</div>
        <UIButton type="primary" style="margin-top: 2px" @click="handleClickRequest">Запрос</UIButton>
      </div>
      <div v-if="showSave" class="field">
        <div class="ui sub header" style="visibility: hidden">X</div>
        <UIButton type="" style="margin-top: 2px" @click="handleClickSave">Скачать</UIButton>
      </div>
    </div>
  </form>
</template>

<script>
import { getCurrentDate, getCurrentMonthFirstDate, getFirstMonthOfYearDate } from "@/utils/utils.js";

export default {
  name: "YReportForm",

  props: {
    showSave: {
      type: Boolean,
      default: false,
    },
    // showInvestors: {
    //   type: Boolean,
    //   default: true,
    // },
    // single
    // double
    // none
    dateMode: {
      type: String,
      default: "double", // single | double
    },
    dateType: {
      type: String,
      default: "date", // date | month
    },
    date1Title: {
      type: String,
      default: null,
    },
  },

  emits: ["reportRequest", "reportSave"],

  data() {
    return {
      isLoading: false,
      date1: "",
      date2: "",
      // Helpers
      // investor_selected: [],
      // investors: [],
    };
  },
  // computed: {
  //   investorsList() {
  //     return this.investors.map(function (item) {
  //       return { name: item.last_name, value: item.id };
  //     });
  //   },
  //   authBranches() {
  //     return this.$store.getters["auth/getAuthData"].branches;
  //   },
  // },
  created() {
    // Load saved params
    const ext_type = this.dateType ? "_" + this.dateType : "";
    const ext_mode = this.dateMode ? "_" + this.dateMode : "";
    const date1 = localStorage.getItem("reports.date1" + ext_mode + ext_type);
    const date2 = localStorage.getItem("reports.date2" + ext_mode + ext_type);

    if (date1) {
      this.date1 = date1;
    }

    if (date2) {
      this.date2 = date2;
    }
    // console.log(this.dateMode, ", ", this.dateType);

    // Auto date
    // single, date
    if (this.dateMode == "single" && this.dateType == "date") {
      console.log("Set current date to:" + getCurrentDate());
      this.date1 = getCurrentDate();
    }

    // double,  date
    if (this.dateMode == "double" && this.dateType == "date") {
      console.log("Set current date to:", getCurrentMonthFirstDate() + " - " + getCurrentDate());
      this.date1 = getCurrentMonthFirstDate();
      this.date2 = getCurrentDate();
    }

    // single,  month
    if (this.dateMode == "single" && this.dateType == "month") {
      console.log("Set current date to:", getCurrentMonthFirstDate());
      this.date1 = getCurrentMonthFirstDate();
    }

    // double,  month
    if (this.dateMode == "double" && this.dateType == "month") {
      console.log("Set current date to:", getCurrentMonthFirstDate());
      this.date1 = getFirstMonthOfYearDate();
      this.date2 = getCurrentMonthFirstDate();
    }
  },

  methods: {
    handleClickRequest() {
      console.log("Form: click request", this.date1);

      if (!this.date1 && this.dateMode != "none") {
        return;
      }

      // Prepare Payload
      const payload = {
        date1: this.date1,
        date2: this.date2,
        // investors: investors_filter,
        // branches: this.authBranches.join(","),
      };

      this.$emit("reportRequest", payload);
      // Save params
      const ext_type = this.dateType ? "_" + this.dateType : "";
      const ext_mode = this.dateMode ? "_" + this.dateMode : "";
      console.log("save: ", "reports.date1" + ext_mode + ext_type);
      localStorage.setItem("reports.date1" + ext_mode + ext_type, this.date1);
      if (this.dateMode != "single") {
        localStorage.setItem("reports.date2" + ext_mode + ext_type, this.date2);
      }
    },
    handleClickSave() {
      console.log("Form: click save");
      this.$emit("reportSave");
    },
  },
};
</script>
