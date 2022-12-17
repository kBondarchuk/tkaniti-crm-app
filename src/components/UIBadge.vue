<template>
  <div class="badge">
    {{ text }}
  </div>
</template>

<script>
export default {
  name: "UIBadge",
  props: {
    text: [String, Number],
  },
  data() {
    return {
      // statuses: [
      //   {
      //     name: "Черновик",
      //     icon: "&#9471;",
      //     color: "",
      //   },
      //   {
      //     name: "Согласование",
      //     icon: "&#10102;",
      //     color: "background-color-blue text-color-white",
      //   },
      //   {
      //     name: "Отклонена",
      //     icon: "&#10103;",
      //     color: "background-color-red text-color-white",
      //   },
      //   {
      //     name: "Исправление",
      //     icon: "&#10104;",
      //     color: "background-color-purple text-color-white",
      //   },
      //   {
      //     name: "Согласована",
      //     icon: "&#10105;",
      //     color: "background-color-green text-color-white",
      //   },
      //   {
      //     name: "Исполнена",
      //     icon: "&#10106;",
      //     color: "background-color-teal text-color-white",
      //   },
      //   {
      //     name: "-",
      //     icon: "&#10107;",
      //     color: "",
      //   },
      // ],
    };
  },
};
</script>

<style scoped>
div.badge {
  display: inline-block;
  font-size: 10px;
  padding: 3px 8px;
  color: rgba(0, 0, 0, 0.6);
  background: #e8e8e8;
  border-radius: 8px;
  font-weight: normal;
  white-space: nowrap;
  text-align: center;
  line-height: 14px;
  text-transform: uppercase;
  /* opacity: 0.3; */
}
</style>
