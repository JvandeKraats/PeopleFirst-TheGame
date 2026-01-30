<template>
  <main class="game-shell">
    <section class="card">
        <header class="header">
        <div class="flex items-center xl:pr-[1.813rem]" style="opacity:1"><router-link to="/" aria-label="Home"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 85 29" class="w-[5.375rem]"><path fill="currentColor" fill-rule="evenodd" d="M44.695 15.768H33.012c.167 2.07 1.715 3.394 4.099 3.31 1.478 0 2.774-.62 3.471-1.817h3.667c-1.227 3.21-3.792 5.028-7.027 5.028-2.175 0-3.973-.747-5.479-2.268-1.366-1.45-2.175-3.465-2.175-5.408 0-2.057.697-3.874 2.05-5.324 1.478-1.564 3.402-2.437 5.395-2.437 2.482 0 4.782 1.268 6.33 3.338.906 1.324 1.352 2.887 1.352 4.831zm-11.64-2.761h7.96c-.544-1.944-1.966-3.014-4.113-3.014-1.729 0-3.36 1.197-3.848 3.014M49.838 2.57V8.47c1.31-1.07 2.747-1.493 4.517-1.45 1.924 0 3.68.62 5.033 1.943 1.631 1.45 2.496 3.592 2.496 5.733 0 2.323-.976 4.507-2.733 6.028-1.31 1.07-2.914 1.69-4.782 1.69-1.715 0-3.178-.493-4.53-1.563v1.197h-3.347V2.569zm4.293 7.774c-2.37 0-4.168 1.888-4.168 4.409 0 2.394 1.882 4.281 3.987 4.267 2.621 0 4.42-1.901 4.42-4.338 0-2.324-1.869-4.338-4.239-4.338M67.447 2.57h-3.234v3.267h3.234zm0 4.789h-3.234v14.69h3.234zM85 22.05h-3.2479999999999998v-1.817c-.808 1.52-2.286 2.14-4.53 2.14-4.28 0-7.515-3.31-7.515-7.718 0-2.07.697-3.958 2.05-5.408 1.477-1.564 3.22-2.268 5.395-2.268 2.119 0 3.625.69 4.614 2.14V7.36h3.235zm-7.709-11.762c-2.3 0-4.168 1.817-4.168 4.211 0 2.592 1.924 4.409 4.224 4.409 2.12 0 4.043-1.944 4.043-4.211 0-2.521-1.98-4.409-4.099-4.409" clip-rule="evenodd"></path><path fill="currentColor" d="M.125 28.333h8.827L18.5 18.73l9.521 9.603h8.938l-13.99-14.11L37.085 0h-8.938L18.5 9.743 8.91 0H0l14.032 14.223z"></path></svg></router-link></div>
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
import fallbackPeople from '../data/people-fallback.json'

function normalizePhotoUrl(url) {
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  const base = import.meta.env.BASE_URL
  if (url.startsWith('/')) return `${base}${url.slice(1)}`
  return new URL(url, base).href
}

export default {
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
