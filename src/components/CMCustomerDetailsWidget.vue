<template>
  <table class="ui very compact small celled unstackable table" :class="{ loading: isLoading }">
    <thead>
      <tr>
        <th colspan="4" class="ui center aligned">
          <CMLinkCustomer :customer-id="customer.id" />
          КЛИЕНТ ({{ customer.id }})
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="gray_bg">ФИО</td>
        <td>{{ customer.last_name + " " + customer.first_name + " " + customer.second_name }}</td>
        <td class="gray_bg">Дата рождения</td>
        <td>{{ $filters.date(customer.date_of_birth) }}</td>
      </tr>
      <!-- <tr>
        <td>Пол</td>
        <td>{{ customer.gender_name }}</td>
      </tr>-->
      <tr>
        <td class="gray_bg">Телефон</td>
        <td>{{ $filters.phone(customer.phone) }}</td>
        <td class="gray_bg">Номер ВУ</td>
        <td>{{ $filters.ctc(customer.drivers_license_no) }}</td>
      </tr>
      <tr>
        <td class="gray_bg">Email</td>
        <td>{{ customer.email }}</td>
        <td class="gray_bg">Филиал</td>
        <td>{{ customer.branch }}</td>
      </tr>
      <tr>
        <td class="gray_bg">Цель приобретения авто</td>
        <td colspan="3">{{ customer.purpose_name }}</td>
      </tr>
      <tr>
        <td colspan="4" class="gray_bg">Паспортные данные</td>
      </tr>
      <tr>
        <td colspan="4">{{ customer.passport }}</td>
      </tr>
      <tr>
        <td colspan="4" class="gray_bg">Адрес регистрации</td>
      </tr>
      <tr>
        <td colspan="4">
          <span v-if="customer.address_reg_region">{{ customer.address_reg_region }}, </span>
          <span v-if="customer.address_reg_area">{{ customer.address_reg_area }}, </span>
          <span v-if="customer.address_reg_city"
            >{{ customer.address_reg_city_type }} {{ customer.address_reg_city }},
          </span>
          {{ customer.address_reg }}
        </td>
      </tr>
      <tr>
        <td colspan="4" class="gray_bg">Адрес фактический</td>
      </tr>
      <tr>
        <td colspan="4">
          <span v-if="customer.address_fact_region">{{ customer.address_fact_region }}, </span>
          <span v-if="customer.address_fact_area">{{ customer.address_fact_area }}, </span>
          <span v-if="customer.address_fact_city"
            >{{ customer.address_fact_city_type }} {{ customer.address_fact_city }},
          </span>
          {{ customer.address_fact }}
        </td>
      </tr>
      <tr>
        <td class="gray_bg">Контактное лицо</td>
        <td colspan="2">
          {{ customer.contact_name }}
          <span v-if="customer.contact_type">({{ customer.contact_type }})</span>
          <span v-else>&mdash;</span>
        </td>
        <td colspan="1">
          <span> {{ $filters.phone(customer.contact_phone) }}</span>
        </td>
        <!-- <td class="gray_bg">Телефон</td>
        <td> {{ $filters.phone(customer.contact_phone ) }}</td>-->
      </tr>
      <tr>
        <td class="gray_bg">Адрес контактного лица</td>
        <td colspan="4">{{ customer.contact_address }}</td>
      </tr>
      <tr>
        <td class="gray_bg">ЮМ.бонус</td>
        <td>{{ $filters.money(customer.bonus) }} &#8381;</td>
        <td class="gray_bg">ЮМ.копилка</td>
        <td>{{ $filters.money(customer.accum) }} &#8381;</td>
      </tr>
      <tr>
        <td class="gray_bg">Привёл</td>
        <td colspan="3">
          <span v-if="customer.referrer_id">
            <a :href="'/customers/' + customer.referrer_id" title="Перейти на страницу клиента">
              {{ referrer.last_name + " " + referrer.first_name + " " + referrer.second_name }}
            </a>
          </span>
          <span v-else> &mdash; </span>
        </td>
      </tr>
      <tr>
        <td v-if="customer.notes" colspan="4">
          <i class="exclamation icon"></i>
          {{ customer.notes }}
        </td>
        <!-- <td colspan="4" v-else>Нет заметок</td> -->
      </tr>
    </tbody>
  </table>
</template>

<script>
import apiService from "@/services/api.service.js";
import CMLinkCustomer from "@/components/CMLinkCustomer.vue";

export default {
  name: "CMCustomerDetailsWidget",
  components: {
    CMLinkCustomer,
  },
  props: {
    customer_id: {
      type: Number,
    },
  },
  data() {
    return {
      customer: {},
      referrer: {},
      isLoading: false,
    };
  },
  mounted() {
    if (this.customer_id !== undefined) {
      this.fetchItem(this.customer_id);
    }
  },
  methods: {
    async fetchItem(customer_id) {
      this.isLoading = true;
      try {
        let result = await apiService.getCustomer(customer_id);
        this.customer = result;
        if (this.customer.referrer_id) {
          this.referrer = await apiService.getCustomer(this.customer.referrer_id);
        }
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>
