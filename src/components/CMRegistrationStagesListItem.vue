<template>
  <!-- <tr :class="[index == count - 1 ? actionStrings[actionStrings.findIndex((x) => x.id === item.status)].color : '']"> -->
  <div
    style="vertical-align: top"
    class="ui small"
    :class="[index == count - 1 ? 'bottom attached secondary segment' : 'attached segment']"
  >
    <a class="ui circular label" :class="actionStrings[actionStrings.findIndex((x) => x.id === item.status)].color">
      {{ index + 2 }}
    </a>
    <span class="text-bold" style="padding-left: 1em; font-size: 1.2rem">{{
      actionStrings[actionStrings.findIndex((x) => x.id === item.status)].text
    }}</span>
    <span class="text-color-grey nobr" style="margin-left: 0.5em; font-size: 0.875em">
      {{ $filters.date(item.dt) }}
    </span>
    <!-- <div
      :class="actionStrings[actionStrings.findIndex((x) => x.id === item.status)].color"
      style="border-radius: 4px; padding: 2px 8px; display: inline-block; margin-left: -0.6em"
    >
      {{ index + 2 }}. {{ actionStrings[actionStrings.findIndex((x) => x.id === item.status)].text }}
    </div> -->
    <div style="padding: 6px 0 2px 3.1rem">
      <span class="nobr">{{ item.username }}</span>
      <!-- <span class="text-color-grey" style="margin-left: 0.5em; font-size: 0.875em"> $filters.date(item.dt )</span> -->
      <span v-if="item.notes"
        >: <i> {{ item.notes }}</i></span
      >
    </div>
  </div>
  <!-- </tr> -->
</template>

<script>
export default {
  name: "CMRegistrationStagesListItem",
  props: {
    item: {
      type: Object,
      default: null,
    },
    index: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      actionStrings: [
        { id: 0, text: "Создание заявки", color: "" },
        { id: 1, text: "Отправлена на согласование", color: "blue" },
        { id: 2, text: "Отклонена", color: "red" },
        { id: 3, text: "Принята на исправление", color: "purple " },
        { id: 4, text: "Согласована", color: "green " },
        { id: 5, text: "Исполнена", color: "teal" },
      ],
    };
  },
};
</script>

<style scoped>
td {
  vertical-align: baseline;
}

.background-color-red {
  background-color: rgb(253, 232, 230) !important;
}

.background-color-green {
  background-color: rgb(222, 247, 236) !important;
}

.background-color-blue {
  background-color: rgb(224, 239, 255) !important;
}

.background-color-yellow {
  background-color: rgb(253, 246, 178) !important;
}

.background-color-purple {
  background-color: rgb(236, 210, 235) !important;
}

.background-color-grey {
  background-color: #e8e8e8 !important;
}

.text-color-red {
  color: rgb(154, 27, 28) !important;
}

.text-color-green {
  color: rgb(20, 94, 74) !important;
}

.text-color-blue {
  color: rgb(40, 75, 164) !important;
}

.text-color-yellow {
  color: rgb(116, 60, 19) !important;
}

.text-color-purple {
  color: rgb(164, 52, 200) !important;
}
</style>
