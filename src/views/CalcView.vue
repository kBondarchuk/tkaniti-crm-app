<template>
  <LayoutPage no-paddings>
    <!-- Title -->
    <template #title>
      <UIButton
        text="Скачать график платежей"
        icon="download"
        type="basic labeled"
        :class="{ loading: isDownloading, disabled: isDownloading }"
        @click="actionDownloadContractGraph"
      />
    </template>

    <!-- Side Bar -->
    <template #side>
      <div v-if="!isReady" id="loader" class="ui active centered double inline loader"></div>
      <div v-if="isReady" id="side" class="sticked" style="top: 60px">
        <form class="ui form" @submit.prevent="recalc">
          <!--  -->
          <UIInputMoney v-model.lazy="params.price" label="Стоимость автомобиля" name="money_field" />
          <!--  -->
          <UIInputMoney v-model.lazy="params.down_payment" label="Первоначальный взнос" name="money_field" />
          <!--  -->
          <UIInputNumber
            id="days"
            v-model.number.lazy="params.days"
            label="Срок в днях"
            name="days_field"
            :class="{ error: params.days > presets.maxDaysAllowed }"
          />
          <!--  -->
          <UIInputMoney
            id="daily_percent"
            v-model.lazy="params.daily_percentage"
            label="Дневной процент"
            :decimal-scale="3"
          />
          <!--  -->
          <!-- TODO: Fix top/ bottom paddings (compact) -->
          <UIButton text="Рассчитать" class="primary big fluid" />
        </form>
        <!-- Подбор -->
        <form class="ui form" @submit.prevent="calculateTerm()">
          <div class="ui hidden divider"></div>
          <!--  -->
          <UIInputMoney v-model.lazy="desiredPayment" label="Желаемый платёж" :error="errors.desiredPayment" />

          <button class="compact fluid ui button">Подобрать срок</button>
        </form>
        <!--
        <div class="ui hidden divider"></div>
         <h5 class="ui horizontal divider header">Результат</h5>
        <div>  -->
        <!-- <div>Стоимость: {{price}}</div>
        <div>Первоначальный взнос: {{down_payment}}</div>
        <div>Первоначальный взнос: {{days}}</div>
        <div>Дневной процент: {{daily_percentage}}</div>-->
        <!-- <div style="text-align: center">
            Дневной платёж:
            <h2 style="text-align: center">
              <span v-if="result.dailyPayment">{{ $filters.money(result.dailyPayment) }} &#8381;</span>
              <span v-else>&mdash;</span>
            </h2>
          </div>
          <div style="text-align: center">
            Месячный платёж:
            <h2 style="text-align: center">
              <span v-if="result.monthlyPayment">{{ $filters.money(result.monthlyPayment) }} &#8381;</span>
              <span v-else>&mdash;</span>
            </h2>
          </div>
          <div style="text-align: center">
            Рекомендованный платёж:
            <h2 style="text-align: center">
              <span v-if="recommendedPayment">{{ $filters.money(recommendedPayment) }} &#8381;</span>
              <span v-else>&mdash;</span>
            </h2>
          </div>
        </div> -->

        <div class="ui hidden divider"></div>
        <!-- <div class="ui divider"></div> -->
        <!-- (?) -->
        <div style="text-align: center; padding-top: 1em">
          <i id="popover" class="circular percent icon link"></i>
        </div>
        <!--  -->
        <CMPercentTableList :items="percent_table" />
      </div>
    </template>

    <div class="ui horizontal hidden divider"></div>
    <div class="result_container">
      <!-- <div>Стоимость: {{price}}</div>
        <div>Первоначальный взнос: {{down_payment}}</div>
        <div>Первоначальный взнос: {{days}}</div>
        <div>Дневной процент: {{daily_percentage}}</div>-->
      <!--  -->
      <div class="result_item">
        Дневной платёж
        <h2 style="text-align: center">
          <span v-if="result.dailyPayment">{{ $filters.money(result.dailyPayment) }} &#8381;</span>
          <span v-else>&mdash;</span>
        </h2>
      </div>
      <!--  -->
      <div class="result_item">
        Месячный платёж
        <h2 style="text-align: center">
          <span v-if="result.monthlyPayment">{{ $filters.money(result.monthlyPayment) }} &#8381;</span>
          <span v-else>&mdash;</span>
        </h2>
      </div>
      <!--  -->
      <div class="result_item">
        Рекомендованный платёж
        <h2 style="text-align: center">
          <span v-if="recommendedPayment">{{ $filters.money(recommendedPayment) }} &#8381;</span>
          <span v-else>&mdash;</span>
        </h2>
      </div>
    </div>
    <div class="ui hidden divider"></div>
    <div class="ui horizontal divider">График платежей</div>
    <div class="ui divider" style="margin: 0"></div>
    <!-- Calc Graph -->
    <CMScheduleList
      :key="calc_key"
      :price="params.price"
      :down_payment="params.down_payment"
      :days="params.days"
      :daily_percentage="params.daily_percentage"
      :header-sticked-at="42"
      style="margin-top: 0"
      @calc:result="showResult"
    />
    <!-- /Calc Graph -->
    <!-- </div> -->
    <!-- </div> -->
  </LayoutPage>
