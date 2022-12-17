<template>
  <!-- <fragment> -->
  <WPanelContainer vertical>
    <WPanel size="28em" style="border-right: 1px solid rgba(34, 36, 38, 0.15)">
      <div class="content">
        <!-- NO CONTENT -->
        <UIPanelSplash v-if="messageId === null"> Сообщение не выбрано </UIPanelSplash>
        <!-- Form -->
        <form v-if="messageId !== null" class="ui form" :class="{ loading: isLoading }">
          <div v-if="!message.id">
            <UITextfield v-model.trim.lazy="message.content_title" :disabled="isLoading">Заголовок</UITextfield>
            <UITextfield v-model.trim.lazy="message.content_subtitle" :disabled="isLoading">Подзаголовок</UITextfield>
            <UITextAria v-model.trim.lazy="message.content_body" rows="12" placeholder="Текст"
              >Текст сообщения</UITextAria
            >
            <!--  -->
            <div class="ui hidden divider"></div>
            <!--  -->
            <div class="field" :class="{ disabled: message.id > 0 }">
              <div class="ui checkbox">
                <input v-model="message.need_notification" type="checkbox" name="checkbox" />
                <label @click.prevent="message.need_notification = !message.need_notification">
                  Отправлять уведомления</label
                >
              </div>
            </div>
            <!--  -->
            <UIInputDate
              v-model="message.time_to_send"
              type="datetime"
              placeholder="Сразу"
              :class="{ disabled: !message.need_notification }"
              >Время отправки уведомлений</UIInputDate
            >
            <!-- <UITextfield v-model.trim.lazy="message.destination_string" :disabled="isLoading">Получатели</UITextfield> -->
            <UIInputDropdown v-model.number="destination_type" :options="options">Выбор получателей</UIInputDropdown>
            <!-- Select Customer -->
            <UIInputSelect
              v-if="destination_type === null && !message.id"
              placeholder="Клиент не выбран"
              :value="selectedCustomer"
              @button-did-click="browseCustomers"
            ></UIInputSelect>
            <!--  -->
            <!-- Select Promo Action -->
            <UIInputDropdown
              v-if="
                destination_type &&
                destination_list[destination_type].value == 'nf_receivers_promo_action' &&
                !message.id
              "
              v-model.number="selectedPromoAction"
              :options="promoActions"
              value-selector="id"
            ></UIInputDropdown>
            <!-- Select by Branch -->
            <UIInputDropdown
              v-if="
                destination_type && destination_list[destination_type].value == 'nf_receivers_by_branch' && !message.id
              "
              v-model.number="selectedBranch"
              :options="branches"
              value-selector="id"
            ></UIInputDropdown>
            <!-- v-if="destination_type === null && !this.message.id" -->
            <!--  -->
            <span v-if="!message.date_created" class="text-color-grey">
              Выбрано: {{ message.receivers.length }} получателей</span
            >
            <!-- /Select Customer -->
          </div>

          <!--  -->
          <div v-if="message.id">
            <h3>{{ message.content_title }}</h3>
            <h4 v-if="message.content_subtitle" style="margin-top: 0">{{ message.content_subtitle }}</h4>
            <p v-if="message.content_body" v-html="message.content_body.replace(/\r\n|\r|\n/g, '<br/>')"></p>
            <div class="ui divider"></div>
            <!--  -->
            <span v-if="message.date_created" class="text-color-grey">
              Дата создания: {{ $filters.date(message.date_created) }}</span
            ><br />
            <span v-if="message.date_created" class="text-color-grey"> Создал: {{ message.sender_username }}</span
            ><br />
            <span class="text-color-grey"> Отправка push-уведомлений: </span>
            <span v-if="message.need_notification == 1" class="text-color-grey">Да</span>
            <span v-if="message.need_notification == 0" class="text-color-grey">Нет</span>
            <!--  -->
            <br />
            <span class="text-color-grey"> Время отправки уведомлений: </span>
            <span v-if="!message.notification_time" class="text-color-grey">Сразу</span>
            <span v-if="message.notification_time" class="text-color-grey">
              {{ $filters.date(message.notification_time) }}
            </span>

            <!--  -->
          </div>
          <!--  -->

          <!--  -->
          <div class="ui hidden divider"></div>
          <!-- Buttons -->
          <div class="two fields">
            <div class="field">
              <UIButton class="" :class="{ disabled: !canSave }" type="primary" @click.prevent="saveMessage"
                >Сохранить</UIButton
              >
            </div>

            <div class="field" style="text-align: right">
              <!-- Delete -->
              <UIButton
                class="red"
                :class="{ disabled: messageId < 1 || message.status > 0 }"
                style="margin: 0"
                @click.prevent="deleteMessage(messageId)"
                >Удалить</UIButton
              >
            </div>
          </div>
        </form>
      </div>
    </WPanel>

    <!-- Tabs -->
    <WPanelContainer horizontal>
      <!-- Получатели -->
      <CMNotificationReceivers :receivers="message.receivers" />
      <!-- New Customers Browser -->
      <BrowseCustomers
        component="CMCustomersList"
        :active="modals.browseCustomers"
        :selected-customers="selector_customer"
        multiple-selection
        @hide="modals.browseCustomers = false"
        @selected:multiple="customerMultipleSelected"
      ></BrowseCustomers>
      <!-- @selected="customerSelected" -->
      <!------->
      <!-- Сообщение -->
      <!-- <CMPromoActionMessage :action-id="messageId" :action="action" v-if="menuId == 4" /> -->
      <!--  -->
    </WPanelContainer>
  </WPanelContainer>
