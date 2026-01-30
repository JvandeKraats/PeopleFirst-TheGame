import { createRouter, createWebHistory } from "vue-router";
import StartView from "../views/StartView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: StartView,
    },
    {
      path: "/game",
      name: "game",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/GameView.vue"),
    },
    {
      path: "/result",
      name: "result",
      component: () => import("../views/ResultView.vue"),
    },
    {
      path: "/memory",
      name: "memory",
      component: () => import("../views/MemoryGameView.vue"),
    },
    {
      path: "/match",
      name: "match",
      component: () => import("../views/MatchView.vue"),
    },
    {
      path: "/find-jesse",
      name: "findJesse",
      component: () => import("../views/FindJesseView.vue"),
    },
  ],
});

export default router;
