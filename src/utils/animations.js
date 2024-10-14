// import { toast } from "vue3-toastify";

import "./animations.css";

const Animations = {
  Names: {
    ShakeHorizontal: "anim-shake-horizontal",
    Pulsate: "anim-pulsate-fwd",
  },

  animate(el, name) {
    if (!el) return;

    console.log(el, name);
    el.classList.add(name);

    el.onanimationend = () => {
      el.classList.remove(name);
    };
  },

  animateBySelector(selector, name) {
    if (!selector) return;
    const element = document.querySelector(selector);
    this.animate(element, name);
  },
};

export default Animations;
