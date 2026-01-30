<script>
export default {
  props: {
    collegas: Array,
    mode: {
      type: String,
      default: 'hard'
    }
  },
  data() {
    return {
      currentIndex: 0,
      choicesById: {}
    };
  },
  computed: {
    isEasyMode() {
      return (this.mode || '').toString().toLowerCase() === 'easy'
    },
    progressText() {
      return `${this.currentIndex + 1} / ${this.collegas.length}`;
    },
    progressPercent() {
      return Math.round(((this.currentIndex + 1) / this.collegas.length) * 100);
    },
    currentChoices() {
      if (!this.isEasyMode) return []
      return this.getChoicesForIndex(this.currentIndex)
    }
  },
  watch: {
    collegas: {
      handler() {
        this.choicesById = {}
      },
      deep: false
    },
    mode() {
      this.choicesById = {}
    }
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
    selectChoice(choice) {
      const item = this.collegas?.[this.currentIndex]
      if (!item) return
      item.answer = choice
    },
    isChoiceSelected(choice) {
      const item = this.collegas?.[this.currentIndex]
      return ((item?.answer || '').trim().toLowerCase() === (choice || '').trim().toLowerCase())
    },
    shuffle(items) {
      const arr = items.slice()
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    },
    getChoicesForIndex(index) {
      const item = this.collegas?.[index]
      if (!item) return []

      const cacheKey = item.id ?? index
      const cached = this.choicesById[cacheKey]
      if (cached && cached.length) return cached

      const correct = (item.firstName || '').trim()
      const pool = (this.collegas || [])
        .map(c => (c.firstName || '').trim())
        .filter(n => n)
        .filter(n => n.toLowerCase() !== correct.toLowerCase())

      const uniquePool = Array.from(new Set(pool))
      const picked = this.shuffle(uniquePool).slice(0, 3)
      const options = this.shuffle([correct, ...picked].filter(Boolean))

      this.choicesById[cacheKey] = options
      return options
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
            imgUrl: this.collegas[i].link,
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
<!--        <div class="title">People First – The Game</div>
        <div class="sub">Microsoft Services Innovation Day</div>-->
        <div class="flex items-center xl:pr-[1.813rem]" style="opacity:1"><a href="/"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 85 29" class="w-[5.375rem]"><path fill="currentColor" fill-rule="evenodd" d="M44.695 15.768H33.012c.167 2.07 1.715 3.394 4.099 3.31 1.478 0 2.774-.62 3.471-1.817h3.667c-1.227 3.21-3.792 5.028-7.027 5.028-2.175 0-3.973-.747-5.479-2.268-1.366-1.45-2.175-3.465-2.175-5.408 0-2.057.697-3.874 2.05-5.324 1.478-1.564 3.402-2.437 5.395-2.437 2.482 0 4.782 1.268 6.33 3.338.906 1.324 1.352 2.887 1.352 4.831zm-11.64-2.761h7.96c-.544-1.944-1.966-3.014-4.113-3.014-1.729 0-3.36 1.197-3.848 3.014M49.838 2.57V8.47c1.31-1.07 2.747-1.493 4.517-1.45 1.924 0 3.68.62 5.033 1.943 1.631 1.45 2.496 3.592 2.496 5.733 0 2.323-.976 4.507-2.733 6.028-1.31 1.07-2.914 1.69-4.782 1.69-1.715 0-3.178-.493-4.53-1.563v1.197h-3.347V2.569zm4.293 7.774c-2.37 0-4.168 1.888-4.168 4.409 0 2.394 1.882 4.281 3.987 4.267 2.621 0 4.42-1.901 4.42-4.338 0-2.324-1.869-4.338-4.239-4.338M67.447 2.57h-3.234v3.267h3.234zm0 4.789h-3.234v14.69h3.234zM85 22.05h-3.2479999999999998v-1.817c-.808 1.52-2.286 2.14-4.53 2.14-4.28 0-7.515-3.31-7.515-7.718 0-2.07.697-3.958 2.05-5.408 1.477-1.564 3.22-2.268 5.395-2.268 2.119 0 3.625.69 4.614 2.14V7.36h3.235zm-7.709-11.762c-2.3 0-4.168 1.817-4.168 4.211 0 2.592 1.924 4.409 4.224 4.409 2.12 0 4.043-1.944 4.043-4.211 0-2.521-1.98-4.409-4.099-4.409" clip-rule="evenodd"></path><path fill="currentColor" d="M.125 28.333h8.827L18.5 18.73l9.521 9.603h8.938l-13.99-14.11L37.085 0h-8.938L18.5 9.743 8.91 0H0l14.032 14.223z"></path></svg></a></div>
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
            @error="(e) => (e.target.src = '/fallback-photos/fallback-avatar.png')"
        />
      </div>

      <div class="form">
        <template v-if="isEasyMode">
          <div class="choices" role="group" aria-label="Multiple choice answers">
            <button
              v-for="choice in currentChoices"
              :key="choice"
              type="button"
              class="choice"
              :class="{ 'choice-selected': isChoiceSelected(choice) }"
              @click="selectChoice(choice)"
            >
              {{ choice }}
            </button>
          </div>
          <div class="hint">Multiple choice: pick the correct first name</div>
        </template>

        <template v-else>
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
          <div class="hint">Exact match on first name (case doesn’t matter)</div>
        </template>
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

/* Multiple choice */
.choices {
  width: min(360px, 100%);
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.choice {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.18);
  background: #fff;
  text-align: left;
  font-weight: 700;
  cursor: pointer;
}

.choice:hover {
  background: rgba(0,0,0,0.03);
}

.choice-selected {
  border-color: rgba(46,164,79,0.9);
  box-shadow: 0 0 0 4px rgba(46,164,79,0.18);
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
