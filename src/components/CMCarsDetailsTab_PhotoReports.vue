<template>
  <CMPhotoReports
    :car-id="car.id"
    style="margin-top: -1em; margin-left: -1.5em; margin-right: -1.5em; margin-bottom: -1.5em"
  />
</template>

<script>
import CMPhotoReports from "@/components/CMPhotoReports.vue";

export default {
  name: "CMCarsDetailsTabPhotoReports",

  components: {
    CMPhotoReports,
  },

  props: {
    car: {
      type: Object,
    },
  },
};
</script>
