import { routes } from "@/router/routes.gen";

export default [
  ...routes,

  // Main
  {
    path: "/",
    component: () => import("@/layouts/LayoutView.vue"),
    children: [
      {
        // will match everything
        path: "/:pathMatch(.*)*",
        name: "page_not_found",
        component: () => import("@/views/Error404View.vue"),
      },
      {
        // will match everything
        path: "/:pathMatch(.*)",
        name: "page_not_found2",
        component: () => import("@/views/Error404View.vue"),
      },
    ],
  },
];
