<template>
  <CMDocuments
    :folder-uuid="car.folder_uuid"
    category="car"
    :disabled="[-1].includes(car.ref_car_status) || !checkAuthRole('docs.upload')"
    :delete-disabled="
      (![0, 1, 2, 5, 6].includes(car.ref_car_status) && !checkAuthRole('corp_director')) ||
      !checkAuthRole('docs.upload')
    "
    :ignore-types="car?.doc_types_ignore?.split(',').filter(Boolean).map(Number)"
  />
</template>

<script>
import CMDocuments from "@/components/CMDocuments.vue";

export default {
  name: "CMCarsDetailsTabDocuments",

  components: {
    CMDocuments,
  },

  props: {
    car: {
      type: Object,
      default: null,
    },
  },

  methods: {
    checkAuthRole(role) {
      return this.$store.getters["auth/getAuthRights"].includes(role);
    },
  },

  // mounted() {
  //   // console.log("->>>> ", ![0, 1, 2, 5, 6].includes(this.car.ref_car_status) && !this.checkAuthRole("corp_director"));
  // },
};
</script>
