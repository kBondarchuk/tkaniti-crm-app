<template>
  <div>
    <div :key="updateKey" :class="{ loading: isLoading }" class="gallery">
      <div v-for="(image, index) in records" :key="image.id" class="item" style="position: relative">
        <!-- <a :href="url_download_base+'?file=images/'+image.filename+'&jwt='+token" target="_blank"> -->
        <img
          v-if="token"
          :src="url_download_base + '?file=images/' + image.filename + '&jwt=' + token"
          :alt="image.upload_ts"
          :title="image.upload_ts"
          @click="activeIndex = index"
        />
        <!-- </a> -->
        <div class="description">{{ image.description }}</div>
        <img
          src="/images/remove.svg"
          class="delete"
          alt="Удалить фото"
          title="Удалить фото"
          @click="deletePhoto(image.filename)"
        />
      </div>
      <div class="item add" title="Добавить фото" @click="addPhoto()">
        <img src="/images/plus.svg" alt="Добавить фото" />
      </div>
    </div>

    <!-- Gallery -->
    <VueEasyLightbox :imgs="items" :index="activeIndex" :visible="activeIndex !== null" @hide="activeIndex = null" />
    <!-- <CoolLightBox ref="coolLightBox" :items="items" :index="activeIndex" @close="activeIndex = null"></CoolLightBox> -->
    <!-- Modals -->
    <FormAddPhoto
      :active="modals.addPhoto"
      :album-uuid="albumUuid"
      @hide="modals.addPhoto = false"
      @saved="addPhotoDone"
    />
    <!-- --- -->
  </div>
</template>

<script>
import apiService from "@/services/api.service.js";

import FormAddPhoto from "@/components/FormAddPhoto.vue";
import VueEasyLightbox from "vue-easy-lightbox";
// import CoolLightBox from "vue-cool-lightbox";
// import "vue-cool-lightbox/dist/vue-cool-lightbox.min.css";

export default {
  name: "CMPhotoGallery",

  components: {
    FormAddPhoto,
    VueEasyLightbox,
    // CoolLightBox,
  },

  props: {
    albumUuid: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      records: [],
      isLoading: false,
      updateKey: 0,
      url_download_base: this.$store.state.url_download_base,
      token: "",
      // Modals
      modals: {
        addPhoto: false,
      },
      // Gallery
      activeIndex: null,
    };
  },

  computed: {
    items() {
      return this.records.map((item) => {
        return this.url_download_base + "?file=images/" + item.filename + "&jwt=" + this.token;
      });
    },
  },

  watch: {
    albumUuid: {
      immediate: true,
      handler(newValue) {
        // newValue, oldValue
        console.log("fetching photos for: " + this.albumUuid + ", newValue: ", newValue);

        if (!newValue) return;
        this.fetchPhotos(this.albumUuid);
      },
    },
  },

  mounted() {
    this.fetchToken();

    // Move coolLightBox to Main Div
    /*
    var bodyParent = document.getElementById("app");
    var child = this.$refs.coolLightBox.$el;
    bodyParent.appendChild(child);
    */
  },

  methods: {
    addPhoto() {
      console.log("addPhoto");
      this.modals.addPhoto = true;
    },
    addPhotoDone() {
      console.log("addPhotoDone2");
      this.fetchPhotos(this.albumUuid);
    },
    deletePhoto(filename) {
      console.log("deletePhoto: " + filename);

      var confirmed = confirm("Вы действительно хотите удалить изображение?");
      if (confirmed) {
        this.fetchPhotoDelete(filename);
      }
    },
    // Network
    async fetchPhotos(album_uuid) {
      console.log("1 fetchPhotos for: ", album_uuid);

      this.isLoading = true;
      try {
        let result = await apiService.getImages(album_uuid);
        console.log("fetchPhotos result: ", result);

        this.records = result;
      } catch (error) {
        this.$UIService.showNetworkError(error);
      }
      this.isLoading = false;
    },
    async fetchPhotoDelete(filename) {
      this.isLoading = true;
      try {
        await apiService.deleteImage(filename);
        // In ECMA6 (arrow function syntax):
        this.records = this.records.filter((e) => e.filename !== filename);
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
  margin: -0.5em;
}

.gallery .item {
  width: 230px;
  height: 180px;
  border-radius: 2%;
  margin: 0.5em;
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
  left: 0.4em;
  color: white;
  padding-left: 0.5em;
  padding-right: 0.5em;
  margin-right: 0.4em;
  border-bottom-left-radius: 0.2em;
  background-color: rgba(0, 0, 0, 0.35);
}
</style>
