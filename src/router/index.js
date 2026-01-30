import { createRouter, createWebHashHistory } from "vue-router";
import StartView from "../views/StartView.vue";

const router = createRouter({
  // Hash routing avoids GitHub Pages 404s on refresh/deep links.
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      path: "/match",
      name: "match",
      component: () => import("../views/MatchView.vue"),
    },
    {
      path: "/memory",
      name: "memory",
      component: () => import("../views/MemoryGameView.vue"),
    },
  ],
});

export default router;
