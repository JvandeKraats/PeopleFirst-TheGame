<script>
export default {
  props: {
    collegas: {
      type: Array,
      required: true
    },
    trackTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentIndex: 0,
      _startTime: null
    };
  },
  computed: {
    fallbackAvatarUrl() {
      return new URL('fallback-photos/fallback-avatar.png', import.meta.env.BASE_URL).href
    },
    progressText() {
      return `${this.currentIndex + 1} / ${this.collegas.length}`;
    },
    progressPercent() {
      return Math.round(((this.currentIndex + 1) / this.collegas.length) * 100);
    }
  },
  mounted() {
    window.addEventListener('keydown', this._handleKeyDown)
    if (this.trackTime) {
      this._startTime = Date.now()
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this._handleKeyDown)
  },
  methods: {
    onPhotoError(e) {
      if (e?.target) e.target.src = this.fallbackAvatarUrl
    },
    _sanitizeUrl(v) {
      const s = (v ?? '').toString().trim()
      if (!s || s === 'undefined' || s === 'null') return ''
      return s
    },
    _normalizeName(s) {
      return (s || '').toString().trim().toLowerCase()
    },
    _levenshtein(a, b) {
      const s = this._normalizeName(a)
      const t = this._normalizeName(b)
      if (!s.length) return t.length
      if (!t.length) return s.length

      const prev = new Array(t.length + 1)
      const curr = new Array(t.length + 1)
      for (let j = 0; j <= t.length; j++) prev[j] = j

      for (let i = 1; i <= s.length; i++) {
        curr[0] = i
        const sChar = s[i - 1]
        for (let j = 1; j <= t.length; j++) {
          const cost = sChar === t[j - 1] ? 0 : 1
          curr[j] = Math.min(
            prev[j] + 1,
            curr[j - 1] + 1,
            prev[j - 1] + cost
          )
        }
        for (let j = 0; j <= t.length; j++) prev[j] = curr[j]
      }

      return prev[t.length]
    },
    _isReallyCloseGuess(guess, correctFirstName) {
      const g = this._normalizeName(guess)
      const c = this._normalizeName(correctFirstName)
      if (!g || !c) return false
      if (g === c) return false

      const maxDistance = c.length <= 4 ? 1 : 2
      const distance = this._levenshtein(g, c)
      return distance > 0 && distance <= maxDistance
    },
    _handleKeyDown(e) {
      if (e.key !== 'Enter') return
      e.preventDefault()

      if (this.currentIndex < this.collegas.length - 1) {
        this.nextItem()
      } else {
        this.submitAnswers()
      }
    },
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
      if (this.trackTime && this._startTime) {
        const elapsedMs = Date.now() - this._startTime
        score.elapsedMs = elapsedMs
        score.elapsed = msToHuman(elapsedMs)
      }
      this.$emit('submit', score)
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
          const guess = (this.collegas[i].answer || '').toString().trim()
          wrongAnswers.push({
            name: this.collegas[i].firstName,
            imgUrl: this._sanitizeUrl(this.collegas[i].link) || this.fallbackAvatarUrl,
            guess,
            isClose: this._isReallyCloseGuess(guess, this.collegas[i].firstName)
          });
        }
      }

      return {
        mode: 'silhouette',
        scoreOutOf10: ((totalGoodAnswers / this.collegas.length) * 10).toFixed(1),
        totalGoodAnswers,
        wrongAnswers,
      };
    }
  }
};

