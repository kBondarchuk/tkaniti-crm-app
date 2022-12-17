<template>
  <WPanelContainer horizontal>
    <!-- Tool Bar -->
    <WPanel v-if="reportId">
      <div class="ui-tool-bar-local">
        <UIButton text="Обновить" type="right labeled" icon="refresh" @click="refetch(reportId, photoAlbumUuid)" />
        <!--  -->
        <UISpacer />
        <!--  -->
        <UIButton
          text="Внести пробег"
          type="right labeled"
          icon="right chevron"
          :disabled="!isValidToPostCarData"
          @click="addNewCarData"
        />
        <!--  -->
        <UISpacer />
        <!--  -->
        <UIButton
          type="primary right labeled"
          text="Сохранить"
          icon="check"
          :class="reportId && report.items && !report.items.length ? 'disabled' : ''"
          @click="fetchSetMarks(report.items)"
        />
      </div>
      <!--  -->
    </WPanel>

    <!-- Details -->
    <WPanel size="full">
      <UIPanelSplash v-if="!reportId">Отчёт не выбран</UIPanelSplash>
      <UIPanelSplash v-if="reportId && report.items && !report.items.length">В отчёте нет фотографий</UIPanelSplash>

      <div
        v-if="reportId && report.items && report.items.length && images.length"
        :key="updateKey"
        class="gallery"
        :class="{ loading: isLoading }"
      >
        <!-- Item -->
        <div
          v-for="(item, index) in report.items"
          :key="item.id"
          class="item"
          :class="[item.item_type, item.check === null ? 'todo' : '']"
          :style="
            'background-size: cover;background-position: center center;background-image: URL(' +
            url_download_base +
            '?file=images/' +
            getImageNameById(item.photo_id) +
            '&jwt=' +
            token +
            ')'
          "
          @click="activeIndex = index"
        >
          <!-- <img
            :src="url_download_base+'?file=images/'+getImageNameById(item.photo_id)+'&jwt='+token"
            :alt="item.note"
            :title="item.note"
            v-if="token"
          />-->
          <!-- Description -->
          <div class="description">
            {{ typeNames[item.item_type] }}
            <br />
            {{ $filters.date(item.date) }}
          </div>
          <!-- check mark -->
          <div class="mark">
            <i v-if="item.check == 0" class="big icons">
              <i class="circle icon" style="color: white"></i>
              <i class="red dont icon"></i>
            </i>
            <i v-if="item.check == 1" class="big icons">
              <i class="green circle icon"></i>
              <i class="small green check icon" style="color: white"></i>
            </i>
          </div>
          <!-- buttons -->
          <div class="two ui buttons">
            <button class="positive ui button" @click.stop="handleApprove(item)">Принять</button>
            <button class="negative ui button" @click.stop="handleDeny(item)">Отклонить</button>
          </div>
          <!-- Input field -->
          <!-- <input
            type="text"
            autocomplete="off"
            class="ui input textfield"
            v-model.trim.lazy="item.note"
            v-if="item.check === 0 || (item.check === null && item.note)"
            @click.stop
          /> -->
          <textarea
            v-if="item.check === 0 || (item.check === null && item.note)"
            v-model.trim.lazy="item.note"
            cols="40"
            rows="2"
            @click.stop
          ></textarea>
        </div>
        <!--  -->
      </div>

      <!-- Gallery -->
      <VueEasyLightbox :imgs="items" :index="activeIndex" :visible="activeIndex !== null" @hide="activeIndex = null" />
      <!-- <CoolLightBox :items="items" :index="activeIndex" @close="activeIndex = null" /> -->
      <!-- New Data Modal -->
      <ModalCarHistoryDataEdit :car-id="report.car_id" :active="modals.editData" @hide="modals.editData = false" />
      <!------->
    </WPanel>
  </WPanelContainer>
</template>

<script>
import apiService from "@/services/api.service.js";
import WPanel from "@/components/WPanel.vue";
import WPanelContainer from "@/components/WPanelContainer.vue";
import UIPanelSplash from "@/components/UIPanelSplash.vue";
import ModalCarHistoryDataEdit from "@/components/ModalCarHistoryDataEdit.vue";
import VueEasyLightbox from "vue-easy-lightbox";

// import CoolLightBox from "vue-cool-lightbox";
// import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";

