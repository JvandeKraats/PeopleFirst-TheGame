<script>
export default {
  props: {
    targets: {
      type: Array,
      default: () => []
    },
    allPeople: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIndex: 0,
      roundsByKey: {},
      selectedByIndex: {}
    }
  },
  computed: {
    hasEnoughPeople() {
      return (this.allPeople?.length ?? 0) >= 4 && (this.targets?.length ?? 0) >= 1
    },
    rounds() {
      if (!this.hasEnoughPeople) return []
      return (this.targets || []).map((t, idx) => this.getRound(idx, t))
    },
    progressText() {
      return `${this.currentIndex + 1} / ${this.rounds.length}`
    },
    progressPercent() {
      if (!this.rounds.length) return 0
      return Math.round(((this.currentIndex + 1) / this.rounds.length) * 100)
    },
    currentRound() {
      return this.rounds[this.currentIndex]
    },
    currentSelection() {
      return this.selectedByIndex[this.currentIndex] ?? null
    },
    canGoNext() {
      return !!this.currentSelection
    }
  },
  watch: {
    targets: {
      handler() {
        this.roundsByKey = {}
        this.selectedByIndex = {}
        this.currentIndex = 0
      },
      deep: false
    },
    allPeople: {
      handler() {
        this.roundsByKey = {}
        this.selectedByIndex = {}
        this.currentIndex = 0
      },
      deep: false
    }
  },
  methods: {
    shuffle(items) {
      const arr = items.slice()
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    },
    normalizeId(v) {
      if (v === null || v === undefined) return ''
      return v.toString()
    },
    getRound(index, target) {
      const key = this.normalizeId(target?.id || index)
      const cached = this.roundsByKey[key]
      if (cached) return cached

      const correctId = this.normalizeId(target?.id || index)
      const promptName = (target?.firstName || target?.name || '').trim()

      const pool = (this.allPeople || [])
        .filter(p => this.normalizeId(p?.id || '') !== correctId)
        .filter(p => (p?.link || '').trim())

      const picked = this.shuffle(pool).slice(0, 3)
      const options = this.shuffle([
        {
          id: correctId,
          link: target?.link,
          label: (target?.firstName || target?.name || '').trim()
        },
        ...picked.map(p => ({
          id: this.normalizeId(p?.id),
          link: p?.link,
          label: (p?.firstName || p?.name || '').trim()
        }))
      ])

      const round = {
        promptName,
        correctId,
        correctName: (target?.firstName || target?.name || '').trim(),
        correctLink: target?.link,
        options
      }

      this.roundsByKey[key] = round
      return round
    },
    select(option) {
      this.selectedByIndex[this.currentIndex] = this.normalizeId(option?.id)
    },
    isSelected(option) {
      return this.currentSelection === this.normalizeId(option?.id)
    },
    next() {
      if (this.currentIndex < this.rounds.length - 1) this.currentIndex++
    },
    prev() {
      if (this.currentIndex > 0) this.currentIndex--
    },
    submit() {
      const score = this.calculateScore()
      localStorage.setItem('gameScore', JSON.stringify(score))
      this.$router.push('/result')
    },
    calculateScore() {
      let totalGoodAnswers = 0
      const wrongAnswers = []

      for (let i = 0; i < this.rounds.length; i++) {
        const round = this.rounds[i]
        const selectedId = this.normalizeId(this.selectedByIndex[i])

        if (selectedId && selectedId === this.normalizeId(round.correctId)) {
          totalGoodAnswers++
        } else {
          wrongAnswers.push({
            name: round.correctName,
            imgUrl: round.correctLink
          })
        }
      }

      return {
        scoreOutOf10: ((totalGoodAnswers / this.rounds.length) * 10).toFixed(1),
        totalGoodAnswers,
        wrongAnswers
      }
    }
  }
}
</script>

