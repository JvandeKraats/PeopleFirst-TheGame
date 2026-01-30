<script>
export default {
  props: {
    person: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      answer: '',
      attempts: 0,
      clipPathSteps: [
        'circle(0% at 50% 50%)',  // Step 0: Nothing visible (pure silhouette)
        'circle(15% at 30% 30%)',  // Step 1: Small circle in top-left
        'polygon(0% 0%, 100% 0%, 100% 30%, 0% 30%)',  // Step 2: Top 30%
        'polygon(0% 0%, 100% 0%, 100% 50%, 0% 50%)',  // Step 3: Top half
        'polygon(0% 0%, 100% 0%, 100% 75%, 0% 75%)',  // Step 4: Top 75%
        'circle(100% at 50% 50%)'  // Step 5: Full image
      ],
      currentStepIndex: 0,
      isCorrect: false,
      showingResult: false,
      currentImageUrl: null
    };
  },
  computed: {
    fallbackAvatarUrl() {
      return new URL('fallback-photos/fallback-avatar.png', import.meta.env.BASE_URL).href
    },
    currentBrightness() {
      return this.clipPathSteps[this.currentStepIndex]
    },
    displayImageUrl() {
      // Always show the original photo
      return this.person.link
    },
    silhouetteImageUrl() {
      return this.person.silhouetteUrl || this.person.link
    },
    imageStyle() {
      if (this.showingResult) {
        return { filter: 'none' }
      }
      // At step 0 (brightness 0), show pure silhouette (no original)
      // At step 5 (brightness 1.0), show full original photo
      // Progressive steps blend from silhouette to original
      return {
        filter: 'none'
      }
    },
    overlayStyle() {
      // Control which portion of the original photo is visible
      if (this.showingResult) {
        return { 
          clipPath: 'circle(100% at 50% 50%)',
          opacity: 1
        }
      }
      return {
        clipPath: this.currentBrightness,
        opacity: 1
      }
    },
    attemptsText() {
      if (this.attempts === 0) return 'No attempts yet'
      if (this.attempts === 1) return '1 attempt'
      return `${this.attempts} attempts`
    },
    canRevealMore() {
      return this.currentStepIndex < this.clipPathSteps.length - 1
    }
  },
  mounted() {
    // Start with silhouette
    this.currentImageUrl = this.person.silhouetteUrl || this.person.link
  },
  methods: {
    onPhotoError(e) {
      if (e?.target) e.target.src = this.fallbackAvatarUrl
    },
    _normalizeName(s) {
      return (s || '').toString().trim().toLowerCase()
    },
    checkAnswer() {
      this.attempts++
      
      const guess = this._normalizeName(this.answer)
      const correct = this._normalizeName(this.person.firstName)
      
      if (guess === correct) {
        this.isCorrect = true
        this.showingResult = true
        setTimeout(() => {
          this.submitResult()
        }, 1500)
      } else {
        // Wrong answer - reveal more if possible
        if (this.canRevealMore) {
          this.currentStepIndex++
          this.answer = '' // Clear input for next attempt
        } else {
          // Already at full reveal, still wrong
          this.showingResult = true
          setTimeout(() => {
            this.submitResult()
          }, 2000)
        }
      }
    },
    submitResult() {
      const score = {
        attempts: this.attempts,
        guessedCorrectly: this.isCorrect,
        person: {
          name: this.person.firstName,
          fullName: this.person.name,
          imgUrl: this.person.link || this.fallbackAvatarUrl
        }
      }
      this.$emit('submit', score)
    }
  }
};
</script>

<template>
  <main class="game-shell">
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
        <div class="counter">{{ attemptsText }}</div>
      </div>

      <div class="photo-wrap">
        <!-- Base layer: Silhouette (always visible) -->
        <img
            :src="silhouetteImageUrl"
            class="photo photo-silhouette"
            alt="Colleague silhouette"
            @error="onPhotoError"
        />
        <!-- Top layer: Original photo (fades in with opacity) -->
        <img
            :src="displayImageUrl"
            class="photo photo-original"
            :class="{ 'revealed': showingResult }"
            :style="overlayStyle"
            alt="Colleague photo"
            @error="onPhotoError"
        />
      </div>

      <div v-if="showingResult" class="result-message">
        <div v-if="isCorrect" class="success">
          ✓ Correct! It's {{ person.firstName }}
        </div>
        <div v-else class="failure">
          ✗ It was {{ person.firstName }}
        </div>
      </div>

      <div v-if="!showingResult" class="form">
        <label class="label" for="answer">First name</label>
        <input
            id="answer"
            name="answer"
            type="text"
            class="input"
            placeholder="Guess from the photo…"
            autocomplete="off"
            v-model="answer"
            @keydown.enter="checkAnswer"
            :disabled="showingResult"
        />
        <div class="hint">
          Wrong guesses reveal more of the photo ({{ clipPathSteps.length }} steps total)
        </div>
      </div>

      <div v-if="!showingResult" class="actions">
        <button
            class="btn btn-primary"
            @click="checkAnswer"
            :disabled="!answer.trim() || showingResult"
        >
          Submit Guess
        </button>
      </div>
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
  min-height: 100vh;
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
  margin-bottom: 16px;
}
.prompt {
  font-weight: 700;
  font-size: 1.1rem;
}
.counter {
  color: var(--pf-muted);
  font-size: 0.95rem;
}

.photo-wrap {
  position: relative;
  margin: 8px 0 20px;
  padding: 60px;
  min-height: 400px;
  background-image: url('/assets/pokemon_bg.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  box-shadow: 0 10px 28px var(--pf-shadow-strong);
}
.photo {
  width: 280px;
  height: 280px;
  object-fit: cover;
  border-radius: 50%;
  border: 5px solid #ffd700;
  box-shadow: 
    0 0 0 3px rgba(0,0,0,0.4),
    0 10px 30px rgba(0,0,0,0.6);
  background: var(--pf-surface-2);
  position: relative;
  z-index: 2;
}

.photo-silhouette {
  /* Base layer - always visible */
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
}

.photo-original {
  /* Top layer - fades in with opacity */
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  transition: clip-path 600ms ease;
}

.photo.revealed {
  animation: reveal 600ms ease-out;
}

@keyframes reveal {
  from {
    transform: translateY(-50%) scale(0.95);
    opacity: 0.8;
  }
  to {
    transform: translateY(-50%) scale(1);
    opacity: 1;
  }
}

.result-message {
  text-align: center;
  margin: 16px 0;
  padding: 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
}

.success {
  color: var(--pf-accent);
  background: rgba(46,164,79,0.1);
  border: 1px solid rgba(46,164,79,0.3);
}

.failure {
  color: var(--pf-danger);
  background: rgba(211,47,47,0.1);
  border: 1px solid rgba(211,47,47,0.3);
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
.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hint {
  width: min(360px, 100%);
  text-align: left;
  color: var(--pf-muted);
  font-size: 0.9rem;
}

.actions {
  display: grid;
  grid-template-columns: 1fr;
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
.btn-primary:hover:not(:disabled) {
  filter: brightness(0.95);
}

@media (max-width: 360px) {
  .photo {
    width: 240px;
    height: 240px;
  }
  .card {
    padding: 14px;
  }
}
</style>
