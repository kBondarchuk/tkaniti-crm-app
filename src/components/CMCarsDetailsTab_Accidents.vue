<template>
  <div>
    <!-- Toolbar -->
    <!-- Toolbar -->
    <UIButton
      color="blue"
      icon="plus"
      type="right labeled"
      :class="{ disabled: car.ref_car_status != 1 && car.ref_car_status != 2 && car.ref_car_status < 5 }"
      @click="actionDtpCreate"
      >Внести ДТП</UIButton
    >
    <div class="ui divider"></div>
    <!-- /Toolbar -->
    <!-- Grid -->
    <div class="ui grid">
      <!-- Fist Column -->
      <div class="sixteen wide column">
        <!-- List -->
        <CMDTPList :key="key" :car_id="car.id" @event-details="dtpClick" />
      </div>
    </div>

    <!-- New DTP Modal -->
    <FormCarDtpEdit
      :active="modal"
      :car-id="car.id"
      :selected-item="selectedDtp"
      @hide="modal = false"
      @did-change="dtpCreated"
    ></FormCarDtpEdit>
    <!------->
  </div>
</template>

<script>
import UIButton from "@/components/UIButton.vue";
import CMDTPList from "@/components/CMDTPList.vue";
import FormCarDtpEdit from "@/components/FormCarDtpEdit.vue";

export default {
  name: "CMCarsDetailsTabAccidents",

  components: {
    UIButton,
    CMDTPList,
    FormCarDtpEdit,
  },

  props: {
    car: {
      type: Object,
    },
  },

  data() {
    return {
      selectedDtp: null,
      modal: false,
      key: 0,
    };
  },

  methods: {
    actionDtpCreate() {
      this.selectedDtp = null;
      this.modal = true;
    },
    dtpCreated() {
      console.log("Dtp changed!");
      this.key++;
    },
    dtpClick(item) {
      // console.log("Lick " + item);
      this.selectedDtp = item;
      this.modal = true;
    },
  },
};
</script>
