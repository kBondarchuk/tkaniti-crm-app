import LayoutPage from "@/components/LayoutPage.vue";
import LayoutTwoColumns from "@/components/LayoutTwoColumns.vue";
import UITextfieldHinted from "@/components/UITextfieldHinted.vue";
import UITableRow from "@/components/UITableRow.vue";
import UITableDividerRow from "@/components/UITableDividerRow.vue";
import UIStaticTable from "@/components/UIStaticTable.vue";

const register = (app) => {
  app.component("LayoutPage", LayoutPage);
  app.component("LayoutTwoColumns", LayoutTwoColumns);
  app.component("UITextfieldHinted", UITextfieldHinted);
  app.component("UITableRow", UITableRow);
  app.component("UITableDividerRow", UITableDividerRow);
  app.component("UIStaticTable", UIStaticTable);
  // app.component("UITextSearch", UITextSearch);
};

export default {
  register,
};