<template>
  <main class="match-shell" v-if="hasEnoughPeople && currentRound">
    <section class="card">
      <header class="header">
        <div class="flex items-center xl:pr-[1.813rem]" style="opacity:1"><a href="/"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 85 29" class="w-[5.375rem]"><path fill="currentColor" fill-rule="evenodd" d="M44.695 15.768H33.012c.167 2.07 1.715 3.394 4.099 3.31 1.478 0 2.774-.62 3.471-1.817h3.667c-1.227 3.21-3.792 5.028-7.027 5.028-2.175 0-3.973-.747-5.479-2.268-1.366-1.45-2.175-3.465-2.175-5.408 0-2.057.697-3.874 2.05-5.324 1.478-1.564 3.402-2.437 5.395-2.437 2.482 0 4.782 1.268 6.33 3.338.906 1.324 1.352 2.887 1.352 4.831zm-11.64-2.761h7.96c-.544-1.944-1.966-3.014-4.113-3.014-1.729 0-3.36 1.197-3.848 3.014M49.838 2.57V8.47c1.31-1.07 2.747-1.493 4.517-1.45 1.924 0 3.68.62 5.033 1.943 1.631 1.45 2.496 3.592 2.496 5.733 0 2.323-.976 4.507-2.733 6.028-1.31 1.07-2.914 1.69-4.782 1.69-1.715 0-3.178-.493-4.53-1.563v1.197h-3.347V2.569zm4.293 7.774c-2.37 0-4.168 1.888-4.168 4.409 0 2.394 1.882 4.281 3.987 4.267 2.621 0 4.42-1.901 4.42-4.338 0-2.324-1.869-4.338-4.239-4.338M67.447 2.57h-3.234v3.267h3.234zm0 4.789h-3.234v14.69h3.234zM85 22.05h-3.2479999999999998v-1.817c-.808 1.52-2.286 2.14-4.53 2.14-4.28 0-7.515-3.31-7.515-7.718 0-2.07.697-3.958 2.05-5.408 1.477-1.564 3.22-2.268 5.395-2.268 2.119 0 3.625.69 4.614 2.14V7.36h3.235zm-7.709-11.762c-2.3 0-4.168 1.817-4.168 4.211 0 2.592 1.924 4.409 4.224 4.409 2.12 0 4.043-1.944 4.043-4.211 0-2.521-1.98-4.409-4.099-4.409" clip-rule="evenodd"></path><path fill="currentColor" d="M.125 28.333h8.827L18.5 18.73l9.521 9.603h8.938l-13.99-14.11L37.085 0h-8.938L18.5 9.743 8.91 0H0l14.032 14.223z"></path></svg></a></div>
      </header>

      <div class="meta">
        <div class="prompt">Match this name:</div>
        <div class="counter">{{ progressText }}</div>
      </div>

      <div class="name">
        {{ currentRound.promptName }}
      </div>

      <div class="progress" aria-hidden="true">
        <div class="bar" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="grid" role="group" aria-label="Picture choices">
        <button
          v-for="opt in currentRound.options"
          :key="opt.id"
          type="button"
          class="tile"
          :class="{ selected: isSelected(opt) }"
          @click="select(opt)"
        >
          <img
            class="img"
            :src="opt.link"
            :alt="opt.label ? `Photo of ${opt.label}` : 'Colleague photo'"
            loading="lazy"
            @error="(e) => (e.target.src = '/fallback-photos/fallback-avatar.png')"
          />
        </button>
      </div>

      <div class="actions">
        <button class="btn btn-secondary" :disabled="currentIndex === 0" @click="prev">
          Previous
        </button>

        <button
          v-if="currentIndex < rounds.length - 1"
          class="btn btn-primary"
          :disabled="!canGoNext"
          @click="next"
        >
          Next
        </button>

        <button
          v-else
          class="btn btn-primary"
          :disabled="!canGoNext"
          @click="submit"
        >
          Submit
        </button>
      </div>

      <div class="hint">Pick the photo that matches the name</div>
    </section>
  </main>

  <main class="match-shell" v-else>
    <section class="card">
      <div class="loading">Loading…</div>
      <div class="hint" v-if="(allPeople?.length ?? 0) < 4">Need at least 4 people to play.</div>
    </section>
  </main>
</template>

<style scoped>
.match-shell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  background: #ffffff;
  font-family: Calibri, "Segoe UI", Arial, sans-serif;
  color: #111;
}

.card {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.10);
}

.header {
  text-align: center;
  margin-bottom: 10px;
}

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
  color: rgba(0,0,0,0.55);
  font-size: 0.95rem;
}

.name {
  margin-top: 8px;
  font-size: 1.6rem;
  font-weight: 900;
  text-align: center;
}

.progress {
  height: 10px;
  background: rgba(0,0,0,0.08);
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0 14px;
}

.bar {
  height: 100%;
  width: 0%;
  background: #2ea44f;
  border-radius: 999px;
  transition: width 200ms ease;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 8px 0 16px;
}

.tile {
  padding: 0;
  border-radius: 14px;
  border: 2px solid rgba(0,0,0,0.10);
  background: #fff;
  cursor: pointer;
  overflow: hidden;
}

.tile:hover {
  filter: brightness(0.98);
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
  background: #f6f6f6;
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
  font-weight: 800;
  cursor: pointer;
  font-size: 1rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #2ea44f;
  color: #fff;
}

.btn-primary:hover {
  filter: brightness(0.95);
}

.btn-secondary {
  background: #fff;
  color: #111;
  border-color: rgba(0,0,0,0.18);
}

.btn-secondary:hover {
  background: rgba(0,0,0,0.03);
}

.hint {
  margin-top: 14px;
  text-align: center;
  color: rgba(0,0,0,0.55);
  font-size: 0.92rem;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 26px 6px;
  color: rgba(0,0,0,0.6);
  font-weight: 700;
}
</style>
