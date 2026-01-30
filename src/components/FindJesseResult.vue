<template>
  <main class="result-shell">
    <section class="card">
      <header class="header">
        <XmsLogoHomeLink />
        <h1 class="title">People First – The Game</h1>
        <div class="subtitle">
          The Magic of Innovation Days
        </div>
      </header>

      <div class="score-block">
        <div class="score-label">Your score</div>

        <div
            class="score-value"
            :class="score.scoreOutOf10 >= 5 ? 'score-good' : 'score-bad'"
        >
          {{ score.scoreOutOf10 }}
        </div>

        <div class="score-meta">
          {{ score.totalGoodAnswers }} / {{ totalTiles }} correct
        </div>

        <div v-if="score.elapsed" class="time-taken">
          <div class="time-label">Time</div>
          <div class="time-value">{{ score.elapsed }}</div>
        </div>

        <div class="verdict" :class="score.scoreOutOf10 >= 5 ? 'verdict-good' : 'verdict-bad'">
          <span v-if="score.scoreOutOf10 >= 8">Proper legend. 👏</span>
          <span v-else-if="score.scoreOutOf10 >= 5">Solid effort — keep it going.</span>
          <span v-else>Brave attempt. Time for a rematch.</span>
        </div>
      </div>

      <!-- Missed Jesses Section -->
      <div v-if="score.missedJesses && score.missedJesses.length" class="wrong">
        <div class="wrong-title">Missed Jesses</div>
        <ul class="wrong-list">
          <li v-for="(w, idx) in score.missedJesses" :key="'missed-' + idx" class="wrong-item">
            <img
                class="wrong-photo"
                :src="missedPhotoSrc(w)"
                :alt="w.name ? `Photo of ${w.name}` : 'Missed Jesse photo'"
                loading="lazy"
                @error="(e) => (e.target.src = '/fallback-photos/fallback-avatar.png')"
            />
            <div class="wrong-name">{{ w.name }}</div>
          </li>
        </ul>
      </div>

      <!-- False Positives Section -->
      <div v-if="score.falsePositives && score.falsePositives.length" class="wrong">
        <div class="wrong-title">Not the Jesse</div>
        <ul class="wrong-list">
          <li v-for="(w, idx) in score.falsePositives" :key="'false-' + idx" class="wrong-item">
            <img
                class="wrong-photo"
                :src="missedPhotoSrc(w)"
                :alt="w.name ? `Photo of ${w.name}` : 'Not Jesse photo'"
                loading="lazy"
                @error="(e) => (e.target.src = '/fallback-photos/fallback-avatar.png')"
            />
            <div class="wrong-name">{{ w.name }}</div>
          </li>
        </ul>
      </div>

      <div class="actions">
        <button class="btn btn-primary" @click="resetScore">
          Try again
        </button>
      </div>

      <footer class="footer">
        © Xebia • Microsoft Services Innovation Day
      </footer>
    </section>
  </main>
</template>

<script>
import confetti from 'canvas-confetti'
import XmsLogoHomeLink from './XmsLogoHomeLink.vue'

export default {
  components: {
    XmsLogoHomeLink
  },
  data() {
    return {
      score: {
        scoreOutOf10: 0,
        totalGoodAnswers: 0,
        totalTiles: 9,
        missedJesses: [],
        falsePositives: [],
        elapsed: null
      }
    };
  },
  computed: {
    totalTiles() {
      return this.score.totalTiles || 9;
    }
  },
  mounted() {
    const storedScore = JSON.parse(localStorage.getItem("gameScore"));
    if (storedScore) {
      this.score = storedScore;
      // Trigger confetti for perfect score (handles both number and string)
      if (parseFloat(this.score.scoreOutOf10) === 10) {
        this.celebratePerfectScore();
      }
    }
  },
  methods: {
    missedPhotoSrc(w) {
      return (
          w?.imgUrl ||
          w?.link ||
          w?.photo ||
          "/fallback-photos/fallback-avatar.png"
      );
    },
    resetScore() {
      this.$router.push("/bnl");
    },
    celebratePerfectScore() {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }
};
</script>

<style scoped>
.result-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: var(--pf-bg);
  font-family: Calibri, "Segoe UI", Arial, sans-serif;
  color: var(--pf-text);
}

.card {
  width: 100%;
  max-width: 520px;
  background: var(--pf-surface);
  border: 1px solid var(--pf-border-soft);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 28px var(--pf-shadow);
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 14px;
}

.header :deep(a:active svg) {
  color: var(--pf-logo-active);
}

.header a {
  display: inline-block;
}

.header svg {
  width: 5.375rem;
  height: auto;
}

.title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.2px;
  margin-top: 8px;
}

.subtitle {
  margin-top: 4px;
  font-size: 0.95rem;
  color: var(--pf-muted);
}

/* Time display */
.time-taken {
  margin-top: 8px;
  text-align: center;
}
.time-label {
  color: var(--pf-muted-2);
  font-weight: 700;
  font-size: 0.85rem;
}
.time-value {
  color: var(--pf-muted-2);
  font-weight: 800;
  margin-top: 4px;
  font-size: 1.25rem;
}

/* Score block */
.score-block {
  text-align: center;
  padding: 10px 0 6px;
}

.score-label {
  font-weight: 700;
  color: var(--pf-muted);
  margin-bottom: 6px;
}

.score-value {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1;
  margin: 6px 0;
}

.score-good {
  color: var(--pf-accent);
}

.score-bad {
  color: var(--pf-danger);
}

.score-meta {
  color: var(--pf-muted);
  font-weight: 600;
  margin-top: 6px;
}

.verdict {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 700;
}

.verdict-good {
  background: rgba(46, 164, 79, 0.12);
  color: var(--pf-text);
}

.verdict-bad {
  background: rgba(198, 40, 40, 0.10);
  color: var(--pf-muted-2);
}

/* Wrong answers sections */
.wrong {
  margin-top: 14px;
  border-top: 1px solid var(--pf-border-soft);
  padding-top: 14px;
}

.wrong-title {
  font-weight: 800;
  margin-bottom: 8px;
  font-size: 1rem;
}

.wrong-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  color: var(--pf-muted-2);
}

.wrong-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border: 1px solid var(--pf-border-soft);
  border-radius: 12px;
  background: var(--pf-hover);
}

.wrong-photo {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  object-fit: cover;
  flex: 0 0 auto;
  border: 2px solid rgba(46, 164, 79, 0.18);
  background: var(--pf-surface-2);
}

.wrong-name {
  font-weight: 700;
}

@media (min-width: 520px) {
  .wrong-list {
    grid-template-columns: 1fr 1fr;
  }
}

/* Actions */
.actions {
  margin-top: 18px;
  display: flex;
  justify-content: center;
}

.btn {
  width: min(360px, 100%);
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 800;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary {
  background: #2ea44f;
  color: #fff;
}

.btn-primary:hover {
  filter: brightness(0.95);
}

.footer {
  margin-top: 14px;
  text-align: center;
  color: var(--pf-muted);
  font-size: 0.9rem;
}
</style>
