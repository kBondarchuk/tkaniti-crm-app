<template>
  <div
    :id="$options.name"
    :headers="headers[viewMode]"
    :header-sticked-at="headerStickedAt"
    :items-count="items.length"
    :is-loading="isLoading"
    class="gallery"
    @header:sort="handleHeaderSort"
  >
    <!-- Items -->
    <div v-for="item in items" :key="item.id" class="item" @click="$emit('eventDetails', item)">
      <img
        v-if="item.thumbnail"
        loading="lazy"
        :src="apiBaseUrl + '/store/thumbnails/' + item.thumbnail"
        :alt="item.name"
      />
      <!-- <img
        v-if="item.thumbnail && token"
        loading="lazy"
        :src="url_download_base + '?file=images/' + item.thumbnail + '&jwt=' + token"
        :alt="item.name"
      /> -->
      <div class="description">
        <span>{{ item.brand }}</span
        ><br />{{ item.name }}
      </div>
    </div>
    <!-- <TKGoodsGridCell
      v-for="item in items"
      :key="item.id + '-goods-'"
      :item="item"
      class="item"
      @event-details="$emit('eventDetails', item)"
      @event-edit="$emit('eventEdit', item.id)"
      @event-delete="$emit('eventDelete', item.id)"
    /> -->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";
import { arrayEquals } from "@/utils/utils.js";

// import TKGoodsGridCell from "@/components/TKGoodsGridCell.vue";

export default {
  name: "TKGoodsGrid",

  components: {
    // TKGoodsGridCell,
  },

  props: {
    filterStatus: {
      type: Array,
      default: null,
    },
    headerStickedAt: {
      type: Number,
      default: null,
    },
    searchString: {
      type: String,
      default: null,
    },
    viewMode: {
      type: Number,
      default: 0, // 0 - text, 1 - image
    },
  },

  emits: ["eventDetails", "eventEdit", "eventDelete"],

  data() {
    return {
      headers: [
        [
          { id: "id", name: "No.", class: "" },
          { id: "status_id", name: "Статус", class: "" },
          { id: "name", name: "Название", class: "" },
          { id: "brand", name: "Бренд", class: "" },
          { id: "code", name: "Артикул", class: "" },
          { id: "price", name: "Цена", class: "right aligned" },
          { id: "remains", name: "Остаток", class: "right aligned" },
          // { id: "description", name: "Описание", class: "" },
          { id: "notes", name: "Комментарий", class: "" },
          // { id: "gibdd_valid_number", name: "М", class: "" },
        ],
        [
          { id: "id", name: "No.", class: "" },
          { id: "name", name: "Название", class: "" },
          { id: "brand", name: "Бренд", class: "" },
          { id: "status_id", name: "Статус", class: "" },
          { id: "code", name: "Артикул", class: "" },
          { id: "price", name: "Цена", class: "right aligned" },
          { id: "remains", name: "Остаток", class: "right aligned" },
          // { id: "description", name: "Описание", class: "" },
          { id: "notes", name: "Комментарий", class: "" },
          // { id: "gibdd_valid_number", name: "М", class: "" },
        ],
      ],
      items: [],
      isLoading: false,
      filter: {},
      // url_download_base: this.$store.state.url_download_base,
      token: null,
      apiBaseUrl: import.meta.env.VUE_APP_API_BASE,
    };
  },

  watch: {
    filterStatus(newValue, oldValue) {
      // console.log(newValue, oldValue, arrayEquals(newValue, oldValue));
      if (!arrayEquals(newValue, oldValue)) {
        this.refetch(this.filter);
      }
    },
    searchString() {
      this.refetch(this.filter);
    },
  },

  async created() {
    // await this.fetchToken();
    this.refetch(this.filter);
  },

  methods: {
    handleHeaderSort(item) {
      this.filter = item;
      this.refetch(item);
    },
    handleDelete() {
      // expense_id
      // console.log("delete clicked: " + expense_id);
    },
    async refetch(tableFilters) {
      this.isLoading = true;
      try {
        let result = await apiService.getGoods(tableFilters, this.filterStatus, this.searchString);
        this.items = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchToken() {
      console.log("fetchToken");

      this.isLoading = true;
      try {
        let result = await apiService.getDownloadToken();
        this.token = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.gallery {
  display: flex;
  flex-wrap: wrap;
  margin: 0.7rem;
}

.gallery .item {
  position: relative;
  width: 230px;
  height: 180px;
  border-radius: 2%;
  margin: 0.3rem;
  padding: 0.4em;
  background: rgba(0, 0, 0, 0.05);
}

.gallery .item:hover {
  background: rgba(0, 0, 0, 0.15);
}
.gallery .item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2%;
  margin: 0;
}

.gallery .item.add {
  display: flex;
  align-items: center;
}

.gallery .item.add img {
  object-fit: scale-down;
  display: block;
  width: auto;
  height: 40%;
  margin-right: auto;
  margin-left: auto;
}

.gallery .item img.delete {
  display: none;
}

.gallery .item:hover img.delete {
  display: block;
  position: absolute;
  width: 1.5em;
  height: 1.5em;
  top: -0.3em;
  left: -0.3em;
}

.gallery .item div.description {
  display: block;
  position: absolute;
  bottom: 0.4em;
  /* left: 0.4em; */
  color: white;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin-right: 0.4em;
  border-bottom-left-radius: 0.2em;
  background-color: rgba(0, 0, 0, 0.35);
  width: calc(100% - (0.4em + 0.5em));
  white-space: nowrap;
  text-overflow: ellipsis;
}

.gallery .item div.description > span {
  font-weight: 900;
}
</style>
