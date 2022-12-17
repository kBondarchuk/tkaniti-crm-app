<template>
  <div>
    <!-- Tabs -->
    <div class="ui top tabular menu">
      <div class="item" :class="{ active: tabsComponent == 1 }" @click="tabSelect(1)">ДОГОВОР ВЫКУПА</div>
      <div class="item" :class="{ active: tabsComponent == 2 }" @click="tabSelect(2)">ДОГОВОР АРЕНДЫ</div>
    </div>
    <!-- Pages -->
    <div class="ui tab" :class="{ active: tabsComponent == 1 }">
      <div class="ui stackable grid">
        <div class="eight wide column">
          <!-- column 1  -->
          <!--  -->
          <CMPrefsTemplateItemForm :template-name="Templates.Contract" header="Шаблон договора" />
          <!--  -->
          <CMPrefsTemplateItemForm :template-name="Templates.Handover" header="Шаблон Акт передачи" />
          <!--  -->
          <CMPrefsTemplateItemForm :template-name="Templates.Acceptance" header="Шаблон Акт приёма" />
          <!--  -->
          <CMPrefsTemplateItemForm :template-name="Templates.Agreement" header="Шаблон соглашения" />
          <!--  -->
          <CMPrefsTemplateItemForm :template-name="Templates.Schedule" header="Шаблон графика платежей" />
          <!--  -->
          <CMPrefsTemplateItemForm :template-name="Templates.Resume" header="Шаблон сводного отчёта по расчётам" />
          <!--  -->
        </div>
        <div class="eight wide column">
          <!-- column 2 -->
          <table class="ui compact small basic table segment">
            <thead>
              <tr>
                <th>Переменная</th>
                <th>Значение</th>
              </tr>
            </thead>
            <tbody>
              <!-- Customer -->
              <tr>
                <td colspan="2" class="gray_bg">
                  <h4>Клиент</h4>
                </td>
              </tr>
              <tr>
                <td>${fio}</td>
                <td>ФИО</td>
              </tr>
              <tr>
                <td>${passport}</td>
                <td>Паспортные данные</td>
              </tr>
              <tr>
                <td>${address}</td>
                <td>Фактический адрес</td>
              </tr>
              <tr>
                <td>${phone_number}</td>
                <td>Номер телефона</td>
              </tr>
              <tr>
                <td>${date_of_birth}</td>
                <td>Дата рождения</td>
              </tr>
              <!-- Contract -->
              <tr>
                <td colspan="2" class="gray_bg">
                  <h4>Договор</h4>
                </td>
              </tr>
              <tr>
                <td>${contract_no}</td>
                <td>Номер договора</td>
              </tr>
              <tr>
                <td>${contract_date}</td>
                <td>Дата договора</td>
              </tr>
              <tr>
                <td>${start_date}</td>
                <td>Дата первого платежа по договору</td>
              </tr>
              <tr>
                <td>${final_date}</td>
                <td>Рассчетная дата последнего платежа по договору</td>
              </tr>
              <tr>
                <td>${contract_days}</td>
                <td>Срок выкупа по договору в днях</td>
              </tr>
              <tr>
                <td>${pay_amount}</td>
                <td>Дневной платеж (цифры и прописью)</td>
              </tr>
              <tr>
                <td>${car_purchase_price}</td>
                <td>Закупочная стоимость автомобиля для клиента</td>
              </tr>
              <tr>
                <td>${buyout_price}</td>
                <td>Полная выкупная стоимость автомобиля</td>
              </tr>
              <tr>
                <td>${down_payment}</td>
                <td>Сумма первоначального взноса</td>
              </tr>
              <tr>
                <td>${net_price}</td>
                <td>Выкупная стоимость за минусом первоначального взноса</td>
              </tr>
              <!-- Car -->
              <tr>
                <td colspan="2" class="gray_bg">
                  <h4>Автомобиль</h4>
                </td>
              </tr>
              <tr>
                <td>${car_name}</td>
                <td>Название автомобиля (TOYOTA CAMRY)</td>
              </tr>
              <tr>
                <td>${car_brand}</td>
                <td>Марка автомобиля (TOYOTA)</td>
              </tr>
              <tr>
                <td>${car_model}</td>
                <td>Модель автомобиля (CAMRY)</td>
              </tr>
              <tr>
                <td>${car_vin}</td>
                <td>Номер кузова</td>
              </tr>
              <tr>
                <td>${car_year}</td>
                <td>Год выпуска</td>
              </tr>
              <tr>
                <td>${car_color}</td>
                <td>Цвет</td>
              </tr>
              <tr>
                <td>${car_engine_no}</td>
                <td>Номер двигателя</td>
              </tr>
              <tr>
                <td>${car_pts_no}</td>
                <td>Номер ПТС</td>
              </tr>
              <tr>
                <td>${car_reg_no}</td>
                <td>Гос. номер</td>
              </tr>
              <tr>
                <td>${car_svid_no}</td>
                <td>Номер свидетельства</td>
              </tr>
              <!-- <tr>
                    <td>${}</td>
                    <td></td>
          </tr>-->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="ui tab" :class="{ active: tabsComponent == 2 }">
      <div class="ui stackable grid">
        <div class="eight wide column">
          <!-- column 1  -->
          <!--  -->
          <CMPrefsTemplateItemForm :template-name="Templates.Rent.Contract" header="Шаблон договора" />
          <!--  -->
          <CMPrefsTemplateItemForm :template-name="Templates.Rent.Handover" header="Шаблон Акт передачи" />
          <!--  -->
          <CMPrefsTemplateItemForm :template-name="Templates.Rent.Acceptance" header="Шаблон Акт приёма" />
          <!--  -->
        </div>
        <div class="eight wide column">
          <!-- column 2 -->
          <table class="ui compact small basic table segment">
            <thead>
              <tr>
                <th>Переменная</th>
                <th>Значение</th>
              </tr>
            </thead>
            <tbody>
              <!-- Customer -->
              <tr>
                <td colspan="2" class="gray_bg">
                  <h4>Клиент</h4>
                </td>
              </tr>
              <tr>
                <td>${fio}</td>
                <td>ФИО</td>
              </tr>
              <tr>
                <td>${passport}</td>
                <td>Паспортные данные</td>
              </tr>
              <tr>
                <td>${address}</td>
                <td>Фактический адрес</td>
              </tr>
              <tr>
                <td>${phone_number}</td>
                <td>Номер телефона</td>
              </tr>
              <tr>
                <td>${date_of_birth}</td>
                <td>Дата рождения</td>
              </tr>
              <!-- Contract -->
              <tr>
                <td colspan="2" class="gray_bg">
                  <h4>Договор</h4>
                </td>
              </tr>
              <tr>
                <td>${contract_no}</td>
                <td>Номер договора</td>
              </tr>
              <tr>
                <td>${contract_date}</td>
                <td>Дата договора</td>
              </tr>
              <tr>
                <td>${start_date}</td>
                <td>Дата первого платежа по договору</td>
              </tr>
              <tr>
                <td>${final_date}</td>
                <td>Рассчетная дата последнего платежа по договору</td>
              </tr>
              <tr>
                <td>${contract_days}</td>
                <td>Срок выкупа по договору в днях</td>
              </tr>
              <tr>
                <td>${pay_amount}</td>
                <td>Дневной платеж (цифры и прописью)</td>
              </tr>
              <tr>
                <td>${car_purchase_price}</td>
                <td>Закупочная стоимость автомобиля для клиента</td>
              </tr>
              <tr>
                <td>${buyout_price}</td>
                <td>Полная выкупная стоимость автомобиля</td>
              </tr>
              <tr>
                <td>${down_payment}</td>
                <td>Сумма первоначального взноса</td>
              </tr>
              <tr>
                <td>${net_price}</td>
                <td>Выкупная стоимость за минусом первоначального взноса</td>
              </tr>
              <!-- Car -->
              <tr>
                <td colspan="2" class="gray_bg">
                  <h4>Автомобиль</h4>
                </td>
              </tr>
              <tr>
                <td>${car_name}</td>
                <td>Название автомобиля (TOYOTA CAMRY)</td>
              </tr>
              <tr>
                <td>${car_brand}</td>
                <td>Марка автомобиля (TOYOTA)</td>
              </tr>
              <tr>
                <td>${car_model}</td>
                <td>Модель автомобиля (CAMRY)</td>
              </tr>
              <tr>
                <td>${car_vin}</td>
                <td>Номер кузова</td>
              </tr>
              <tr>
                <td>${car_year}</td>
                <td>Год выпуска</td>
              </tr>
              <tr>
                <td>${car_color}</td>
                <td>Цвет</td>
              </tr>
              <tr>
                <td>${car_engine_no}</td>
                <td>Номер двигателя</td>
              </tr>
              <tr>
                <td>${car_pts_no}</td>
                <td>Номер ПТС</td>
              </tr>
              <tr>
                <td>${car_reg_no}</td>
                <td>Гос. номер</td>
              </tr>
              <tr>
                <td>${car_svid_no}</td>
                <td>Номер свидетельства</td>
              </tr>
              <!-- <tr>
                    <td>${}</td>
                    <td></td>
          </tr>-->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CMPrefsTemplateItemForm from "@/components/CMPrefsTemplateItemForm.vue";

const Templates = {
  Contract: "contract",
  Agreement: "agreement",
  Schedule: "schedule",
  Resume: "resume",
  Handover: "handover",
  Acceptance: "acceptance",
  Rent: {
    Contract: "rent_contract",
    Handover: "rent_handover",
    Acceptance: "rent_acceptance",
  },
};

export default {
  name: "CMPrefsTemplates",

  components: { CMPrefsTemplateItemForm },

  data() {
    return {
      Templates,
      tabsComponent: 1,
    };
  },

  methods: {
    // Tabs
    tabSelect(id) {
      // console.log("tab: " + id);
      this.tabsComponent = id;
    },
  },
};
</script>