function msToHuman(ms) {
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
</script>

<template>
  <main class="game-shell" v-if="collegas && collegas.length">
    <section class="card">
      <header class="header">
        <div class="flex items-center xl:pr-[1.813rem]" style="opacity:1">
          <router-link to="/" aria-label="Home">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 85 29" class="w-[5.375rem]">
              <path fill="currentColor" fill-rule="evenodd" d="M44.695 15.768H33.012c.167 2.07 1.715 3.394 4.099 3.31 1.478 0 2.774-.62 3.471-1.817h3.667c-1.227 3.21-3.792 5.028-7.027 5.028-2.175 0-3.973-.747-5.479-2.268-1.366-1.45-2.175-3.465-2.175-5.408 0-2.057.697-3.874 2.05-5.324 1.478-1.564 3.402-2.437 5.395-2.437 2.482 0 4.782 1.268 6.33 3.338.906 1.324 1.352 2.887 1.352 4.831zm-11.64-2.761h7.96c-.544-1.944-1.966-3.014-4.113-3.014-1.729 0-3.36 1.197-3.848 3.014M49.838 2.57V8.47c1.31-1.07 2.747-1.493 4.517-1.45 1.924 0 3.68.62 5.033 1.943 1.631 1.45 2.496 3.592 2.496 5.733 0 2.323-.976 4.507-2.733 6.028-1.31 1.07-2.914 1.69-4.782 1.69-1.715 0-3.178-.493-4.53-1.563v1.197h-3.347V2.569zm4.293 7.774c-2.37 0-4.168 1.888-4.168 4.409 0 2.394 1.882 4.281 3.987 4.267 2.621 0 4.42-1.901 4.42-4.338 0-2.324-1.869-4.338-4.239-4.338M67.447 2.57h-3.234v3.267h3.234zm0 4.789h-3.234v14.69h3.234zM85 22.05h-3.2479999999999998v-1.817c-.808 1.52-2.286 2.14-4.53 2.14-4.28 0-7.515-3.31-7.515-7.718 0-2.07.697-3.958 2.05-5.408 1.477-1.564 3.22-2.268 5.395-2.268 2.119 0 3.625.69 4.614 2.14V7.36h3.235zm-7.709-11.762c-2.3 0-4.168 1.817-4.168 4.211 0 2.592 1.924 4.409 4.224 4.409 2.12 0 4.043-1.944 4.043-4.211 0-2.521-1.98-4.409-4.099-4.409" clip-rule="evenodd"></path>
              <path fill="currentColor" d="M.125 28.333h8.827L18.5 18.73l9.521 9.603h8.938l-13.99-14.11L37.085 0h-8.938L18.5 9.743 8.91 0H0l14.032 14.223z"></path>
            </svg>
          </router-link>
        </div>
      </header>

      <div class="meta">
        <div class="prompt">Who's that colleague?</div>
        <div class="counter">{{ progressText }}</div>
      </div>

      <div class="progress" aria-hidden="true">
        <div class="bar" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="photo-wrap">
        <img
            :src="collegas[currentIndex].silhouetteUrl || collegas[currentIndex].link"
            class="photo"
            alt="Silhouette of colleague"
            @error="onPhotoError"
        />
      </div>

      <div class="form">
        <label class="label" for="answer">First name</label>
        <input
            id="answer"
            name="answer"
            type="text"
            class="input"
            placeholder="Guess from the silhouette…"
            autocomplete="off"
            v-model="collegas[currentIndex].answer"
        />
        <div class="hint">Guess the name from the silhouette (exact match on first name)</div>
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
.game-shell {
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

.header {
  text-align: center;
  margin-bottom: 14px;
}

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
  color: var(--pf-muted);
  font-size: 0.95rem;
}

.progress {
  height: 10px;
  background: var(--pf-border-soft);
  border-radius: 999px;
  overflow: hidden;
  margin: 10px 0 16px;
}
.bar {
  height: 100%;
  width: 0%;
  background: var(--pf-accent);
  border-radius: 999px;
  transition: width 200ms ease;
}

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
  box-shadow: 0 10px 22px var(--pf-shadow-strong);
  background: var(--pf-surface-2);
}

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
  border: 1px solid var(--pf-border-strong);
  border-radius: 12px;
  font-size: 1.05rem;
  outline: none;
  background: var(--pf-input-bg);
  color: var(--pf-text);
}
.input:focus {
  border-color: rgba(46,164,79,0.9);
  box-shadow: 0 0 0 4px rgba(46,164,79,0.18);
}
.input::placeholder {
  color: var(--pf-placeholder);
  opacity: 1;
}

.hint {
  width: min(360px, 100%);
  text-align: left;
  color: var(--pf-muted);
  font-size: 0.9rem;
}

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
  background: var(--pf-accent);
  color: #fff;
}
.btn-primary:hover {
  filter: brightness(0.95);
}
.btn-secondary {
  background: var(--pf-surface);
  color: var(--pf-text);
  border-color: var(--pf-border-strong);
}
.btn-secondary:hover {
  background: var(--pf-hover);
}

@media (max-width: 360px) {
  .photo {
    width: 220px;
    height: 220px;
  }
  .card {
    padding: 14px;
  }
}

.loading {
  text-align: center;
  padding: 26px 6px;
  color: var(--pf-muted);
  font-weight: 600;
}
</style>
