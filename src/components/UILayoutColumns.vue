<template>
  <!-- Grid -->
  <div class="ui-container">
    <!-- fist column -->
    <div class="ui-column" :class="{ 'right-bordered': rightBordered }">
      <slot></slot>
    </div>
    <!-- second column -->
    <div class="ui-column">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "UILayoutColumns",

  props: {
    rightBordered: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
:root {
  --ui-border-color: rgb(222, 222, 223);
  --ui-background-secondary-color: #22242605;
}

.secondary-background {
  background-color: var(--ui-background-secondary-color);
}

.bottom-bordered {
  border-bottom: 1px var(--ui-border-color) solid;
}

.right-bordered {
  border-right: 1px var(--ui-border-color) solid;
}

.ui-container {
  display: flex;
  flex-direction: column;
}

@media only screen and (min-width: 860px) {
  .ui-container {
    display: flex;
    flex-direction: row;
  }
}
/* @media only screen and (min-width: 768px) {
  .container {
    display: flex;
    flex-direction: row;
  }
} */

.ui-column {
  flex: 1;
}

.ui-column2 {
  flex: 2;
}

.ui-column50 {
  flex: 0 0 50%;
}

.ui-column60 {
  flex: 0 0 60%;
}
</style>
