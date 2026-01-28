<template>
  <main class="result-shell">
    <section class="card">
      <header class="header">
        <div class="title">People First – The Game</div>
        <div class="sub">Microsoft Services Innovation Day • Xebia</div>
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
          {{ score.totalGoodAnswers }} / {{ totalQuestions }} correct
        </div>

        <div class="verdict" :class="score.scoreOutOf10 >= 5 ? 'verdict-good' : 'verdict-bad'">
          <span v-if="score.scoreOutOf10 >= 8">Proper legend. 👏</span>
          <span v-else-if="score.scoreOutOf10 >= 5">Solid effort — keep it going.</span>
          <span v-else>Brave attempt. Time for a rematch.</span>
        </div>
      </div>

      <div v-if="score.wrongAnswers && score.wrongAnswers.length" class="wrong">
        <div class="wrong-title">Missed names</div>
        <ul class="wrong-list">
          <li v-for="(w, idx) in score.wrongAnswers" :key="idx">
            {{ w.name }}
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
        wrongAnswers: []
      }
    };
  },
  computed: {
    totalQuestions() {
      // The game uses 10, but we compute it safely.
      const wrong = this.score.wrongAnswers?.length ?? 0;
      const right = this.score.totalGoodAnswers ?? 0;
      const total = right + wrong;
      return total > 0 ? total : 10;
    }
  },
  mounted() {
    const storedScore = JSON.parse(localStorage.getItem("gameScore"));
    if (storedScore) {
      this.score = storedScore;
    }
  },
  methods: {
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
  background: #ffffff;
  font-family: Calibri, "Segoe UI", Arial, sans-serif;
  color: #111;
}

.card {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.10);
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 14px;
}
.title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.2px;
}
.sub {
  margin-top: 4px;
  font-size: 0.95rem;
  color: rgba(0,0,0,0.60);
}

/* Score block */
.score-block {
  text-align: center;
  padding: 10px 0 6px;
}
.score-label {
  font-weight: 700;
  color: rgba(0,0,0,0.65);
  margin-bottom: 6px;
}
.score-value {
  font-size: 3.2rem;
  font-weight: 800;
  line-height: 1;
  margin: 6px 0;
}
.score-good {
  color: #2ea44f;
}
.score-bad {
  color: #c62828;
}
.score-meta {
  color: rgba(0,0,0,0.60);
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
  background: rgba(46,164,79,0.12);
  color: #1b5e20;
}
.verdict-bad {
  background: rgba(198,40,40,0.10);
  color: #8e0000;
}

/* Wrong answers */
.wrong {
  margin-top: 14px;
  border-top: 1px solid rgba(0,0,0,0.08);
  padding-top: 14px;
}
.wrong-title {
  font-weight: 800;
  margin-bottom: 8px;
}
.wrong-list {
  margin: 0;
  padding-left: 18px;
  color: rgba(0,0,0,0.72);
}
.wrong-list li {
  margin: 4px 0;
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
  color: rgba(0,0,0,0.55);
  font-size: 0.9rem;
}
</style>
