<template>
  <CMPhotoGallery :album-uuid="good?.photo_album_uuid" />
</template>

<script>
import CMPhotoGallery from "@/components/CMPhotoGallery.vue";

export default {
  name: "TKGoodsDetailsTabPhotoGallery",

  components: {
    CMPhotoGallery,
  },

  props: {
    good: {
      type: Object,
      default: null,
    },
  },
};
</script>
