<template>
  <main class="game-shell">
    <section class="card">
      <header class="header">
        <XmsLogoHomeLink />
      </header>
      <div class="game-description">
        <p>Match pairs of names and photos! Click cards to reveal them, and find matching pairs. Win by matching all 10 people!</p>
      </div>

      <div v-if="gameWon" class="win-screen">
        <h3>🎉 Congratulations! You won! 🎉</h3>
        <p>You matched all pairs!</p>
        <button @click="resetGame" class="btn btn-primary">Play Again</button>
        <button @click="$emit('return-to-main')" class="btn btn-secondary ml-3">Return to Main Page</button>
      </div>

      <div v-else class="game-board">
        <div class="memory-grid">
          <div
            v-for="(card, index) in cards"
            :key="index"
            class="memory-card"
            :class="{
              'flipped': card.flipped,
              'matched': card.matched,
              'disabled': isChecking || card.matched
            }"
            @click="flipCard(index)"
          >
            <div class="card-inner">
              <div class="card-front">?</div>
              <div class="card-back">
                <img v-if="card.type === 'photo'" :src="card.content" :alt="card.personName" />
                <p v-else class="card-name">{{ card.content }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="game-actions">
          <button @click="resetGame" class="btn btn-secondary">Reset Game</button>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import confetti from 'canvas-confetti'
import fallbackPeople from '../data/people-fallback.json'
import XmsLogoHomeLink from './XmsLogoHomeLink.vue'

function normalizePhotoUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = import.meta.env.BASE_URL
  if (url.startsWith('/')) return `${base}${url.slice(1)}`
  return new URL(url, base).href
}

export default {
  components: {
    XmsLogoHomeLink
  },
  emits: ['return-to-main'],
  data() {
    return {
      people: [],
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      isChecking: false,
      gameWon: false,
    }
  },
  mounted() {
    this.startGame()
  },
  methods: {
    async loadPeopleData() {
      try {
        const data = fallbackPeople?.value ?? fallbackPeople
        this.people = (data || []).map(p => ({
          ...p,
          photo: normalizePhotoUrl(p.photo)
        }))
      } catch (error) {
        console.error('Error loading people data:', error)
        this.people = []
      }
    },

    getRandomPeople(count) {
      const shuffled = [...this.people].sort(() => Math.random() - 0.5)
      return shuffled.slice(0, count)
    },

    createCards() {
      const selectedPeople = this.getRandomPeople(10)
      const cards = []

      selectedPeople.forEach(person => {
        cards.push({
          id: person.id,
          type: 'name',
          content: person.displayName,
          personId: person.id,
          personName: person.displayName,
          flipped: false,
          matched: false,
        })

        cards.push({
          id: `${person.id}-photo`,
          type: 'photo',
          content: person.photo,
          personId: person.id,
          personName: person.displayName,
          flipped: false,
          matched: false,
        })
      })

      return cards.sort(() => Math.random() - 0.5)
    },

    async startGame() {
      await this.loadPeopleData()
      this.cards = this.createCards()
      this.gameWon = false
      this.matchedPairs = 0
      this.flippedCards = []
    },

    flipCard(index) {
      const card = this.cards[index]

      if (card.flipped || card.matched || this.isChecking) {
        return
      }

      if (this.flippedCards.length >= 2) {
        return
      }

      card.flipped = true
      this.flippedCards.push(index)

      if (this.flippedCards.length === 2) {
        this.checkMatch()
      }
    },

    checkMatch() {
      this.isChecking = true
      const [firstIndex, secondIndex] = this.flippedCards
      const firstCard = this.cards[firstIndex]
      const secondCard = this.cards[secondIndex]

      setTimeout(() => {
        if (firstCard.personId === secondCard.personId && firstCard.type !== secondCard.type) {
          firstCard.matched = true
          secondCard.matched = true
          this.matchedPairs++

          if (this.matchedPairs === 10) {
            this.gameWon = true
            // Trigger confetti celebration
            setTimeout(() => this.celebrateWin(), 200)
          }
        } else {
          firstCard.flipped = false
          secondCard.flipped = false
        }

        this.flippedCards = []
        this.isChecking = false
      }, 800)
    },

    resetGame() {
      this.cards = this.createCards()
      this.flippedCards = []
      this.matchedPairs = 0
      this.gameWon = false
      this.isChecking = false
    },

    celebrateWin() {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 }
      };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    },
  },
}
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 10px;
}

.header a:active svg {
  color: #ff8c00;
}

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
  max-width: 900px;
  background: var(--pf-surface);
  border: 1px solid var(--pf-border-soft);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 28px var(--pf-shadow);
  overflow: hidden;
}

.game-description {
  margin-bottom: 20px;
  padding: 15px 20px;
  background: #f5f5f5;
  border-radius: 8px;
  border-left: 4px solid #764ba2;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.game-description p {
  margin: 0;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.5;
}

.win-screen {
  padding: 40px;
}

.win-screen h3 {
  font-size: 2.5rem;
  color: #28a745;
  margin-bottom: 20px;
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 15px;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.memory-card {
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
  min-height: 120px;
}

.memory-card.disabled {
  cursor: not-allowed;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.memory-card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 10px;
}

.card-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 3rem;
  font-weight: bold;
}

.card-back {
  background: white;
  transform: rotateY(180deg);
  overflow: hidden;
}

.card-back img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.card-name {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  word-wrap: break-word;
  padding: 10px;
  margin: 0;
}

.memory-card.matched .card-front,
.memory-card.matched .card-back {
  background: #e0e0e0;
  opacity: 0.6;
}

.memory-card.matched {
  cursor: default;
}

.btn {
  padding: 12px 30px;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.mt-3 {
  margin-top: 20px;
}

.ml-3 {
  margin-left: 15px;
}

.game-actions {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .memory-grid {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 10px;
  }

  .card {
    min-height: 80px;
  }

  .card-name {
    font-size: 0.8rem;
  }
}
</style>
