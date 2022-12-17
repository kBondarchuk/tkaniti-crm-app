<template>
  <div class="field" :class="{ disabled: disabled }">
    <div class="ui sub header">
      <slot />
    </div>
    <div class="ui calendar">
      <div class="ui action input">
        <input
          :id="name"
          ref="input"
          v-model="inputText"
          :placeholder="placeholder"
          :name="name"
          :disabled="disabled"
          type="text"
          autocomplete="off"
          @blur="parseInput"
        />
        <button class="ui icon button">
          <i class="calendar alternate outline icon"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const calendar_defaults = {
  type: "date",
  firstDayOfWeek: 1,
  initialDate: null,
  formatInput: true,
  on: "click",
  text: {
    days: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пн", "Сб"],
    months: [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
    months_ru: [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ],
    monthsShort: ["Янв", "Фвр", "Мрт", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    today: "Сегодня",
    now: "Сейчас",
    am: "AM",
    pm: "PM",
  },
  formatter: {
    date: function (date, settings) {
      // console.log(settings);
      if (!date) return "";
      var day = date.getDate() + "";
      // if (day.length < 2) {
      //   day = "0" + day;
      // }
      var month = settings["text"]["months_ru"][date.getMonth()];
      // if (month.length < 2) {
      //   month = "0" + month;
      // }
      var year = date.getFullYear();
      return day + " " + month + " " + year;
    },
  },
};

export default {
  name: "UIInputDate2",
  props: {
    value: String,
    placeholder: String,
    name: String,
    disabled: Boolean,
  },
  data() {
    return {
      inputText: String,
    };
  },
  watch: {
    // newValue, oldValue
    value(newValue) {
      console.log("newValue: ", newValue);
      // Set value
      // $(this.$refs.calendar).calendar("set date", newValue, false, false);
    },
  },
  mounted: function () {
    // console.log("mounted");

    // Prepare Date format
    Date.prototype.yyyymmdd = function () {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();

      return [this.getFullYear(), (mm > 9 ? "" : "0") + mm, (dd > 9 ? "" : "0") + dd].join("-");
    };

    // Init Calendar UI
    let vm = this;
    let settings = $.extend(calendar_defaults, {
      // callback when date changes, return false to cancel the change
      onChange: function (date, text, mode) {
        console.log("-- date: ", date, "text: ", text, "mode: ", mode, " | ", date.yyyymmdd());

        if (text) {
          vm.inputText = text;
        }
      },
    });

    $(this.$refs.calendar).calendar(settings);
    // Set value
    $(this.$refs.calendar).calendar("set date", this.value);
  },
  beforeUnmount: function () {
    // Destroy Calendar
    $(this.$refs.calendar).off();
  },
  methods: {
    parseInput() {
      console.log("parse");
      // $(this.$refs.calendar).calendar("set date", this.inputText, false, true);
      // const parsedDate = calendar_defaults["formatter"].date(new Date());
    },
  },
};
</script>
