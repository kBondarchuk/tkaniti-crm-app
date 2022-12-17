<template>
  <div>
    <!-- Toolbar -->
    <!-- Toolbar -->
    <!-- <UIButton
      color="blue"
      icon="plus"
      type="right labeled"
      text="Внести штраф"
      @click="actionCreate"
      :class="{
        disabled: car.ref_car_status != 1 && car.ref_car_status != 2 && car.ref_car_status < 5,
        disabled: true,
      }"
    /> -->
    <!-- <div class="ui divider"></div> -->
    <!-- /Toolbar -->
    <!-- Grid -->
    <div class="ui grid">
      <!-- Fist Column -->
      <div class="sixteen wide column">
        <!-- List -->
        <CMCarFinesList v-if="car.id" :key="key" :car-id="car.id" hide-car-column @event-details="handleDetails" />
      </div>
    </div>

    <!-- New DTP Modal -->
    <!-- <ModalCarFineEdit
      :active="modal"
      :car-id="car.id"
      :selected-item="selectedItem"
      @hide="modal = false"
      @did-change="created"
    /> -->
    <!------->
  </div>
</template>

<script>
import CMCarFinesList from "@/components/CMCarFinesList.vue";
// import ModalCarFineEdit from "@/components/ModalCarFineEdit.vue";

export default {
  name: "CMCarsDetailsTabCarFines",

  components: {
    // ModalCarFineEdit,
    CMCarFinesList,
  },

  props: {
    car: {
      type: Object,
    },
  },

  data() {
    return {
      selectedItem: null,
      modal: false,
      key: 0,
    };
  },

  methods: {
    actionCreate() {
      this.selectedItem = null;
      this.modal = true;
    },
    created() {
      console.log("Dtp changed!");
      this.key++;
    },
    click(item) {
      // console.log("Lick " + item);
      this.selectedItem = item;
      this.modal = true;
    },
    handleDetails(item) {
      // console.log("row clicked: " + item.id);
      this.$router.push({ name: "car_fines_details", params: { id: item.id } });
    },
  },
};
</script>
