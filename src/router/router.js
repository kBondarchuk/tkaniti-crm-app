import { createRouter as _createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

export function createRouter() {
  return _createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    // base: import.meta.env.BASE_URL,
    routes: routes,
  });
}
