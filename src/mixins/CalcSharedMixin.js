import apiService from "@/services/api.service.js";

export const CalcSharedMixin = {
  data: function () {
    return {
      // view: { title: "-", subTitle: "-" },
      presets: {
        days: 0,
        percent: "0.0",
        maxDaysAllowed: 0, //this.$store.state.prefs.calc.max_days_allowed, //1095,
        desiredPaymentFactor: 0.002778,
      },
      // Таблица процентов
      percentTable: null,
      // Подбор
      desiredPayment: 0, //this.$store.state.prefs.calc.default_desired_payment,
      // Errors
      errors: {
        desiredPayment: null,
        days: null,
      },
    };
  },

  created() {
    console.warn("[CalcSharedMixin]: created");
    this.fetchCalcPrefs();
  },

  computed: {
    percent_table() {
      return this.percentTable;
      // return this.$store.getters["prefs/percentTable"];
    },
    recommendedPayment() {
      return (this.params.price - this.params.down_payment) * this.presets.desiredPaymentFactor; //this.$store.state.prefs.calc.desired_payment_factor;
    },
  },

  watch: {
    "params.days": function (newValue) {
      // newValue, oldValue
      if (isNaN(newValue)) return;

      // Validate
      if (newValue > this.presets.maxDaysAllowed) {
        this.errors.days = "Срок не может превышать " + this.presets.maxDaysAllowed + " дней";
      } else {
        this.errors.days = "";
      }

      // Percent
      const found = this.percent_table.find((item) => item.term >= parseInt(newValue));

      // set default percent
      var percent = this.presets.percent;

      if (found != undefined) {
        percent = found.percent;
      }

      // Flash if changed
      if (this.params.daily_percentage !== String(percent)) {
        this.params.daily_percentage = String(percent);
        this.flashDailyPercent();
      }
      console.log(`[CreateContractSharedMixin]: ${percent}% for ${newValue} days.`);
    },
    "params.price": function (newValue) {
      // newValue, oldValue
      if (isNaN(newValue)) return;
      this.params.down_payment = newValue * 0.1;
    },
  },

  methods: {
    calcCred(summaKr, percent, days) {
      percent = percent / 100;
      const annuitet = Math.round(summaKr * (percent / (1 - Math.pow(1 + percent, -days))), 10);

      // console.log(annuitet);
      return annuitet;
    },
    calcTerms(summaKr, percent, annuitet) {
      percent = percent / 100;
      const a = Math.log(1 - percent / (annuitet / summaKr));
      const b = Math.log(1 + percent);
      const x = Math.round(Math.abs(a / b));
      // console.log(x);
      return x;
    },
    calcSelectTerm(summaKr, desiredAnnuitet) {
      var foundDays = 0;
      for (let i = this.percent_table.length - 1; i > 0; i--) {
        var item = this.percent_table[i];
        // console.log(item.term, item.percent);
        const days = this.calcTerms(summaKr, item.percent, desiredAnnuitet);
        // console.log("---");
        if (item.term < days) {
          foundDays = days;
          break;
        }
      }
      console.log("[CalcSharedMixin]: Found term: ", foundDays);

      // Iterate days -1

      for (let i = foundDays; i > 0; i--) {
        const found = this.percent_table.find((item) => item.term >= parseInt(i));
        const percent = found.percent;
        const annuitet = this.calcCred(summaKr, percent, i);
        // console.log("Платеж: ", annuitet, " срок: ", i);
        if (annuitet > desiredAnnuitet) {
          foundDays = i + 1;
          console.log("[CalcSharedMixin]: Found annuitet: ", annuitet, foundDays);
          break;
        }
      }

      return foundDays;
    },

    calculateTerm() {
      this.errors.desiredPayment = null;

      const foundDays = this.calcSelectTerm(this.params.price - this.params.down_payment, this.desiredPayment);

      if (foundDays > 0) {
        if (this.params.days != foundDays) {
          this.params.days = foundDays;
          this.recalc();
          this.flashDays();
          // console.warn("[SharedCreateContract]: найден!");
        }
      } else {
        console.warn("[CalcSharedMixin]: calculateTerm: Не найден!");
        this.errors.desiredPayment = "Подходящий срок для указанного платежа не найден";
      }
    },

    //
    recalc() {
      console.warn("[CalcSharedMixin]: recalc() не объявлен!");
    },
    flashDailyPercent() {
      console.warn("[CalcSharedMixin]: flashDailyPercent() не объявлен!");
    },
    flashDays() {
      console.warn("[CalcSharedMixin]: flashDays() не объявлен!");
    },
    preloadDone() {
      console.warn("[CalcSharedMixin]: preloadDone() не объявлен!");
    },

    // NETWORKING
    async fetchCalcPrefs() {
      console.log("[CalcSharedMixin]: Getting calc prefs...");

      try {
        let default_car_price = await apiService.getPrefValueByKey("calc.default_car_price");
        let default_down_payment = await apiService.getPrefValueByKey("calc.default_down_payment");
        let default_days = await apiService.getPrefValueByKey("calc.default_days");
        let default_desired_payment = await apiService.getPrefValueByKey("calc.default_desired_payment");
        // let desired_payment_factor = await apiService.getPrefValueByKey("calc.desired_payment_factor");
        let max_days_allowed = await apiService.getPrefValueByKey("calc.max_days_allowed");

        if (!this.params.price) {
          this.params.price = default_car_price.decimal_value;
        }

        if (!this.params.down_payment) {
          this.params.down_payment = default_down_payment.decimal_value;
        }

        this.presets.days = default_days.int_value;
        this.presets.maxDaysAllowed = max_days_allowed.int_value;
        // FIXME: this.presets.desiredPaymentFactor = desired_payment_factor.decimal_value;
        this.presets.desiredPaymentFactor = this.$store.state.prefs.calc.desired_payment_factor;

        this.desiredPayment = default_desired_payment.decimal_value;

        console.log("[CalcSharedMixin]: Got calc prefs.");

        //
        await this.fetchPercentTable();
        //
        this.preloadDone();
        //
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
    async fetchPercentTable(context) {
      console.log("[CalcSharedMixin]: Getting percent table...");

      try {
        this.percentTable = await apiService.getLeasePercentTable();

        console.info("[CalcSharedMixin]: Got percent table.");
        console.table(this.percentTable);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }

      // let percent_table = dynamic_percents;
      // percent_table.sort((a, b) => (a.term > b.term ? 1 : -1));
    },
  },
  // EOF
};
