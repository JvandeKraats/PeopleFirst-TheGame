<script>
export default {
  data() {
    return {
      score: null
    }
  },
  computed: {
    fallbackAvatarUrl() {
      return new URL('fallback-photos/fallback-avatar.png', import.meta.env.BASE_URL).href
    },
    personName() {
      return this.score?.person?.name || 'Unknown'
    },
    personImgUrl() {
      return this.score?.person?.imgUrl || this.fallbackAvatarUrl
    },
    attempts() {
      return this.score?.attempts || 0
    },
    guessedCorrectly() {
      return this.score?.guessedCorrectly || false
    },
    resultMessage() {
      if (!this.guessedCorrectly) {
        return "Didn't get it this time!"
      }
      
      const attempts = this.attempts
      if (attempts === 1) {
        return "Perfect! Recognized from pure silhouette!"
      } else if (attempts <= 3) {
        return "Great eye!"
      } else if (attempts <= 5) {
        return "You got there!"
      } else {
        return "Eventually found them!"
      }
    },
    resultClass() {
      if (!this.guessedCorrectly) return 'result-failure'
      if (this.attempts === 1) return 'result-perfect'
      if (this.attempts <= 3) return 'result-great'
      return 'result-good'
    }
  },
  methods: {
    onPhotoError(e) {
      if (e?.target) e.target.src = this.fallbackAvatarUrl
    },
    playAgain() {
      this.$router.push('/progressive-reveal')
    },
    goHome() {
      this.$router.push('/')
    }
  },
  created() {
    const stored = localStorage.getItem('gameScore')
    if (stored) {
      try {
        this.score = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse score:', e)
        this.score = null
      }
    }

    if (!this.score) {
      this.$router.push('/')
    }
  }
}
</script>

<template>
  <main class="result-shell" v-if="score">
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

      <div class="result-header">
        <h1 class="result-title">Who's that colleague?</h1>
      </div>

      <div class="score-card" :class="resultClass">
        <div class="score-main">
          <div class="score-number">{{ attempts }}</div>
          <div class="score-label">{{ attempts === 1 ? 'attempt' : 'attempts' }}</div>
        </div>
        <div class="score-message">{{ resultMessage }}</div>
      </div>

      <div class="person-section">
        <h2 class="section-title">The Colleague</h2>
        <div class="person-card">
          <img
            :src="personImgUrl"
            class="person-photo"
            :alt="`Photo of ${personName}`"
            @error="onPhotoError"
          />
          <div class="person-name">{{ personName }}</div>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" @click="playAgain">
          Play Again
        </button>
        <button class="btn btn-secondary" @click="goHome">
          Home
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.result-shell {
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
  margin-bottom: 20px;
}

.result-header {
  text-align: center;
  margin-bottom: 20px;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--pf-text);
}

.score-card {
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 24px;
  border: 2px solid var(--pf-border);
}

.result-perfect {
  background: rgba(46,164,79,0.12);
  border-color: rgba(46,164,79,0.4);
}

.result-great {
  background: rgba(46,164,79,0.08);
  border-color: rgba(46,164,79,0.3);
}

.result-good {
  background: rgba(46,164,79,0.05);
  border-color: rgba(46,164,79,0.2);
}

.result-failure {
  background: rgba(211,47,47,0.08);
  border-color: rgba(211,47,47,0.3);
}

.score-main {
  margin-bottom: 12px;
}

.score-number {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--pf-text);
}

.score-label {
  font-size: 1.1rem;
  color: var(--pf-muted);
  margin-top: 4px;
}

.score-message {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--pf-text);
}

.person-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--pf-text);
}

.person-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px;
  background: var(--pf-surface-2);
  border: 1px solid var(--pf-border-soft);
  border-radius: 12px;
}

.person-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(46,164,79,0.3);
  background: var(--pf-surface);
}

.person-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pf-text);
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
  .card {
    padding: 14px;
  }
  
  .score-number {
    font-size: 2.5rem;
  }
  
  .person-photo {
    width: 60px;
    height: 60px;
  }
}
</style>