</template>

<script>
import apiService from "@/services/api.service.js";

import WPanelContainer from "@/components/WPanelContainer.vue";
import WPanel from "@/components/WPanel.vue";
import UIPanelSplash from "@/components/UIPanelSplash.vue";
import UITextfield from "@/components/UITextfield.vue";
import UIButton from "@/components/UIButton.vue";
import UITextAria from "@/components/UITextAria.vue";
import UIInputDropdown from "@/components/UIInputDropdown.vue";
import UIInputSelect from "@/components/UIInputSelect.vue";
import UIInputDate from "@/components/UIInputDate.vue";
import BrowseCustomers from "@/components/BrowseCustomers.vue";
import CMNotificationReceivers from "@/components/CMNotificationReceivers.vue";

export default {
  name: "CMNotificationsDetails",
  components: {
    WPanelContainer,
    WPanel,
    UIPanelSplash,
    UITextfield,
    UIButton,
    UITextAria,
    CMNotificationReceivers,
    UIInputDropdown,
    UIInputSelect,
    UIInputDate,
    BrowseCustomers,
  },
  props: {
    messageId: {
      type: Number,
      default: null,
    },
  },
  emits: ["createdMessage"],
  data() {
    return {
      message: { receivers: [], need_notification: false, time_to_send: null },
      isLoading: false,
      menuId: 1,
      destination_type: null,
      destination_list: [
        { name: "Все клиенты", value: "nf_receivers_all", param: 0 },
        { name: "Клиенты с договорами в статусе Активен", value: "nf_receivers_active_contracts", param: 0 },
        { name: "Клиенты с отрицательным балансом", value: "nf_receivers_negative_balance", param: 0 },
        { name: "Клиенты без фото-отчёта", value: "nf_receivers_no_photo_report", param: 0 },
        { name: "Клиенты участвующие в акции", value: "nf_receivers_promo_action", param: 0 },
        { name: "Клиенты по филиалу", value: "nf_receivers_by_branch", param: null },
        { name: "Клиенты с push-уведомлениями", value: "nf_receivers_android", param: 0 },
      ],
      promoActions: [],
      branches: [],
      selectedPromoAction: null,
      selectedBranch: null,
      // Modals
      modals: {
        browseCustomers: false,
      },
      selector_customer: [],
    };
  },

  computed: {
    canSave() {
      return this.message != null && !this.message.id && this.message.receivers.length > 0;
    },
    options() {
      let menu = [{ name: "Выбрать вручную", value: null }].concat(
        this.destination_list.map((item, index) => {
          return { name: item.name, value: index };
        })
      );
      return menu;
    },
    selectedCustomer() {
      if (this.selector_customer.length < 1) {
        return "";
      } else return "" + this.selector_customer.length + " клиентов";
      // this.selector_customer.last_name +
      // " " +
      // this.selector_customer.first_name +
      // " " +
      // this.selector_customer.second_name
    },
  },

  watch: {
    messageId: {
      immediate: true,
      handler(newValue) {
        // console.log("sd: ", newValue);

        //newValue, oldValue
        if (newValue > 0) {
          this.fetchMessage(newValue);
          // this.fetchMessageResults(newValue);
        } else {
          // New action
          this.reset();
        }
        // this.$emit("eventDetails", {});
      },
    },
    destination_type: {
      immediate: true,
      handler(newValue) {
        // console.log(newValue);
        this.selector_customer = [];
        this.message.receivers = [];
        if (newValue === null) return;
        if (this.destination_list[newValue].param === null) return;
        this.fetchReceivers(this.destination_list[newValue].value, this.destination_list[newValue].param);
      },
    },
    selectedPromoAction: {
      immediate: true,
      handler(newValue) {
        // console.log("a: ", newValue);
        if (newValue === null) return;
        this.destination_list[this.destination_type].param = newValue;
        this.fetchReceivers(
          this.destination_list[this.destination_type].value,
          this.destination_list[this.destination_type].param
        );
      },
    },
    selectedBranch: {
      immediate: true,
      handler(newValue) {
        console.log("b: ", newValue);
        if (newValue === null) return;
        this.destination_list[this.destination_type].param = newValue;
        this.fetchReceivers(
          this.destination_list[this.destination_type].value,
          this.destination_list[this.destination_type].param
        );
      },
    },
  },

  methods: {
    reset() {
      this.message = { receivers: [], need_notification: false, time_to_send: null };
      this.fetchPromoActions();
      this.fetchBranches();
    },
    browseCustomers() {
      this.modals.browseCustomers = true;
    },
    customerMultipleSelected(items) {
      this.selector_customer = items;
      const newReceivers = items.map((item) => {
        return {
          receiver_id: item.id,
          fio: item.last_name + " " + item.first_name + " " + item.second_name,
        };
      });
      // this.message.receivers = this.message.receivers.concat(newReceivers);
      this.message.receivers = newReceivers;
      this.modals.browseCustomers = false;
    },
    // customerSelected(item) {
    //   this.selector_customer = item;
    //   // this.modals.browseCustomers = false;

    //   let receiver = {
    //     receiver_id: item.id,
    //     fio: this.selectedCustomer,
    //   };

    //   this.message.receivers.push(receiver);
    // },
    saveMessage() {
      // Prepare
      let message = this.message;

      message.user_id = this.$store.getters["auth/getAuthData"].userid;

      // Destination
      // if (this.destination_type === 0) {
      //   message.destination = ["*"];
      // } else if (this.destination_type === 1 && message.receivers.length > 0) {
      //   message.destination = message.receivers.map((item) => item.receiver_id);
      // } else {
      //   return;
      // }
      if (message.receivers.length > 0) {
        message.destination = message.receivers.map((item) => item.receiver_id);
      } else {
        return;
      }

      // Send
      this.fetchSaveMessage(message);
    },
    deleteMessage(messageId) {
      var confirmed = confirm("Вы действительно хотите удалить сообщение?");
      if (confirmed) {
        // console.log("del");
        this.fetchDeleteMessage(messageId);
      }
    },

    // Networking
    async fetchMessage(message_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getNotification(message_id);
        this.message = result;
        this.message.destination_string = result.destination;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchSaveMessage(message) {
      // console.log(message.destination);
      this.isLoading = true;
      try {
        let result = await apiService.saveNotification(message);
        let new_id = result.id;
        // this.fetchMessage(new_id);
        this.$emit("createdMessage", new_id);
        console.log(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchDeleteMessage(message_id) {
      this.isLoading = true;
      try {
        await apiService.deleteNotification(message_id);
        this.$emit("createdMessage", 0);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchReceivers(f_name, param1) {
      // this.isLoading = true;
      try {
        let result = await apiService.getNotificationsReceivers(f_name, param1);
        this.message.receivers = result;
        //this.message.destination_string = result.destination;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      // this.isLoading = false;
    },
    async fetchPromoActions() {
      // this.isLoading = true;
      try {
        let result = await apiService.getPromoActions([1, 2]);
        this.promoActions = [{ name: "Выбрать акцию", id: null }].concat(result);
        //this.message.destination_string = result.destination;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      // this.isLoading = false;
    },
    async fetchBranches() {
      try {
        let result = await apiService.getBranches();
        this.branches = [{ name: "Выбрать филиал", id: null }].concat(result);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
    },
  },
};
</script>

<style scoped>
.content {
  /* overflow: auto; */
  /* background-color: burlywood; */
  /* height: 100%; */
  max-height: 100vh;
}
</style>
