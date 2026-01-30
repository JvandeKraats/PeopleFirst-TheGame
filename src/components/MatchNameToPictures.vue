<script>
import XmsLogoHomeLink from './XmsLogoHomeLink.vue'

export default {
  components: {
    XmsLogoHomeLink
  },
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
    fallbackAvatarUrl() {
      return new URL('fallback-photos/fallback-avatar.png', import.meta.env.BASE_URL).href
    },
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
  mounted() {
    window.addEventListener('keydown', this._handleKeyDown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this._handleKeyDown)
  },
  methods: {
    onPhotoError(e) {
      if (e?.target) e.target.src = this.fallbackAvatarUrl
    },
    _sanitizeUrl(v) {
      const s = (v ?? '').toString().trim()
      const lower = s.toLowerCase()
      const lowerNoLeadingSlash = lower.replace(/^\/+/, '')
      if (!s || lower === 'undefined' || lower === 'null') return ''
      if (lowerNoLeadingSlash === 'undefined' || lowerNoLeadingSlash === 'null') return ''
      return s
    },
    _handleKeyDown(e) {
      const key = e?.key
      if (!this.hasEnoughPeople || !this.currentRound) return

      // Numeric shortcuts: 1-4 select corresponding tile
      if (['1', '2', '3', '4'].includes(key)) {
        const idx = parseInt(key, 10) - 1
        const option = this.currentRound?.options?.[idx]
        if (!option) return

        e.preventDefault()
        this.select(option)
        return
      }

      // Enter: advance once a selection exists
      if (key !== 'Enter') return
      e.preventDefault()
      if (!this.canGoNext) return

      if (this.currentIndex < this.rounds.length - 1) {
        this.next()
      } else {
        this.submit()
      }
    },
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
            imgUrl: this._sanitizeUrl(round.correctLink) || this.fallbackAvatarUrl
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
        <XmsLogoHomeLink />
      </header>

      <div class="meta">
        <div class="prompt">Match this name:</div>
        <div class="counter">{{ progressText }}</div>
      </div>

      <div class="name">
        {{ currentRound.promptName }}
      </div>

      <div class="explanation">
        You’ll see one name and four photos. Tap/click the matching photo — or use your keyboard (1–4) — then press Enter (or hit Next) to continue.
      </div>

      <div class="progress" aria-hidden="true">
        <div class="bar" :style="{ width: progressPercent + '%' }"></div>
      </div>

      <div class="grid" role="group" aria-label="Picture choices">
        <button
          v-for="(opt, idx) in currentRound.options"
          :key="opt.id"
          type="button"
          class="tile"
          :class="{ selected: isSelected(opt) }"
          @click="select(opt)"
        >
          <span class="tile-badge" aria-hidden="true">{{ idx + 1 }}</span>
          <img
            class="img"
            :src="opt.link"
            :alt="opt.label ? `Photo of ${opt.label}` : 'Colleague photo'"
            loading="lazy"
            @error="onPhotoError"
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

      <div class="hint">Tip: Use keys 1–4 to pick a photo</div>
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

.name {
  margin-top: 8px;
  font-size: 1.6rem;
  font-weight: 900;
  text-align: center;
}

.explanation {
  margin-top: 10px;
  text-align: center;
  color: var(--pf-muted);
  font-size: 0.92rem;
  font-weight: 600;
  line-height: 1.35;
}

.progress {
  height: 10px;
  background: var(--pf-border-soft);
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0 14px;
}

.bar {
  height: 100%;
  width: 0%;
  background: var(--pf-accent);
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
  border: 2px solid var(--pf-border);
  background: var(--pf-surface);
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.tile-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 0.9rem;
  background: var(--pf-surface);
  color: var(--pf-text);
  border: 1px solid var(--pf-border);
  box-shadow: 0 6px 18px var(--pf-shadow);
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
  background: var(--pf-surface-2);
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

.hint {
  margin-top: 14px;
  text-align: center;
  color: var(--pf-muted);
  font-size: 0.92rem;
  font-weight: 600;
}

.loading {
  text-align: center;
  padding: 26px 6px;
  color: var(--pf-muted);
  font-weight: 700;
}
</style>
