<template>
  <main class="result-shell">
    <section class="card">
      <header class="header">
        <div class="flex items-center xl:pr-[1.813rem]" style="opacity: 1;">
          <router-link to="/" aria-label="Home">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 85 29" class="w-[5.375rem]">
              <path fill="currentColor" fill-rule="evenodd" d="M44.695 15.768H33.012c.167 2.07 1.715 3.394 4.099 3.31 1.478 0 2.774-.62 3.471-1.817h3.667c-1.227 3.21-3.792 5.028-7.027 5.028-2.175 0-3.973-.747-5.479-2.268-1.366-1.45-2.175-3.465-2.175-5.408 0-2.057.697-3.874 2.05-5.324 1.478-1.564 3.402-2.437 5.395-2.437 2.482 0 4.782 1.268 6.33 3.338.906 1.324 1.352 2.887 1.352 4.831zm-11.64-2.761h7.96c-.544-1.944-1.966-3.014-4.113-3.014-1.729 0-3.36 1.197-3.848 3.014M49.838 2.57V8.47c1.31-1.07 2.747-1.493 4.517-1.45 1.924 0 3.68.62 5.033 1.943 1.631 1.45 2.496 3.592 2.496 5.733 0 2.323-.976 4.507-2.733 6.028-1.31 1.07-2.914 1.69-4.782 1.69-1.715 0-3.178-.493-4.53-1.563v1.197h-3.347V2.569zm4.293 7.774c-2.37 0-4.168 1.888-4.168 4.409 0 2.394 1.882 4.281 3.987 4.267 2.621 0 4.42-1.901 4.42-4.338 0-2.324-1.869-4.338-4.239-4.338M67.447 2.57h-3.234v3.267h3.234zm0 4.789h-3.234v14.69h3.234zM85 22.05h-3.2479999999999998v-1.817c-.808 1.52-2.286 2.14-4.53 2.14-4.28 0-7.515-3.31-7.515-7.718 0-2.07.697-3.958 2.05-5.408 1.477-1.564 3.22-2.268 5.395-2.268 2.119 0 3.625.69 4.614 2.14V7.36h3.235zm-7.709-11.762c-2.3 0-4.168 1.817-4.168 4.211 0 2.592 1.924 4.409 4.224 4.409 2.12 0 4.043-1.944 4.043-4.211 0-2.521-1.98-4.409-4.099-4.409" clip-rule="evenodd"></path>
              <path fill="currentColor" d="M.125 28.333h8.827L18.5 18.73l9.521 9.603h8.938l-13.99-14.11L37.085 0h-8.938L18.5 9.743 8.91 0H0l14.032 14.223z"></path>
            </svg>
          </router-link>
        </div>
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
export default {
  data() {
    return {
      score: {
        scoreOutOf10: 0,
        totalGoodAnswers: 0,
        totalTiles: 9,
        missedJesses: [],
        falsePositives: []
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
      this.$router.push("/");
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

.header a:active svg {
  color: #ff8c00;
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
  color: var(--pf-text);
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
