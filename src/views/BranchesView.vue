<template>
  <LayoutPage no-paddings>
    <!-- Toolbar -->
    <!-- <template v-slot:toolbar>
      <UISpacer />
      <UIButton icon="plus" type="right labeled" @click="modalCreate">Новый инвестор</UIButton>
    </template> -->
    <!-- /Toolbar -->
    <!-- List -->
    <CMBranchesList :key="key" :header-sticked-at="42" @event-details="handleDetails" />

    <!-- New Investor Modal -->
    <!-- <FormInvestor
      :investor_id="modals.investor_id"
      :active="modals.newInvestor"
      @hide="modals.newInvestor = false"
      @created="refetch"
      @saved="refetch"
    ></FormInvestor> -->
    <!------->
  </LayoutPage>
</template>

<script>
import { viewMixin } from "@/mixins/ViewMixin.js";

import CMBranchesList from "@/components/CMBranchesList.vue";
// import FormInvestor from "@/components/FormInvestor.vue";

export default {
  name: "BranchesView",

  components: {
    CMBranchesList,
    // FormInvestor,
  },

  mixins: [viewMixin],

  data() {
    return {
      // View
      view: {
        title: "Филиалы",
        subTitle: "Список филиалов",
      },
      // Modals
      // modals: {
      //   newInvestor: false,
      //   investor_id: null,
      // },
      // keys
      key: 0,
    };
  },

  methods: {
    // modalCreate() {
    //   // console.log(this.$router);
    //   // this.$store.commit("investors/setSelectedItem", 0);
    //   // this.$router.push({ name: "investors_create" });
    //   this.modals.investor_id = null;
    //   this.modals["newInvestor"] = true;
    // },
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
        name: "branches_details",
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
