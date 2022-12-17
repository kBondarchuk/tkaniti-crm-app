<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <template #toolbar>
      <UISpacer />
      <UIButton text="Новый инвестор" icon="plus" type="right labeled" @click="modalCreate" />
    </template>
    <!-- /Toolbar -->
    <!-- List -->
    <CMInvestorsList :key="key" :header-sticked-at="42" @event-details="handleDetails" />

    <!-- New Investor Modal -->
    <ModalEditInvestor
      v-model="modals.newInvestor"
      :investor_id="modals.investor_id"
      @created="refetch"
      @saved="refetch"
    />
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import CMInvestorsList from "@/components/CMInvestorsList.vue";
import ModalEditInvestor from "@/components/ModalEditInvestor.vue";

export default {
  name: "InvestorsView",

  components: {
    CMInvestorsList,
    ModalEditInvestor,
  },

  mixins: [viewMixin],

  data() {
    return {
      // View
      view: {
        title: "Инвесторы",
        subTitle: "Список инвесторов",
      },
      // Modals
      modals: {
        newInvestor: false,
        investor_id: null,
      },
      // keys
      key: 0,
    };
  },

  methods: {
    modalCreate() {
      // console.log(this.$router);
      // this.$store.commit("investors/setSelectedItem", 0);
      // this.$router.push({ name: "investors_create" });
      this.modals.investor_id = null;
      this.modals["newInvestor"] = true;
    },
    // modalEdit(id) {
    //   window.console.log("modalEdit");
    //   this.modals.investor_id = id;
    //   this.modals["newInvestor"] = true;
    // },
    handleDetails(item) {
      // eslint-disable-next-line no-console
      console.log("row clicked id: " + item.id);
      // this.$store.commit("investors/setSelectedItem", id);
      this.$router.push({
        name: "investors_details",
        params: { id: item.id },
      });
      // this.modalEdit(id);
    },
    // handleEdit(id) {
    //   // eslint-disable-next-line no-console
    //   console.log("edit clicked: " + id);
    //   // this.$store.commit("investors/setSelectedItem", id);
    //   // this.$router.push({ name: "investors_details", params: { id: id } });
    //   this.modalEdit(id);
    // },
    refetch() {
      this.key++;
    },
  },
};
</script>
