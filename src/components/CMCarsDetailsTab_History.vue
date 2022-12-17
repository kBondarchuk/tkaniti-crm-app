<template>
  <div>
    <!-- Toolbar -->
    <div class="ui-tool-bar-local">
      <UISpacer />
      <UIButton color="" icon="right chevron" type="right labeled" @click="actionNewData">Внести пробег</UIButton>
    </div>
    <div class="ui divider"></div>
    <!-- /Toolbar -->
    <!-- Grid -->
    <div class="ui grid">
      <!-- fist column -->
      <div class="eight wide column">
        <CMCarHistoryList v-if="car.id" :car_id="car.id" />
      </div>
      <div class="eight wide column">
        <CMCarDataHistoryList v-if="car.id" :key="keys.dataHistory" :car_id="car.id" @edit="actionEditData" />
      </div>
    </div>

    <!-- New Data Modal -->
    <ModalCarHistoryDataEdit
      :car-id="car.id"
      :active="modals.editData"
      :selected-item="selectedItem"
      @hide="modals.editData = false"
      @saved="dataSaved"
    ></ModalCarHistoryDataEdit>
    <!------->
  </div>
</template>

<script>
import CMCarHistoryList from "@/components/CMCarHistoryList.vue";
import CMCarDataHistoryList from "@/components/CMCarDataHistoryList.vue";
import ModalCarHistoryDataEdit from "@/components/ModalCarHistoryDataEdit.vue";

export default {
  name: "CMCarsDetailsTabHistory",

  components: {
    CMCarHistoryList,
    CMCarDataHistoryList,
    ModalCarHistoryDataEdit,
  },

  props: {
    car: {
      type: Object,
    },
  },

  data() {
    return {
      selectedItem: null,
      modals: { editData: false },
      keys: { dataHistory: 0 },
    };
  },

  methods: {
    actionNewData() {
      this.selectedItem = null;
      this.modals.editData = true;
    },
    actionEditData(item) {
      this.selectedItem = item;
      this.modals.editData = true;
    },
    dataSaved() {
      console.log("saved");
      this.keys.dataHistory++;
    },
  },
};
</script>