export default {
  name: "CMPhotoReportDetails",
  components: {
    WPanel,
    WPanelContainer,
    VueEasyLightbox,
    // CoolLightBox,
    UIPanelSplash,
    ModalCarHistoryDataEdit,
  },

  props: {
    reportId: {
      type: Number,
      default: null,
    },
    photoAlbumUuid: {
      type: String,
      default: null,
    },
  },

  emits: ["updated"],

  data() {
    return {
      report: {},
      images: [],
      isLoading: false,
      updateKey: 0,
      url_download_base: this.$store.state.url_download_base,
      token: "",
      typeNames: {
        left: "Левая сторона",
        right: "Правая сторона",
        front: "Передняя часть",
        back: "Задняя часть",
        odometr: "Одометр",
      },
      // Gallery
      activeIndex: null,
      // Modals
      modals: { editData: false },
    };
  },

  computed: {
    items() {
      if (!this.report.items) return [];
      return this.report.items.map((item) => {
        return (
          this.url_download_base +
          "?file=images/" +
          this.getImageNameById(item.photo_id) +
          "&jwt=" +
          this.token +
          "&ff=" +
          item.id
        );
      });
    },
    isValidToPostCarData() {
      return this.report && this.report.car_id > 0;
    },
  },

  watch: {
    reportId() {
      // newValue, oldValue
      console.log(">>>", this.reportId);

      this.reset();
      if (this.reportId) {
        this.refetch(this.reportId, this.photoAlbumUuid);
      }
    },
  },

  mounted() {
    // this.fetchToken();
  },

  methods: {
    reset() {
      this.report = {};
      this.images = [];
    },
    handleDetails(item) {
      console.log("details clicked: " + item.id);
    },
    getImageNameById(id) {
      const item = this.images.find((obj) => obj.id == id);
      if (item) {
        return item.filename;
      } else {
        return null;
      }
    },
    handleApprove(item) {
      // console.log("approve: " + item.id);
      item.check = 1;
    },
    handleDeny(item) {
      // console.log("deny: " + item.id);
      item.check = 0;
    },
    addNewCarData() {
      this.modals.editData = true;
    },

    // Network
    async refetch(reportId, photo_album_uuid) {
      console.log("refetch:", reportId, photo_album_uuid);

      this.isLoading = true;
      // let result = {};
      // let images = [];
      try {
        this.token = await apiService.getDownloadToken();
        this.images = await apiService.getImages(photo_album_uuid);
        this.report = await apiService.getPhotoReport(reportId);
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchSetMarks(items) {
      this.isLoading = true;

      try {
        let result = await apiService.updateItemsMarks(items);
        console.log("result: ", result);
        this.$emit("updated");
        this.$UIService.showSuccess("Отчёт сохранён!");

        // this.reports = result;
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
.no-content {
  padding-top: 3rem;
  padding-bottom: 3rem;
  text-align: center;
  font-size: 1.5rem;
  color: rgba(0, 0, 0, 0.25);
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  align-content: stretch;
  /* height: 100%; */
  /* display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 0; */
}

.gallery .item {
  flex: 0 0 50%;
  /* width: 50%; */
  min-height: 20em;
  /* border-radius: 2%; */
  /* margin: 0.5em; */
  padding: 2px;
  background: rgba(0, 0, 0, 0.05);
  position: relative;
}

.gallery .item.todo {
  background-color: red;
}

.gallery .item.left {
  order: 1;
}
.gallery .item.right {
  order: 2;
}
.gallery .item.front {
  order: 3;
}
.gallery .item.back {
  order: 4;
}
.gallery .item.odometr {
  order: 5;
}

.gallery .item:hover {
  background: rgba(0, 0, 0, 0.15);
}
/* .gallery .item img {
   width: auto;
  height: auto;
  object-fit: cover;
  overflow: hidden;
} */

.gallery .item textarea {
  /* display: none; */
  padding: 4px;
  color: white;
  background-color: rgb(182, 0, 0);

  border: 0;

  position: absolute;
  width: 100%;
  /* height: em; */
  bottom: 0;
  left: 0;

  /* transform: translate(-50%, 0); */
}
.gallery .item div.buttons {
  display: none;
  position: absolute;
  width: 90%;
  /* height: em; */
  bottom: 16%;
  left: 50%;
  transform: translate(-50%, 0);
}

.gallery .item:hover div.buttons {
  display: block;
}

.gallery .item div.mark {
  display: block;
  position: absolute;
  right: 0.6rem;
  top: 0.6rem;
}

.gallery .item div.description {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  color: white;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin-right: 0.4em;
  border-bottom-right-radius: 0.2em;
  background-color: rgba(0, 0, 0, 0.35);
}
</style>
