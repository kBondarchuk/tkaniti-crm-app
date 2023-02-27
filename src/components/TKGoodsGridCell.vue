<template>
  <div @click="$emit('eventDetails', item.id)">
    <!--  -->
    <img src="https://api.tkaniti.ru/store/image/car_63f6408becf6a1.80738874.jpg" alt="" width="100" height="80" />
    <!-- <div> -->
    <!--  -->
    <!-- <div>
            <TKGoodStatus :value="item.status_id" />
          </div> -->
    <!--  -->
    <!-- {{ item.name }}<br />
          {{ item.brand }}
          <div>
            {{ item.id }}
          </div>
        </div> -->

    <!--  -->
  </div>
</template>

<script>
import TKGoodStatus from "@/components/TKGoodStatus.vue";

export default {
  name: "TKGoodsGridCell",

  components: {
    TKGoodStatus,
  },

  props: {
    item: {
      type: Object,
      default: null,
    },
  },

  emits: ["eventDetails"],
};
</script>
