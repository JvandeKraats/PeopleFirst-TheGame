<template>
  <div class="memory-game-container">
    <h2>Memory Game</h2>

    <div v-if="!gameStarted" class="start-screen">
      <button @click="startGame" class="btn btn-primary">Start Game</button>
    </div>

    <div v-else-if="gameWon" class="win-screen">
      <h3>🎉 Congratulations! You won! 🎉</h3>
      <p>You matched all pairs!</p>
      <button @click="resetGame" class="btn btn-primary">Play Again</button>
    </div>

    <div v-else class="game-board">
      <div class="memory-grid">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="card"
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
      <button @click="resetGame" class="btn btn-secondary mt-3">Reset Game</button>
    </div>
  </div>
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
  data() {
    return {
      people: [],
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      isChecking: false,
      gameStarted: false,
      gameWon: false,
    };
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
        console.error('Error loading people data:', error);
        this.people = [];
      }
    },

    getRandomPeople(count) {
      const shuffled = [...this.people].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    },

    createCards() {
      const selectedPeople = this.getRandomPeople(10);
      const cards = [];

      // Create name and photo cards for each person
      selectedPeople.forEach(person => {
        cards.push({
          id: person.id,
          type: 'name',
          content: person.displayName,
          personId: person.id,
          personName: person.displayName,
          flipped: false,
          matched: false,
        });

        cards.push({
          id: `${person.id}-photo`,
          type: 'photo',
          content: person.photo,
          personId: person.id,
          personName: person.displayName,
          flipped: false,
          matched: false,
        });
      });

      // Shuffle cards
      return cards.sort(() => Math.random() - 0.5);
    },

    async startGame() {
      await this.loadPeopleData();
      this.cards = this.createCards();
      this.gameStarted = true;
      this.gameWon = false;
      this.matchedPairs = 0;
      this.flippedCards = [];
    },

    flipCard(index) {
      const card = this.cards[index];

      // Don't flip if card is already flipped, matched, or we're checking
      if (card.flipped || card.matched || this.isChecking) {
        return;
      }

      // Don't allow more than 2 cards to be flipped
      if (this.flippedCards.length >= 2) {
        return;
      }

      // Flip the card
      card.flipped = true;
      this.flippedCards.push(index);

      // Check for match when 2 cards are flipped
      if (this.flippedCards.length === 2) {
        this.checkMatch();
      }
    },

    checkMatch() {
      this.isChecking = true;
      const [firstIndex, secondIndex] = this.flippedCards;
      const firstCard = this.cards[firstIndex];
      const secondCard = this.cards[secondIndex];

      setTimeout(() => {
        if (firstCard.personId === secondCard.personId && firstCard.type !== secondCard.type) {
          // It's a match!
          firstCard.matched = true;
          secondCard.matched = true;
          this.matchedPairs++;

          // Check if game is won
          if (this.matchedPairs === 10) {
            this.gameWon = true;
          }
        } else {
          // Not a match, flip cards back
          firstCard.flipped = false;
          secondCard.flipped = false;
        }

        this.flippedCards = [];
        this.isChecking = false;
      }, 800);
    },

    resetGame() {
      this.cards = this.createCards();
      this.flippedCards = [];
      this.matchedPairs = 0;
      this.gameWon = false;
      this.isChecking = false;
    },
  },
};
</script>

<style scoped>
.memory-game-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: #333;
}

.start-screen,
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

.card {
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
  min-height: 120px;
}

.card.disabled {
  cursor: not-allowed;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.card.flipped .card-inner {
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

.card.matched .card-front,
.card.matched .card-back {
  background: #e0e0e0;
  opacity: 0.6;
}

.card.matched {
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
