<script>
export default {
  props: {
    collegas: Array,
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  computed: {
    progressText() {
      return `${this.currentIndex + 1} / ${this.collegas.length}`;
    },
    progressPercent() {
      return Math.round(((this.currentIndex + 1) / this.collegas.length) * 100);
    },
  },
  methods: {
    nextItem() {
      if (this.currentIndex < this.collegas.length - 1) {
        this.currentIndex++;
      }
    },
    prevousItem() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    submitAnswers() {
      const score = this.calculateScore();
      localStorage.setItem("gameScore", JSON.stringify(score));
      this.$router.push("/result");
    },
    calculateScore() {
      let totalGoodAnswers = 0;
      let wrongAnswers = [];
      for (let i = 0; i < this.collegas.length; i++) {
        if (
            (this.collegas[i].answer || "").trim().toLowerCase() ===
            (this.collegas[i].firstName || "").trim().toLowerCase()
        ) {
          totalGoodAnswers++;
        } else {
          wrongAnswers.push({
            name: this.collegas[i].firstName,
            imgUrl: this.collegas[i].imgUrl,
          });
        }
      }

      return {
        scoreOutOf10: ((totalGoodAnswers / this.collegas.length) * 10).toFixed(1),
        totalGoodAnswers,
        wrongAnswers,
      };
    },
  },
};
</script>

<template>
  <main class="game-shell" v-if="collegas && collegas.length">
    <section class="card">
      <header class="header">
        <div class="title">People First – The Game</div>
        <div class="sub">Microsoft Services Innovation Day • Xebia</div>
      </header>

      <div class="meta">
        <div class="prompt">Who is this?</div>
        <div class="counter">{{ progressText }}</div>
      </div>

      <div class="progress" aria-hidden="true">
        <div class="bar" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="photo-wrap">
        <img
            :src="collegas[currentIndex].link"
            class="photo"
            alt="Colleague photo"
            @error="(e) => (e.target.src = '/fallback-photos/fallback.jpg')"
        />
      </div>

      <div class="form">
        <label class="label" for="answer">First name</label>
        <input
            id="answer"
            name="answer"
            type="text"
            class="input"
            placeholder="Type the first name…"
            autocomplete="off"
            v-model="collegas[currentIndex].answer"
        />
        <div class="hint">Tip: first name only (case doesn’t matter)</div>
      </div>

      <div class="actions">
        <button
            class="btn btn-secondary"
            :disabled="currentIndex === 0"
            @click="prevousItem"
        >
          Previous
        </button>

        <button
            v-if="currentIndex < collegas.length - 1"
            class="btn btn-primary"
            @click="nextItem"
        >
          Next
        </button>

        <button
            v-else
            class="btn btn-primary"
            @click="submitAnswers"
        >
          Submit
        </button>
      </div>
    </section>
  </main>

  <main class="game-shell" v-else>
    <section class="card">
      <div class="loading">Loading…</div>
    </section>
  </main>
</template>

<style scoped>
/* App-wide feel for THIS component only */
.game-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: #ffffff;
  font-family: Calibri, "Segoe UI", Arial, sans-serif;
  color: #111;
}

/* Card */
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

/* Meta row */
.meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-top: 10px;
}
.prompt {
  font-weight: 700;
}
.counter {
  color: rgba(0,0,0,0.55);
  font-size: 0.95rem;
}

/* Progress bar */
.progress {
  height: 10px;
  background: rgba(0,0,0,0.08);
  border-radius: 999px;
  overflow: hidden;
  margin: 10px 0 16px;
}
.bar {
  height: 100%;
  width: 0%;
  background: #2ea44f; /* green theme */
  border-radius: 999px;
  transition: width 200ms ease;
}

/* Photo */
.photo-wrap {
  display: flex;
  justify-content: center;
  margin: 8px 0 16px;
}
.photo {
  width: 260px;
  height: 260px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(46,164,79,0.22);
  box-shadow: 0 10px 22px rgba(0,0,0,0.12);
  background: #f6f6f6;
}

/* Form */
.form {
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-bottom: 16px;
}
.label {
  width: min(360px, 100%);
  font-weight: 700;
  text-align: left;
}
.input {
  width: min(360px, 100%);
  padding: 12px 14px;
  border: 1px solid rgba(0,0,0,0.18);
  border-radius: 12px;
  font-size: 1.05rem;
  outline: none;
  background: #fff;
}
.input:focus {
  border-color: rgba(46,164,79,0.9);
  box-shadow: 0 0 0 4px rgba(46,164,79,0.18);
}
.input::placeholder {
  color: rgba(0,0,0,0.45);
  opacity: 1;
}

.hint {
  width: min(360px, 100%);
  text-align: left;
  color: rgba(0,0,0,0.55);
  font-size: 0.9rem;
}

/* Buttons */
.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.btn {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid transparent;
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
}
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-primary {
  background: #2ea44f;
  color: #fff;
}
.btn-primary:hover {
  filter: brightness(0.95);
}
.btn-secondary {
  background: #fff;
  color: #111;
  border-color: rgba(0,0,0,0.18);
}
.btn-secondary:hover {
  background: rgba(0,0,0,0.03);
}

/* Small phones */
@media (max-width: 360px) {
  .photo {
    width: 220px;
    height: 220px;
  }
  .card {
    padding: 14px;
  }
}

/* Loading */
.loading {
  text-align: center;
  padding: 26px 6px;
  color: rgba(0,0,0,0.6);
  font-weight: 600;
}
</style>
