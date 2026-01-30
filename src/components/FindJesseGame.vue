<script>
export default {
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
        <div class="flex items-center xl:pr-[1.813rem]" style="opacity:1">
          <a href="/">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 85 29" class="w-[5.375rem]">
              <path fill="currentColor" fill-rule="evenodd" d="M44.695 15.768H33.012c.167 2.07 1.715 3.394 4.099 3.31 1.478 0 2.774-.62 3.471-1.817h3.667c-1.227 3.21-3.792 5.028-7.027 5.028-2.175 0-3.973-.747-5.479-2.268-1.366-1.45-2.175-3.465-2.175-5.408 0-2.057.697-3.874 2.05-5.324 1.478-1.564 3.402-2.437 5.395-2.437 2.482 0 4.782 1.268 6.33 3.338.906 1.324 1.352 2.887 1.352 4.831zm-11.64-2.761h7.96c-.544-1.944-1.966-3.014-4.113-3.014-1.729 0-3.36 1.197-3.848 3.014M49.838 2.57V8.47c1.31-1.07 2.747-1.493 4.517-1.45 1.924 0 3.68.62 5.033 1.943 1.631 1.45 2.496 3.592 2.496 5.733 0 2.323-.976 4.507-2.733 6.028-1.31 1.07-2.914 1.69-4.782 1.69-1.715 0-3.178-.493-4.53-1.563v1.197h-3.347V2.569zm4.293 7.774c-2.37 0-4.168 1.888-4.168 4.409 0 2.394 1.882 4.281 3.987 4.267 2.621 0 4.42-1.901 4.42-4.338 0-2.324-1.869-4.338-4.239-4.338M67.447 2.57h-3.234v3.267h3.234zm0 4.789h-3.234v14.69h3.234zM85 22.05h-3.2479999999999998v-1.817c-.808 1.52-2.286 2.14-4.53 2.14-4.28 0-7.515-3.31-7.515-7.718 0-2.07.697-3.958 2.05-5.408 1.477-1.564 3.22-2.268 5.395-2.268 2.119 0 3.625.69 4.614 2.14V7.36h3.235zm-7.709-11.762c-2.3 0-4.168 1.817-4.168 4.211 0 2.592 1.924 4.409 4.224 4.409 2.12 0 4.043-1.944 4.043-4.211 0-2.521-1.98-4.409-4.099-4.409" clip-rule="evenodd"></path>
              <path fill="currentColor" d="M.125 28.333h8.827L18.5 18.73l9.521 9.603h8.938l-13.99-14.11L37.085 0h-8.938L18.5 9.743 8.91 0H0l14.032 14.223z"></path>
            </svg>
          </a>
        </div>
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
