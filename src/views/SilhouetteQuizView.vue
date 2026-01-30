<script>
import SilhouetteQuizGame from '../components/SilhouetteQuizGame.vue'
import fallbackPeople from '../data/people-fallback.json'
import { batchCreateSilhouettes } from '../services/segmentationService'

function normalizePhotoUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = import.meta.env.BASE_URL
  if (url.startsWith('/')) return `${base}${url.slice(1)}`
  return new URL(url, base).href
}

export default {
  components: { SilhouetteQuizGame },
  data() {
    const jokeMessages = [
      'Uploading photos to NSA watchlist...',
      'Analyzing facial features for government database...',
      'Cross-referencing with FBI most wanted...',
      'Scanning for criminal records...',
      'Checking INTERPOL red notices...',
      'Verifying against witness protection program...',
      'Running through CIA facial recognition...',
      'Matching with airport security footage...',
      'Comparing with alien abduction reports...',
      'Searching for doppelgängers in 47 countries...',
      'Calculating probability of supervillain identities...',
      'Checking if anyone\'s ever worn a fake mustache...',
      'Analyzing for evidence of time travel...',
      'Determining if anyone\'s actually three kids in a trench coat...'
    ]
    const randomMessage = jokeMessages[Math.floor(Math.random() * jokeMessages.length)]
    
    return { 
      myList: [], 
      trackTime: false,
      isPreprocessing: true,
      preprocessingProgress: 0,
      preprocessingError: null,
      loadingMessage: randomMessage
    }
  },
  methods: {
    pickRandomTen(people) {
      const maxItems = Math.min(people.length, 10)
      const shuffled = people.slice().sort(() => Math.random() - 0.5)
      return shuffled.slice(0, maxItems)
    },
    mapToGameModel(p) {
      const firstName = (p.givenName || (p.displayName || '').split(' ')[0] || '').trim()
      return {
        id: p.id,
        name: p.displayName,
        firstName,
        answer: '',
        link: normalizePhotoUrl(p.photo || '/fallback-photos/fallback.jpg'),
        silhouetteUrl: null
      }
    },
    handleSubmit(score) {
      localStorage.setItem('gameScore', JSON.stringify(score))
      this.$router.push('/result')
    },
    async preprocessImages() {
      try {
        this.isPreprocessing = true
        this.preprocessingProgress = 0

        // Prepare images for batch processing
        const imagesToProcess = this.myList.map(person => ({
          id: person.id,
          imgUrl: person.link
        }))

        // Process all images
        const results = await batchCreateSilhouettes(
          imagesToProcess,
          (progress) => {
            this.preprocessingProgress = Math.round(progress * 100)
          }
        )

        // Attach silhouette URLs to people
        results.forEach(result => {
          const person = this.myList.find(p => p.id === result.id)
          if (person) {
            person.silhouetteUrl = result.silhouetteUrl || person.link
          }
        })

        this.isPreprocessing = false
      } catch (error) {
        console.error('[SilhouetteQuiz] Failed to preprocess images:', error)
        this.preprocessingError = error.message
        this.isPreprocessing = false
      }
    }
  },
  async created() {
    const people = fallbackPeople?.value ?? []
    this.myList = this.pickRandomTen(people).map(this.mapToGameModel)

    const timeFlag = this.$route?.query?.time
    this.trackTime = !!timeFlag

    // Pre-process images to create silhouettes
    await this.preprocessImages()
  }
}
</script>

<template>
  <div v-if="isPreprocessing" class="loading-screen">
    <div class="loading-card">
      <h2 class="loading-title">Creating Silhouettes...</h2>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: preprocessingProgress + '%' }"></div>
      </div>
      <div class="progress-text">{{ preprocessingProgress }}%</div>
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

  <SilhouetteQuizGame 
    v-else
    :collegas="myList" 
    :trackTime="trackTime"
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

.progress-bar {
  width: 100%;
  height: 12px;
  background: var(--pf-border-soft);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 12px;
}

.progress-fill {
  height: 100%;
  background: var(--pf-accent);
  border-radius: 999px;
  transition: width 300ms ease;
}

.progress-text {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--pf-text);
  margin-bottom: 12px;
}

.loading-hint {
  font-size: 0.95rem;
  color: var(--pf-muted);
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
