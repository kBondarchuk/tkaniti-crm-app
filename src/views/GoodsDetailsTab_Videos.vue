<template>
  <CMVideoGallery :album-uuid="good?.photo_album_uuid" />
</template>

<script setup>
import CMVideoGallery from "@/components/CMVideoGallery.vue";

// name: "TKGoodsDetailsTab_Videos",

const props = defineProps({
  good: {
    type: Object,
    default: null,
  },
});

// EOF
</script>
