<template>
  <div class="field" :class="{ disabled: disabled }">
    <!--  -->
    <label v-if="$slots.default || label" :for="name">
      <slot />
      <template v-if="label">{{ label }}</template>
    </label>
    <!--  -->
    <div ref="calendar" class="ui calendar">
      <div class="ui input left icon">
        <i class="calendar icon"></i>
        <input :id="name" :placeholder="placeholder" :name="name" :disabled="disabled" type="text" autocomplete="off" />
      </div>
    </div>
    <!--  -->
  </div>
</template>

<script>
const calendar_defaults = {
  type: "date",
  firstDayOfWeek: 1,
  // monthFirst: false,
  initialDate: null,
  selectAdjacentDays: true,
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
  ampm: false,
  formatter: {},
};

const formatter_month = {
  date: function (date, settings) {
    if (!date) return "";
    const month = settings["text"]["months"][date.getMonth()];
    const year = date.getFullYear();
    return month + " " + year;
  },
};

const formatter_date = {
  date: function (date, settings) {
    if (!date) return "";
    const day = date.getDate() + "";
    const month = settings["text"]["months_ru"][date.getMonth()];
    const year = date.getFullYear();
    return day + " " + month + " " + year;
  },
};

const formatter_datetime = {
  date: function (date, settings) {
    if (!date) return "";
    const day = date.getDate() + "";
    const month = settings["text"]["months_ru"][date.getMonth()];
    const year = date.getFullYear();
    // const time = ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2);
    // console.log(time);
    return day + " " + month + " " + year + ", ";
  },
};

export default {
  name: "UIInputDate",

  props: {
    modelValue: String,
    label: String,
    placeholder: String,
    name: String,
    disabled: Boolean,
    type: {
      type: String,
      default: "date",
    },
  },

  emits: ["update:modelValue"],

  data() {
    return {
      date: this.modelValue,
      formattedValue: String,
    };
  },

  watch: {
    modelValue(newValue) {
      // Set value

      if (newValue) {
        // console.log("new date: ", newValue);
        $(this.$refs.calendar).calendar("set date", newValue, true, false);
      } else {
        $(this.$refs.calendar).calendar("clear");
        // console.log("Date clear!");
      }
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

    Date.prototype.yyyymmdd_time = function () {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
      const time = ("0" + this.getHours()).slice(-2) + ":" + ("0" + this.getMinutes()).slice(-2);
      return [this.getFullYear(), (mm > 9 ? "" : "0") + mm, (dd > 9 ? "" : "0") + dd].join("-") + " " + time;
    };

    calendar_defaults["type"] = this.type;
    if (this.type == "month") {
      calendar_defaults["formatter"] = formatter_month;
    } else if (this.type == "datetime") {
      calendar_defaults["formatter"] = formatter_datetime;
    } else {
      calendar_defaults["formatter"] = formatter_date;
    }

    // Init Calendar UI
    let vm = this;
    // let settings =
    $.extend(calendar_defaults, {
      // callback when date changes, return false to cancel the change
      onChange: function (date) {
        if (date) {
          if (vm.type === "datetime") {
            vm.$emit("update:modelValue", date.yyyymmdd_time());
          } else {
            vm.$emit("update:modelValue", date.yyyymmdd());
          }
        }
      },
    });

    $(this.$refs.calendar).calendar(calendar_defaults);
    // Set value
    $(this.$refs.calendar).calendar("set date", this.modelValue);
  },

  beforeUnmount: function () {
    // Destroy Calendar
    $(this.$refs.calendar).off();
  },
};
</script>
