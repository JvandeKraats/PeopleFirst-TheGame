<script>
import { applyFallbackOnError, getFallbackAvatarUrl, sanitizeUrl } from '../utils/photo'
import XmsLogoHomeLink from './XmsLogoHomeLink.vue'

export default {
  components: {
    XmsLogoHomeLink
  },
  props: {
    collegas: Array,
    mode: {
      type: String,
      default: 'hard'
    },
    trackTime: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentIndex: 0,
      choicesById: {},
      _startTime: null
    };
  },
  computed: {
    fallbackAvatarUrl() {
      return getFallbackAvatarUrl()
    },
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
    },
    // Helper that returns true when in easy mode and a choice is selected for the current item
    hasSelectedChoice() {
      if (!this.isEasyMode) return true // not relevant for hard mode
      const item = this.collegas?.[this.currentIndex]
      return !!(item && (item.answer || '').toString().trim())
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
  mounted() {
    // Listen for Enter key to advance to next item (or submit) when allowed.
    window.addEventListener('keydown', this._handleKeyDown)

    // Start timing when the game actually mounts, if requested
    if (this.trackTime) {
      this._startTime = Date.now()
    }
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this._handleKeyDown)
  },
  methods: {
    onPhotoError(e) {
      applyFallbackOnError(e, this.fallbackAvatarUrl)
    },
    _normalizeName(s) {
      return (s || '').toString().trim().toLowerCase()
    },
    _levenshtein(a, b) {
      // Iterative DP; good enough for short first names.
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
            prev[j] + 1, // delete
            curr[j - 1] + 1, // insert
            prev[j - 1] + cost // substitute
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

      // Heuristic thresholds that work well for short first names.
      // Examples: jon↔john (1), sarah↔sara (1), steven↔stephen (2)
      const maxDistance = c.length <= 4 ? 1 : 2
      const distance = this._levenshtein(g, c)
      return distance > 0 && distance <= maxDistance
    },
    _handleKeyDown(e) {
      // In easy mode: allow numeric keys 1-4 to select the corresponding choice
      if (this.isEasyMode) {
        const key = e.key
        if (['1', '2', '3', '4'].includes(key)) {
          e.preventDefault()
          const idx = parseInt(key, 10) - 1
          const choice = this.currentChoices?.[idx]
          if (choice) {
            this.selectChoice(choice)
          }
          return
        }
      }

      if (e.key !== 'Enter') return
      // Prevent form submits / accidental behavior
      e.preventDefault()

      // In easy mode we require a choice to be selected before advancing
      if (this.isEasyMode && !this.hasSelectedChoice) return

      if (this.currentIndex < this.collegas.length - 1) {
        this.nextItem()
      } else {
        // last item -> submit
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
      // If time tracking is enabled, compute elapsed ms and add to the score object
      if (this.trackTime && this._startTime) {
        const elapsedMs = Date.now() - this._startTime
        score.elapsedMs = elapsedMs
        score.elapsed = msToHuman(elapsedMs)
      }
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
          const guess = (this.collegas[i].answer || '').toString().trim()
          const imgUrl = sanitizeUrl(this.collegas[i].link) || this.fallbackAvatarUrl
          wrongAnswers.push({
            name: this.collegas[i].firstName,
            imgUrl,
            guess,
            isClose: !this.isEasyMode && this._isReallyCloseGuess(guess, this.collegas[i].firstName)
          });
        }
      }

      return {
        mode: this.isEasyMode ? 'easy' : 'hard',
        scoreOutOf10: ((totalGoodAnswers / this.collegas.length) * 10).toFixed(1),
        totalGoodAnswers,
        wrongAnswers,
      };
    }
  }
};

// Helper to format ms to human readable string (mm:ss)
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
        <XmsLogoHomeLink />
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
            @error="onPhotoError"
        />
      </div>

      <div class="form">
        <template v-if="isEasyMode">
          <div class="choices" role="group" aria-label="Multiple choice answers">
            <button
              v-for="(choice, idx) in currentChoices"
              :key="choice"
              type="button"
              class="choice"
              :class="{ 'choice-selected': isChoiceSelected(choice) }"
              @click="selectChoice(choice)"
              :aria-label="`Choice ${idx + 1}: ${choice}`"
            >
              <span class="choice-index">{{ idx + 1 }}.</span>
              {{ choice }}
            </button>
          </div>
          <div class="hint">Multiple choice: pick the correct first name</div>
          <div class="shortcut">Press <kbd>1</kbd>–<kbd>4</kbd> to choose, then <kbd>Enter</kbd> to continue</div>
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
            :disabled="isEasyMode && !hasSelectedChoice"
        >
          Next
        </button>

        <button
            v-else
            class="btn btn-primary"
            @click="submitAnswers"
            :disabled="isEasyMode && !hasSelectedChoice"
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
  background: var(--pf-bg);
  font-family: Calibri, "Segoe UI", Arial, sans-serif;
  color: var(--pf-text);
}

/* Card */
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

.title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.2px;
}
.sub {
  margin-top: 4px;
  font-size: 0.95rem;
  color: var(--pf-muted);
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
  color: var(--pf-muted);
  font-size: 0.95rem;
}

/* Progress bar */
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
  background: var(--pf-accent); /* green theme */
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
  box-shadow: 0 10px 22px var(--pf-shadow-strong);
  background: var(--pf-surface-2);
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

.shortcut {
  width: min(360px, 100%);
  text-align: left;
  color: var(--pf-muted);
  font-size: 0.9rem;
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 6px;
}

.shortcut kbd {
  background: var(--pf-kbd-bg);
  border: 1px solid var(--pf-kbd-border);
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-family: inherit;
  box-shadow: inset 0 -1px 0 var(--pf-border-soft);
}

.choice-index {
  display: inline-block;
  width: 28px;
  margin-right: 6px;
  color: var(--pf-muted);
  font-weight: 700;
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
  border: 1px solid var(--pf-border-strong);
  background: var(--pf-input-bg);
  color: var(--pf-text);
  text-align: left;
  font-weight: 700;
  cursor: pointer;
}

.choice:hover {
  background: var(--pf-hover);
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
  color: var(--pf-muted);
  font-weight: 600;
}
</style>
