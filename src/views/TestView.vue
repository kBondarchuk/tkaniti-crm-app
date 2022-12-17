<template>
  <LayoutPage>
    <div class="ui form" style="width: 20em">
      <h2>Компоненты</h2>
      <UIInputMoney v-model.trim.lazy="money" name="money_field">Сумма</UIInputMoney>
      <h2>{{ money }}</h2>
      <UIInputDate v-model.trim.lazy="date">Дата</UIInputDate>
      <h2>{{ date }}</h2>
      <UIInputDate2 v-model.trim.lazy="date">Дата</UIInputDate2>
      <h2>{{ date }}</h2>
    </div>
  </LayoutPage>
</template>

<script>
import LayoutPage from "@/components/LayoutPage.vue";
import UIInputMoney from "@/components/UIInputMoney.vue";
import UIInputDate from "@/components/UIInputDate.vue";
import UIInputDate2 from "@/components/UIInputDate2.vue";

export default {
  name: "TestView",
  components: { LayoutPage, UIInputMoney, UIInputDate, UIInputDate2 },
  data() {
    return {
      money: 5.5,
      date: "2019-09-01",
    };
  },
};
</script>
