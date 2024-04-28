<template>
  <tr :class="{ 'text-color-red': model.access_right == 'sysadmin' }">
    <!-- Name -->
    <td style="width: 60%">
      <template v-if="model.name">{{ model.name }}</template>
      <template v-else>{{ model.key }}</template>

      <!-- Description -->
      <div v-if="model.description" class="color-secondary">{{ model.description }}</div>
    </td>

    <!-- Value -->
    <template v-if="!$slots.default">
      <td class="align_top right aligned">
        <UIInputMoney v-if="model.type == 'decimal'" v-model.lazy="model.decimal_value" />
        <UIInputNumber v-if="model.type == 'int'" v-model.lazy="model.int_value" />
        <UITextfield v-if="model.type == 'string'" v-model.trim.lazy="model.string_value" />
      </td>
    </template>

    <!-- slot -->
    <td v-if="$slots.default" class="align_top">
      <slot></slot>
    </td>

    <!-- Button -->
    <td class="align_top right aligned">
      <UIButton
        type="basic"
        icon="check green"
        text=""
        title="Сохранить"
        style="padding: 6.5px"
        @click="saveParam(item)"
      />
    </td>
  </tr>

  <!-- description -->
  <!-- <tr v-if="model.description">
    <td colspan="3" style="border-top: 0; padding-top: 0">
      <div class="color-secondary">{{ model.description }}</div>
    </td>
  </tr> -->
</template>

<script setup>
import { ref, computed, watch } from "vue";

/// SETUP

const model = defineModel({ type: Object });

/// EMITS

const emit = defineEmits(["save"]);

/// COMPUTED

const style = computed(() => {
  return model.value.description ? "padding-bottom: 0" : null;
});

/// FUNCTIONS

function saveParam(value) {
  emit("save", value);
}
</script>

<style lang="scss" scoped>
.align_top {
  vertical-align: top;
}
</style>
