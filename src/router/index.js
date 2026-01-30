import { createRouter, createWebHashHistory } from "vue-router";
import StartView from "../views/StartView.vue";
import RegionSelectView from "../views/RegionSelectView.vue";

const router = createRouter({
  // Hash routing avoids GitHub Pages 404s on refresh/deep links.
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "regionSelect",
      component: RegionSelectView,
    },
    {
      path: "/bnl",
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
    {
      path: "/find-jesse",
      name: "findJesse",
      component: () => import("../views/FindJesseView.vue"),
    },
    {
      path: "/find-jesse-result",
      name: "findJesseResult",
      component: () => import("../components/FindJesseResult.vue"),
    },
    {
      path: "/silhouette-quiz",
      name: "silhouetteQuiz",
      component: () => import("../views/SilhouetteQuizView.vue"),
    },
    {
      path: "/progressive-reveal",
      name: "progressiveReveal",
      component: () => import("../views/ProgressiveRevealView.vue"),
    },
    {
      path: "/progressive-reveal-result",
      name: "progressiveRevealResult",
      component: () => import("../components/ProgressiveRevealResult.vue"),
    },
  ],
});

export default router;