</template>

<script>
import apiService from "@/services/api.service.js";
import { viewMixin } from "@/mixins/ViewMixin.js";
import { CalcSharedMixin } from "@/mixins/CalcSharedMixin.js";

import LayoutPage from "@/components/LayoutPage.vue";
import CMScheduleList from "@/components/CMScheduleList.vue";
import CMPercentTableList from "@/components/CMPercentTableList.vue";

export default {
  name: "CalcView",

  components: {
    LayoutPage,
    CMScheduleList,
    CMPercentTableList,
  },

  mixins: [viewMixin, CalcSharedMixin],

  data() {
    return {
      // Form Data
      params: {
        price: 0, // this.$store.state.prefs.calc.default_car_price,
        down_payment: 0, //this.$store.state.prefs.calc.default_down_payment,
        days: 0,
        daily_percentage: 0, //this.$store.state.prefs.calc.default_daily_percentage,
      },

      // Keys
      calc_key: 0,
      // Result
      result: {
        dailyPayment: "",
        monthlyPayment: "",
      },
      // UI
      view: { title: "Калькулятор", subTitle: "Расчет графика платежей" },
      isDownloading: false,
      isReady: false,
    };
  },

  // mounted() {
  //   $("#popover").popup({
  //     hoverable: true,
  //     popup: ".percent-table",
  //     position: "top left",
  //     lastResort: "right center",
  //     inline: true,
  //   });

  //   this.params.days = this.presets.days; // this.$store.state.prefs.calc.default_days;
  //   console.log("-----2", this.params.days);
  // },

  methods: {
    recalc() {
      this.calc_key++;
    },
    showResult(result) {
      this.result.dailyPayment = result;
      this.result.monthlyPayment = result * 30;
    },
    actionDownloadContractGraph() {
      this.downloadContractGraph();
    },
    flashDailyPercent() {
      $("#daily_percent").transition({
        animation: "pulse",
        reverse: true,
        duration: 200,
        interval: 100,
      });
    },
    flashDays() {
      $("#days").transition({
        animation: "pulse",
        reverse: true,
        duration: 200,
        interval: 100,
      });
    },
    preloadDone() {
      this.isReady = true;

      this.$nextTick(() => {
        $("#popover").popup({
          hoverable: true,
          popup: ".percent-table",
          position: "top center",
          lastResort: "top center",
          inline: true,
        });
        this.params.days = this.presets.days; // this.$store.state.prefs.calc.default_days;
      });
    },

    async downloadContractGraph() {
      this.isDownloading = true;
      try {
        let result = await apiService.downloadGraph(
          this.params.price,
          this.params.down_payment,
          this.params.daily_percentage,
          this.params.days
        );
        console.log(result.file);
        // Get Token
        let token = await apiService.getDownloadToken();
        // Start Download
        this.startDownload(result.file, token);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isDownloading = false;
    },
    startDownload(filename, token) {
      // Make URL
      let fileUrl = this.$store.state.url_download_base + "?file=" + filename + "&jwt=" + token + "&saving=yes";

      // Start Download
      window.location = fileUrl;
    },
  },
};
</script>

<style scoped>
#side {
  padding-bottom: 3rem;
  padding-left: 0.5rem;
  padding-right: 0rem;
  width: 18rem;
}

form.ui.form {
  font-size: 1.3rem;
}

#loader {
  top: 50%;
  transform: translateY(-50%);
}

.ui.horizontal.divider:after,
.ui.horizontal.divider:before {
  background-image: none;
}

.result_item {
  flex: 1;
  text-align: center;
}

.result_container {
  display: flex;
}
</style>
