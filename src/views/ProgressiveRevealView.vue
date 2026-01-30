<script>
import ProgressiveRevealGame from '../components/ProgressiveRevealGame.vue'
import fallbackPeople from '../data/people-fallback.json'
import { createSilhouette } from '../services/segmentationService'

function normalizePhotoUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = import.meta.env.BASE_URL
  if (url.startsWith('/')) return `${base}${url.slice(1)}`
  return new URL(url, base).href
}

export default {
  components: { ProgressiveRevealGame },
  data() {
    const jokeMessages = [
      'Uploading photo to NSA watchlist...',
      'Analyzing facial features for government database...',
      'Cross-referencing with FBI most wanted...',
      'Scanning for criminal record...',
      'Checking INTERPOL red notices...',
      'Verifying against witness protection program...',
      'Running through CIA facial recognition...',
      'Matching with airport security footage...',
      'Comparing with alien abduction reports...',
      'Searching for doppelgängers in 47 countries...',
      'Calculating probability of supervillain identity...',
      'Checking if they\'ve ever worn a fake mustache...',
      'Analyzing for evidence of time travel...',
      'Determining if they\'re actually three kids in a trench coat...'
    ]
    const randomMessage = jokeMessages[Math.floor(Math.random() * jokeMessages.length)]
    
    return { 
      selectedPerson: null,
      isPreprocessing: true,
      preprocessingError: null,
      loadingMessage: randomMessage
    }
  },
  methods: {
    pickRandomOne(people) {
      const shuffled = people.slice().sort(() => Math.random() - 0.5)
      return shuffled[0]
    },
    mapToGameModel(p) {
      const firstName = (p.givenName || (p.displayName || '').split(' ')[0] || '').trim()
      return {
        id: p.id,
        name: p.displayName,
        firstName,
        link: normalizePhotoUrl(p.photo || '/fallback-photos/fallback.jpg'),
        silhouetteUrl: null
      }
    },
    handleSubmit(score) {
      localStorage.setItem('gameScore', JSON.stringify(score))
      this.$router.push('/progressive-reveal-result')
    },
    async preprocessImage() {
      try {
        this.isPreprocessing = true

        // Load image
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = this.selectedPerson.link
        await img.decode()

        // Create silhouette
        this.selectedPerson.silhouetteUrl = await createSilhouette(img)
        
        this.isPreprocessing = false
      } catch (error) {
        console.error('Failed to create silhouette:', error)
        this.preprocessingError = error.message
        this.isPreprocessing = false
      }
    }
  },
  async created() {
    const people = fallbackPeople?.value ?? []
    const randomPerson = this.pickRandomOne(people)
    this.selectedPerson = this.mapToGameModel(randomPerson)

    // Create silhouette
    await this.preprocessImage()
  }
}
</script>

<template>
  <div v-if="isPreprocessing" class="loading-screen">
    <div class="loading-card">
      <h2 class="loading-title">Creating Silhouette...</h2>
      <div class="loading-spinner"></div>
      <div class="loading-hint">{{ loadingMessage }}</div>
    </div>
  </div>

  <div v-else-if="preprocessingError" class="error-screen">
    <div class="error-card">
      <h2 class="error-title">Failed to Load</h2>
      <p class="error-message">{{ preprocessingError }}</p>
      <button class="btn btn-primary" @click="$router.push('/')">Go Home</button>
    </div>
  </div>

  <ProgressiveRevealGame 
    v-else-if="selectedPerson"
    :person="selectedPerson"
    @submit="handleSubmit"
  />
</template>

<style scoped>
.loading-screen,
.error-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 18px;
  background: var(--pf-bg);
  font-family: Calibri, "Segoe UI", Arial, sans-serif;
  color: var(--pf-text);
}

.loading-card,
.error-card {
  width: 100%;
  max-width: 420px;
  background: var(--pf-surface);
  border: 1px solid var(--pf-border-soft);
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 10px 28px var(--pf-shadow);
  text-align: center;
}

.loading-title,
.error-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--pf-text);
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 20px auto;
  border: 4px solid var(--pf-border-soft);
  border-top-color: var(--pf-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-hint {
  font-size: 0.95rem;
  color: var(--pf-muted);
  margin-top: 16px;
}

.error-message {
  color: var(--pf-muted);
  margin-bottom: 20px;
  font-size: 1rem;
}

.btn {
  padding: 12px 24px;
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
</style>
