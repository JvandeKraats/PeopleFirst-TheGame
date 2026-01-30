<script>
import XmsLogoHomeLink from './XmsLogoHomeLink.vue'

export default {
  components: {
    XmsLogoHomeLink
  },
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
      this.$router.push('/bnl')
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
      this.$router.push('/bnl')
    }
  }
}
</script>

<template>
  <main class="result-shell" v-if="score">
    <section class="card">
      <header class="header">
        <XmsLogoHomeLink />
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
