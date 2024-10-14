<template>
  <UIButton text="Назад" icon="left arrow" type="basic labeled" @click="back(to)" />
</template>

<script setup>
import { useRouter } from "vue-router";
import { navigateBack } from "@/utils/navigation";

// Setup

const router = useRouter();

// Props

const props = defineProps({
  to: {
    type: String,
    default: null,
  },
});

// Functions

function back(pathName) {
  navigateBack(router, pathName);
}
</script>
