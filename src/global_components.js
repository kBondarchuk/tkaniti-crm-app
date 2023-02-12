import LayoutPage from "@/components/LayoutPage.vue";
import LayoutTwoColumns from "@/components/LayoutTwoColumns.vue";
import UITextfieldHinted from "@/components/UITextfieldHinted.vue";
import UITableRow from "@/components/UITableRow.vue";
import UITableDividerRow from "@/components/UITableDividerRow.vue";
import UIStaticTable from "@/components/UIStaticTable.vue";
import UIList from "@/components/UIList.vue";
import UIListItem from "@/components/UIListItem.vue";
import UIListSection from "@/components/UIListSection.vue";
import UITextLoader from "@/components/UITextLoader.vue";
import UIDetailsTabs from "@/components/UIDetailsTabs.vue";

const register = (app) => {
  app.component("LayoutPage", LayoutPage);
  app.component("LayoutTwoColumns", LayoutTwoColumns);
  app.component("UITextfieldHinted", UITextfieldHinted);
  app.component("UITableRow", UITableRow);
  app.component("UITableDividerRow", UITableDividerRow);
  app.component("UIStaticTable", UIStaticTable);
  app.component("UIList", UIList);
  app.component("UIListItem", UIListItem);
  app.component("UIListSection", UIListSection);
  app.component("UITextLoader", UITextLoader);
  app.component("UIDetailsTabs", UIDetailsTabs);
};

export default {
  register,
};
