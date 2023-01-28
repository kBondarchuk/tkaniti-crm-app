<template>
  <div class="ui-list" :class="{ loading: isLoading, 'right-aligned': valueRightAligned }">
    <slot></slot>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "UIList",

  provide() {
    return {
      // isLoading: computed(() => this.isLoading),
      isLoading: computed(() => this.isLoading),
    };
  },

  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    valueRightAligned: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
/*
    LIST
*/

/*
    USES VARS:

    --text-color-primary
    --text-color-secondary
    --background-color
    --grouped-background-color
    --hairline-color
    --default-radius
*/
:root {
  --ui-secondary-color: gray;
}

:root {
  /* 0.6rem; */
  --list-item-radius: 4px;
  --list-item-vertical-padding: 5px;
  --list-item-right-padding: 0;
  --list-item-left-padding: 0;

  --list-item-left-inset: 1rem;
  --list-item-right-inset: 1rem;

  --list-header-color: var(--ui-secondary-color);
  --list-hairline-color: rgb(228, 228, 228);
  --list-grouped-background-color: transparent;
  --list-item-background-color: rgb(249, 250, 251);
  --list-item-label-color: black;
  --list-item-value-color: black;
  --list-label-font-weigth: 600;
  --list-row-border-color: rgb(228, 228, 228);
  --list-row-border-width: 1px;
  --list-value-column-width: 50%;
  --list-font-size: 13px;
  --list-line-height: 20px;
}

.color-secondary {
  color: var(--ui-secondary-color) !important;
}

.ui-inset {
  margin: 1rem !important;
}

.ui-list-section {
  background-color: transparent;
  /* border-radius: var(--default-radius); */
}

.ui-list-section + .ui-list-section {
  margin-top: 1rem;
}

.ui-list.not-grouped > .ui-list-section + .ui-list-section {
  margin-top: 0;
}

.ui-list-section + .ui-header {
  /* padding-top: 1.5rem; */
  margin-top: 0.5rem;
}

.ui-list {
  background-color: var(--list-grouped-background-color);
  font-size: var(--list-font-size);
  line-height: var(--list-line-height);
}

.ui-list > .ui-header
/*, .ui-header  */ {
  color: var(--list-header-color);
  padding: var(--list-item-vertical-padding) calc(var(--list-item-left-inset) + var(--list-row-border-width))
    var(--list-item-vertical-padding) calc(var(--list-item-right-inset) + var(--list-row-border-width));
  text-transform: uppercase;
}

.ui-list-section > .ui-list-row {
  padding: 0 var(--list-item-right-inset) 0 var(--list-item-left-inset);
  background-color: var(--list-item-background-color);
}

.ui-list-section > .ui-list-row {
  border-right: var(--list-row-border-width) solid var(--list-row-border-color);
  border-left: var(--list-row-border-width) solid var(--list-row-border-color);
}

.ui-list-section > .ui-list-row:first-child {
  border-top: var(--list-row-border-width) solid var(--list-row-border-color);
}

.ui-list-section > .ui-list-row:last-child {
  border-bottom: var(--list-row-border-width) solid var(--list-row-border-color);
}

.ui-list-section > .ui-list-row > .inner-content {
  display: grid;
  grid-template-columns: auto var(--list-value-column-width);
  padding: var(--list-item-vertical-padding) var(--list-item-right-padding) var(--list-item-vertical-padding)
    var(--list-item-left-padding);
  line-height: var(--line-height);
  /* background-color: yellow; */
  /* border-bottom: 1px red solid; */
}

.ui-list-section > .ui-list-row.stack > .inner-content {
  /* display: grid; */
  grid-template-columns: unset;
}

.ui-list-section > .ui-list-row.stack > .inner-content > .label {
  padding-bottom: var(--list-item-vertical-padding);
}

.ui-list-row + .ui-list-row > .inner-content {
  border-top: 1px var(--list-hairline-color) solid;
}

.ui-list.not-grouped .ui-list-row:last-child > .inner-content {
  border-bottom: 1px var(--list-hairline-color) solid;
}

.ui-list.not-grouped .ui-list-row:last-child > .inner-content {
  border-bottom: 1px var(--list-hairline-color) solid;
}

.ui-list.not-grouped .ui-header + .ui-list-section .ui-list-row:first-child > .inner-content {
  border-top: 1px var(--list-hairline-color) solid;
}

.ui-list > .ui-list-section > .ui-list-row:first-child {
  border-top-left-radius: var(--list-item-radius);
  border-top-right-radius: var(--list-item-radius);
}

.ui-list > .ui-list-section > .ui-list-row:last-child {
  border-bottom-left-radius: var(--list-item-radius);
  border-bottom-right-radius: var(--list-item-radius);
}

.ui-list-row > .inner-content > .label {
  color: var(--list-item-label-color);
  font-weight: var(--list-label-font-weigth);
}

.ui-list-row > .inner-content > .value {
  /* text-align: right; */
  color: var(--list-item-value-color);
}

.ui-list.right-aligned .ui-list-row > .inner-content > .value {
  text-align: right;
}

@media only screen and (max-width: 800px) {
  .ui-list-section > .ui-list-row > .inner-content {
    grid-template-columns: unset;
  }

  .ui-list-section > .ui-list-row > .inner-content > .label {
    padding-bottom: var(--list-item-vertical-padding);
  }

  .ui-list-row > .inner-content > .label {
    color: var(--ui-secondary-color);
    font-weight: 400;
  }
}
</style>
