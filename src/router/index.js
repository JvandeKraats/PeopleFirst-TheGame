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
      component: () => import("../views/MatchView.vue").catch(() => {
        console.error("Failed to load MatchView");
        return import("../views/GameView.vue");
      }),
    },
    {
      path: "/memory",
      name: "memory",
      component: () => import("../views/MemoryGameView.vue").catch(() => {
        console.error("Failed to load MemoryGameView");
        return import("../views/GameView.vue");
      }),
    },
    {
      path: "/find-jesse",
      name: "findJesse",
      component: () => import("../views/FindJesseView.vue").catch(() => {
        console.error("Failed to load FindJesseView");
        return import("../views/GameView.vue");
      }),
    },
    {
      path: "/find-jesse-result",
      name: "findJesseResult",
      component: () => import("../components/FindJesseResult.vue"),
    },
    {
      path: "/silhouette-quiz",
      name: "silhouetteQuiz",
      component: () => import("../views/SilhouetteQuizView.vue").catch(() => {
        console.error("Failed to load SilhouetteQuizView");
        return import("../views/GameView.vue");
      }),
    },
    {
      path: "/progressive-reveal",
      name: "progressiveReveal",
      component: () => import("../views/ProgressiveRevealView.vue").catch(() => {
        console.error("Failed to load ProgressiveRevealView");
        return import("../views/GameView.vue");
      }),
    },
    {
      path: "/progressive-reveal-result",
      name: "progressiveRevealResult",
      component: () => import("../components/ProgressiveRevealResult.vue"),
    },
  ],
});

// Add global error handler for navigation
router.onError((error) => {
  console.error("Router error:", error);
});

export default router;
