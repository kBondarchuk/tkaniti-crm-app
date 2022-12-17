import apiService from "@/services/api.service.js";
import { getCurrentDate } from "@/utils/utils.js";

export const CreateContractSharedMixin = {
  data: function () {
    return {
      // Contract params
      params: {
        contract_number: "",
        contract_date: null,
        first_pay_date: null,
        price: undefined,
        down_payment: undefined,
        days: 0,
        daily_percentage: null,
        notes: "",
        use_accum: 0,
        company_id: null,
        customer_id: null,
        car_id: null,
      },
      // Selections
      selectedObjects: {
        car: undefined,
        customer: undefined,
        investor: undefined,
      },
      // Подбор
      desiredPayment: undefined,
      lastContractNumber: "ИНВ 000/00",

      // presets: {
      //   days: 720,
      //   percent: "0.26",
      //   maxDays: 1825, //1095,
      // },
      // Errors
      // errors: {
      //   days: null,
      //   desiredPayment: null,
      // },
      isLoading: false,
      // view: { title: "-", subTitle: "-" },
      getCurrentDate,
    };
  },

  computed: {
    canSubmit() {
      const valid =
        this.validateCar.success &&
        this.validateCustomer.success &&
        this.validateContractNumber.success &&
        this.validateContractDate.success &&
        this.validateDays.success &&
        this.validatePrice.success &&
        this.validateDownPayment.success &&
        this.validatePercent.success &&
        this.validateFirstPaymentDate.success &&
        this.validateCompany.success &&
        (this.validateAccum.success || !this.params.use_accum);
      return valid && !this.isLoading;
    },
    canCalculate() {
      const valid =
        this.validateDays.success &&
        this.validatePrice.success &&
        this.validateDownPayment.success &&
        this.validatePercent.success;
      return valid && !this.isLoading;
    },
    validateCar() {
      return this.validateClass(
        this.params.car_id,
        this.params.car_id > 0 && this.selectedObjects.car?.investor_id && this.selectedObjects.car?.ref_car_status == 1
      );
    },
    validateCustomer() {
      return this.validateClass(
        this.params.customer_id,
        this.params.customer_id > 0 &&
          this.selectedObjects.customer?.branch_id >= 0 &&
          this.selectedObjects.customer?.branch_id == this.selectedObjects.car?.branch_id
      );
    },
    validateContractDate() {
      return this.validateClass(this.params.contract_date, this.params.contract_date?.length == 10);
    },
    validateContractNumber() {
      return this.validateClass(this.params.contract_number, this.params.contract_number?.length > 3);
    },
    validateFirstPaymentDate() {
      return this.validateClass(
        this.params.first_pay_date,
        this.params.first_pay_date?.length == 10 && this.checkFirstPaymentDate(this.params.first_pay_date)
      );
    },
    validatePrice() {
      return this.validateClass(this.params.price, this.params.price > 0);
    },
    validateDownPayment() {
      return this.validateClass(this.params.down_payment, this.params.down_payment >= 0);
    },
    validateDays() {
      return this.validateClass(true, this.params.days > 0 && this.params.days <= this.presets.maxDaysAllowed);
    },
    validatePercent() {
      return this.validateClass(
        this.params.daily_percentage,
        this.params.daily_percentage > 0 && this.params.daily_percentage < 1
      );
    },
    validateAccum() {
      return this.validateClass(
        this.params.down_payment && this.params.use_accum && this.params.customer_id,
        parseFloat(this.params.down_payment) <= parseFloat(this.selectedObjects.customer?.accum)
      );
    },
    validateCompany() {
      return this.validateClass(true, this.params.company_id > 0);
    },
  },

  watch: {
    // "params.days": function (newValue) {
    //   // newValue, oldValue
    //   if (isNaN(newValue)) return;

    //   // Validate
    //   if (newValue > this.presets.maxDays) {
    //     this.errors.days = "Срок не может превышать " + this.presets.maxDays + " дней";
    //   } else {
    //     this.errors.days = "";
    //   }

    //   // Percent
    //   const found = this.percent_table.find((item) => item.term >= parseInt(newValue));

    //   // set default percent
    //   var percent = this.presets.percent;

    //   if (found != undefined) {
    //     percent = found.percent;
    //   }

    //   // Flash if changed
    //   if (this.params.daily_percentage !== String(percent)) {
    //     this.params.daily_percentage = String(percent);
    //     this.flashDailyPercent();
    //   }
    //   console.log(`[CreateContractSharedMixin]: ${percent}% for ${newValue} days.`);
    // },
    "params.contract_date": function () {
      this.changeContractNumber();
    },
  },

  created() {
    console.warn("[CreateContractSharedMixin]: created");
    this.fetchLastContractNumber();
  },

  mounted() {
    // Toggle percent calculation
    // this.params.days = this.presets.days;
  },

  methods: {
    // Validation
    validateClass(checkBoth, check) {
      return {
        success: checkBoth && check,
        error: checkBoth && !check,
      };
    },
    checkFirstPaymentDate(first_pay_date) {
      const date_selected = new Date(first_pay_date);
      const date_current = new Date(this.getCurrentDate());

      if (date_selected <= date_current) {
        return false;
      } else {
        return true;
      }
    },

    // Setters
    companySelected(item) {
      this.selectedObjects.company = item;
    },
    carSelected(item) {
      console.log("[CreateContractSharedMixin]: carSelected");
      this.selectedObjects.car = item;
      this.params.car_id = item.id;
      this.params.price = item.price;
      this.params.down_payment = (item.price * 0.1).toFixed(2).toString();
      this.params.company_id = item.company_id;
      if (item.investor_id > 0) {
        this.fetchInvestor(item.investor_id);
      }
      if (this.calc_key > 0) {
        this.recalc();
      }
    },
    customerSelected(item) {
      this.selectedObjects.customer = item;
      this.params.customer_id = item.id;
      this.params.use_accum = 0;
    },
    investorSelected(item) {
      console.log("[CreateContractSharedMixin]: investorSelected: ", item);

      this.selectedObjects.investor = item;
      // Refresh Contract number
      this.changeContractNumber();
    },

    // Actions
    generateContractNumber(investor) {
      let contractPrefix = "ИНВ";

      if (investor !== undefined && investor.first_name !== "" && investor.last_name !== "") {
        contractPrefix = investor.last_name[0] + investor.first_name[0] + (investor.second_name[0] || "");
      }

      const contractLastIntNumber = parseInt(this.lastContractNumber.split(" ")[1].split("/")[0]);
      const contractNumber = ("00" + (contractLastIntNumber + 1)).slice(-3);
      const contractYear = this.params.contract_date ? this.params.contract_date.split("-")[0].substr(-2, 2) : "";

      return contractPrefix + " " + contractNumber + "/" + contractYear;
    },

    changeContractNumber() {
      // Refresh Contract number
      this.params.contract_number = this.generateContractNumber(this.selectedObjects.investor);
      this.flashContractNumber();
    },

    // Networking
    async fetchLastContractNumber() {
      // console.warn("fetchLastContractNumber");
      this.isLoading = true;
      try {
        let result = await apiService.getContractLastNumber();
        this.lastContractNumber = result.contract_number;
      } catch (error) {
        // this.$UIService.showNetworkError(error);
        this.$UIService.showInfo("Инфо", "Последний номер договора не найден");
      }
      this.isLoading = false;
    },
    async fetchInvestor(investor_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getInvestor(investor_id);
        this.investorSelected(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },

    // Required

    flashContractNumber() {
      console.warn("[CreateContractSharedMixin]: flashContractNumber() не объявлен!");
    },
  },
  // EOF
};
