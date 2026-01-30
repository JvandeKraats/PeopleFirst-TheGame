<script>
import XmsLogoHomeLink from './XmsLogoHomeLink.vue'

export default {
  components: {
    XmsLogoHomeLink
  },
  props: {
    collegas: {
      type: Array,
      required: true
    },
    gridSize: {
      type: Number,
      default: 3
    },
    jesseCount: {
      type: Number,
      required: true
    },
    refreshesRemaining: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      selectedIds: new Set()
    };
  },
  methods: {
    toggleSelection(person) {
      if (this.selectedIds.has(person.id)) {
        this.selectedIds.delete(person.id);
      } else {
        this.selectedIds.add(person.id);
      }
      // Force reactivity update
      this.selectedIds = new Set(this.selectedIds);
    },
    isSelected(person) {
      return this.selectedIds.has(person.id);
    },
    handleRefresh() {
      this.selectedIds.clear();
      this.$emit('refresh');
    },
    handleVerify() {
      const jesseIds = this.collegas
        .filter(p => p.isJesse)
        .map(p => p.id);
      
      const selectedArray = Array.from(this.selectedIds);
      const correctSelections = selectedArray.filter(id => jesseIds.includes(id)).length;
      const falsePositiveIds = selectedArray.filter(id => !jesseIds.includes(id));
      const missedJesseIds = jesseIds.filter(id => !this.selectedIds.has(id));
      
      // Calculate true negatives: non-Jesses that were correctly NOT selected
      const nonJesseIds = this.collegas.filter(p => !p.isJesse).map(p => p.id);
      const trueNegatives = nonJesseIds.filter(id => !this.selectedIds.has(id)).length;
      
      // Total correct = true positives + true negatives
      const totalCorrect = correctSelections + trueNegatives;
      
      // Calculate score: (truePositives/jesseCount - falsePositives/totalTiles) × 10
      const totalTiles = this.collegas.length;
      const rawScore = ((correctSelections / this.jesseCount) - (falsePositiveIds.length / totalTiles)) * 10;
      const scoreOutOf10 = Math.max(0, Math.min(10, rawScore)).toFixed(1);
      
      // Build separate arrays for missed Jesses and false positives
      const missedJesses = [];
      missedJesseIds.forEach(id => {
        const person = this.collegas.find(p => p.id === id);
        if (person) {
          missedJesses.push({
            name: person.firstName,
            imgUrl: person.link
          });
        }
      });
      
      const falsePositives = [];
      falsePositiveIds.forEach(id => {
        const person = this.collegas.find(p => p.id === id);
        if (person) {
          falsePositives.push({
            name: person.firstName,
            imgUrl: person.link
          });
        }
      });
      
      this.$emit('submit', {
        scoreOutOf10,
        totalGoodAnswers: totalCorrect,
        totalTiles,
        missedJesses,
        falsePositives,
        // Keep wrongAnswers for backward compatibility with regular game modes
        wrongAnswers: [...falsePositives, ...missedJesses]
      });
    }
  }
};
</script>

<template>
  <main class="game-shell">
    <section class="card">
      <header class="header">
        <XmsLogoHomeLink />
      </header>

      <div class="meta">
        <div class="prompt">Select all squares with <strong>Jesse</strong></div>
        <div class="counter">Refreshes: {{ refreshesRemaining }}</div>
      </div>

      <div class="explanation">
        Tap/click all the photos that are Jesse, then press Verify.
      </div>

      <div class="grid" :style="{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }" role="group" aria-label="Photo grid">
        <button
          v-for="person in collegas"
          :key="person.id"
          type="button"
          class="tile"
          :class="{ selected: isSelected(person) }"
          @click="toggleSelection(person)"
          :aria-pressed="isSelected(person)"
        >
          <img
            :src="person.link"
            :alt="`Colleague photo`"
            class="img"
            @error="(e) => (e.target.src = '/fallback-photos/fallback-avatar.png')"
          />
          <div v-if="isSelected(person)" class="checkmark">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
            </svg>
          </div>
        </button>
      </div>

      <div class="actions">
        <button 
          class="btn btn-secondary refresh-btn" 
          @click="handleRefresh"
          :disabled="refreshesRemaining === 0"
        >
          <span class="refresh-icon">↻</span>
          <span v-if="refreshesRemaining > 0">Refresh ({{ refreshesRemaining }})</span>
          <span v-else>No refreshes left</span>
        </button>
        <button class="btn btn-primary" @click="handleVerify">
          Verify
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Match the look/feel of other modes (TheGame / MatchNameToPictures) */
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
  margin-bottom: 10px;
}

.header :deep(a:active svg) {
  color: var(--pf-logo-active);
}

.header a {
  display: inline-block;
}

.header svg {
  width: 5.375rem;
  height: auto;
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
  font-weight: 800;
}

.counter {
  color: var(--pf-muted);
  font-size: 0.95rem;
}

.prompt strong {
  font-weight: 900;
  color: var(--pf-accent);
}

.explanation {
  margin-top: 10px;
  text-align: center;
  color: var(--pf-muted);
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.35;
}

/* Grid / tiles (match MatchNameToPictures) */
.grid {
  display: grid;
  gap: 12px;
  margin: 12px 0 16px;
}

.tile {
  padding: 0;
  border-radius: 14px;
  border: 2px solid var(--pf-border);
  background: var(--pf-surface);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  transition: filter 150ms ease, box-shadow 150ms ease;
}

.tile:hover {
  filter: brightness(0.98);
}

.tile:focus-visible {
  outline: 3px solid rgba(46, 164, 79, 0.55);
  outline-offset: 3px;
}

.tile.selected {
  border-color: rgba(46,164,79,0.9);
  box-shadow: 0 0 0 4px rgba(46,164,79,0.18);
}

.img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
  background: var(--pf-surface-2);
}

.checkmark {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  background: var(--pf-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px var(--pf-shadow);
  border: 2px solid var(--pf-surface);
}

.checkmark svg {
  width: 18px;
  height: 18px;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 0;
}

.btn {
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 150ms ease;
}

.btn:focus-visible {
  outline: 3px solid rgba(46, 164, 79, 0.55);
  outline-offset: 2px;
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
  border: 1px solid var(--pf-border-strong);
}

.btn-secondary:hover {
  background: var(--pf-hover);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--pf-surface-2);
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.refresh-icon {
  font-size: 1.2rem;
  line-height: 1;
}
</style>
