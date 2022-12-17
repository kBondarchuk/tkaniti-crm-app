import UIButton from "@/components/UIButton.vue";
import UISpacer from "@/components/UISpacer.vue";
import UITextfield from "@/components/UITextfield.vue";
import UIInputMoney from "@/components/UIInputMoney.vue";
import UIInputDate from "@/components/UIInputDate.vue";
import UIInputNumber from "@/components/UIInputNumber.vue";
import LayoutPage from "@/components/LayoutPage.vue";
import LayoutSideMenu from "@/components/LayoutSideMenu.vue";
import LayoutTwoColumns from "@/components/LayoutTwoColumns.vue";
import UIMoney from "@/components/UIMoney.vue";
import UIMoneyCell from "@/components/UIMoneyCell.vue";
import UIInputDropdown from "@/components/UIInputDropdown.vue";
import UIInputPhone from "@/components/UIInputPhone.vue";
import UIModal from "@/components/UIModal.vue";
import UITextAria from "@/components/UITextAria.vue";
import UIInputDateBirth from "@/components/UIInputDateBirth.vue";
import UIInputSearchDropdown from "@/components/UIInputSearchDropdown.vue";
import UITextfieldHinted from "@/components/UITextfieldHinted.vue";
import UIInputSelect from "@/components/UIInputSelect.vue";
import UIInputFormated from "@/components/UIInputFormated.vue";
import UICheckbox from "@/components/UICheckbox.vue";
import UITableRow from "@/components/UITableRow.vue";
import UITableDividerRow from "@/components/UITableDividerRow.vue";
import UIStaticTable from "@/components/UIStaticTable.vue";
import UITextSearch from "@/components/UITextSearch.vue";

const register = (app) => {
  app.component("UIButton", UIButton);
  app.component("UISpacer", UISpacer);
  app.component("UITextfield", UITextfield);
  app.component("UIInputMoney", UIInputMoney);
  app.component("UIInputDate", UIInputDate);
  app.component("UIInputNumber", UIInputNumber);
  app.component("LayoutPage", LayoutPage);
  app.component("LayoutSideMenu", LayoutSideMenu);
  app.component("LayoutTwoColumns", LayoutTwoColumns);
  app.component("UIMoney", UIMoney);
  app.component("UIMoneyCell", UIMoneyCell);
  app.component("UIInputDropdown", UIInputDropdown);
  app.component("UIInputPhone", UIInputPhone);
  app.component("UIModal", UIModal);
  app.component("UITextAria", UITextAria);
  app.component("UIInputDateBirth", UIInputDateBirth);
  app.component("UIInputSearchDropdown", UIInputSearchDropdown);
  app.component("UITextfieldHinted", UITextfieldHinted);
  app.component("UIInputSelect", UIInputSelect);
  app.component("UIInputFormated", UIInputFormated);
  app.component("UICheckbox", UICheckbox);
  app.component("UITableRow", UITableRow);
  app.component("UITableDividerRow", UITableDividerRow);
  app.component("UIStaticTable", UIStaticTable);
  app.component("UITextSearch", UITextSearch);
};

export default {
  register,
};
