<template>
  <UIButton text="Назад" icon="left arrow" type="basic labeled" @click="back(to, force)" />
</template>

<script setup>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { navigateBack } from "@/navigation";

// Setup

const router = useRouter();
const store = useStore();

// Props

const props = defineProps({
  to: {
    type: String,
    default: null,
  },
  force: {
    type: Boolean,
    default: false,
  },
});

// Functions

function back(pathName, force) {
  navigateBack(router, store, pathName, force);
}
</script>
