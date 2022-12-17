<template>
  <!-- <div
    class="ui"
    v-if="value!=null"
    :class="statuses[value].color"
  > {{statuses[value].name}} ({{ value }})</div>-->

  <div v-if="value != null" class="badge" :class="statuses[value + 1].color">
    {{ statuses[value + 1].name }} <span v-if="days">| {{ days }}</span>
  </div>
</template>

<script>
export default {
  name: "CMCarStatusBadge",
  props: {
    value: Number,
    days: Number,
  },
  data() {
    return {
      statuses: [
        {
          name: "Удалён",
          icon: "&#9471;",
          color: "background-color-white text-color-black",
        },
        {
          name: "Черновик",
          icon: "&#9471;",
          color: "",
        },
        {
          name: "В гараже",
          icon: "&#10102;",
          color: "background-color-red text-color-white",
        },
        {
          name: "В работе",
          icon: "&#10103;",
          color: "background-color-green text-color-white",
        },
        {
          name: "Выкуплен",
          icon: "&#10104;",
          color: "background-color-blue text-color-white",
        },
        {
          name: "Продан",
          icon: "&#10105;",
          color: "background-color-black text-color-white",
        },
        {
          name: "Обслуживание",
          icon: "&#10106;",
          color: "background-color-yellow text-color-white",
        },
        {
          name: "Аренда",
          icon: "&#10107;",
          color: "background-color-purple text-color-white",
        },
        {
          name: "-",
          icon: "&#10107;",
          color: "",
        },
        {
          name: "-",
          icon: "&#10107;",
          color: "",
        },
        {
          name: "Выдан",
          icon: "&#10107;",
          color: "background-color-violet text-color-white",
        },
      ],
    };
  },
};
</script>

<style scoped>
div.badge {
  display: inline-block;
  padding: 3px 8px;
  color: rgba(0, 0, 0, 0.6);
  background: #e8e8e8;
  border-radius: 8px;
  font-weight: normal;
  white-space: nowrap;
  font-size: 10px;
  line-height: 14px;
  text-transform: uppercase;
}
/*
.background-color-red {
  background-color: rgb(253, 232, 230) !important;
}

.background-color-green {
  background-color: rgb(222, 247, 236) !important;
}

.background-color-green2 {
  background-color: rgb(204, 243, 243) !important;
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

.text-color-red {
  color: rgb(154, 27, 28) !important;
}

.text-color-green {
  color: rgb(20, 94, 74) !important;
}

.text-color-green2 {
  color: rgb(13, 67, 77) !important;
}

.text-color-blue {
  color: rgb(40, 75, 164) !important;
}

.text-color-yellow {
  color: rgb(116, 60, 19) !important;
}

.text-color-purple {
  color: rgb(164, 52, 200) !important;
} */
</style>
