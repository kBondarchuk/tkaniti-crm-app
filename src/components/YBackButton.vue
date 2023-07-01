<template>
  <UIButton text="Назад" icon="left arrow" type="basic labeled" @click="back(to)" />
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
});

// Functions

function back(pathName) {
  navigateBack(router, store, pathName);
}
</script>
