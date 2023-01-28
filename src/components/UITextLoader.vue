<template>
  <span class="ui-text-preloader">{{ string() }}</span>
</template>

<script>
export default {
  name: "UITextLoader",

  methods: {
    string() {
      const rand = Math.floor(Math.random() * 26) + 5;
      //   console.warn(rand);

      return "0123456789 0123456789 0123456789".substring(0, rand);
    },
  },
};
</script>

<style>
.ui-text-preloader {
  --color-one: #e0e1e2;
  --color-two: #f0f1f2;
  --bg-size: 400%;
  /* background-color: #e0e1e2; */
  background: linear-gradient(90deg, var(--color-one), var(--color-two), var(--color-one)) 0 0 / var(--bg-size) 100%;
  border-radius: 3px;
  color: transparent;
  width: 12em;
}

@media (prefers-reduced-motion: no-preference) {
  .ui-text-preloader {
    animation: move-bg 2.5s linear infinite;
    animation-direction: reverse;
  }
  @keyframes move-bg {
    to {
      background-position: var(--bg-size) 0;
    }
  }
}
</style>
