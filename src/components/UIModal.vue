<template>
  <div :id="modal_id" class="ui modal" :class="size" @keyup.esc="$emit('cancel', modal_id)" @keyup.enter="doApprove">
    <div class="header">
      {{ title }}<br v-if="subtitle" /><span v-if="subtitle" class="subheader">{{ subtitle }}</span>
    </div>
    <div class="content" :class="{ 'no-padding': noPadding, scrolling: scrollingContent }">
      <slot>
        <p>Default content.</p>
      </slot>
    </div>
    <div class="actions">
      <!-- delete -->
      <UIButton
        v-if="deleteButton"
        tabindex="0"
        type="left floated red"
        text="Удалить"
        class="button-min-width"
        @click="$emit('delete', modal_id)"
      />
      <!-- ok -->
      <UIButton
        v-if="!noApproveButton"
        tabindex="0"
        type="primary"
        :text="approveButtonText"
        class="button-min-width"
        :class="{ disabled: !isApprovable }"
        @click="$emit('approve', modal_id)"
      />
      <!-- cancel -->
      <UIButton tabindex="0" text="Отмена" class="button-min-width" @click="$emit('cancel', modal_id)" />
    </div>
  </div>
</template>

<script>
import UIButton from "@/components/UIButton.vue";

export default {
  name: "UIModal",

  components: {
    UIButton,
  },

  abstract: true,

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Title",
    },
    subtitle: {
      type: String,
      default: null,
    },
    modal_id: {
      type: String,
      required: true,
      default: null,
    },
    size: {
      type: String,
      default: "tiny",
    },
    isApprovable: {
      type: Boolean,
      default: true,
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
    scrollingContent: {
      type: Boolean,
      default: false,
    },
    approveButtonText: {
      type: String,
      default: "OK",
    },
    approveByEnter: {
      type: Boolean,
      default: true,
    },
    deleteButton: {
      type: Boolean,
      default: false,
    },
    noApproveButton: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["delete", "approve", "cancel", "didHide", "didShow"],

  watch: {
    // newValue, oldValue
    active(newValue) {
      // eslint-disable-next-line no-console
      // console.log(oldValue + "->" + newValue, "#" + this.modal_id);
      if (newValue) {
        const self = this;

        $("#" + self.modal_id)
          .modal({
            dimmerSettings: { opacity: 0.3 },
            // duration: 200,
            closable: false,
            detachable: false,
            observeChanges: true,
            allowMultiple: true,
            onHide: function () {
              // console.log("hidden");
              self.$emit("didHide", self.modal_id);
            },
            onHidden() {
              // $("#" + self.modal_id).remove();
            },
            onShow: function () {
              // console.log("showed");
              self.$emit("didShow", self.modal_id);
            },
          })
          .modal("show");
      } else {
        // window.console.log("!!!+++!!!: " + this.modal_id);
        $("#" + this.modal_id).modal("hide");
      }
    },
  },

  unmounted() {
    console.log("Unmounted: " + this.modal_id);

    // $("#" + this.modal_id).remove();
  },
  // mounted() {
  //   console.log("mounted: " + this.modal_id);
  //   $("#" + this.modal_id)
  //     .modal({
  //       dimmerSettings: { opacity: 0.2 },
  //       duration: 200,
  //       closable: false,
  //       onHidden: console.log(">>>hidden<<<")
  //     })
  //     .modal("show");
  // },
  methods: {
    doApprove() {
      if (this.approveByEnter) {
        this.$emit("approve", this.modal_id);
      }
    },
  },
};
</script>

<style scoped>
.ui.modal > .content.no-padding {
  padding: 0;
}

.header > span.subheader {
  font-weight: 400;
  font-size: 1.1rem;
  /* line-height: 1.2em; */
  color: rgba(0, 0, 0, 0.6);
}

.button-min-width {
  min-width: 7em;
}
</style>
