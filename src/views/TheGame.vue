<script>
export default {
  props: { collegas: Array },
  data() {
    return { currentIndex: 0 }
  },
  computed: {
    progressText() {
      return `${this.currentIndex + 1} / ${this.collegas.length}`
    },
    progressPercent() {
      return Math.round(((this.currentIndex + 1) / this.collegas.length) * 100)
    }
  },
  methods: {
    nextItem() {
      if (this.currentIndex < this.collegas.length - 1) this.currentIndex++
    },
    prevousItem() {
      if (this.currentIndex > 0) this.currentIndex--
    },
    submitAnswers() {
      const score = this.calculateScore()
      localStorage.setItem('gameScore', JSON.stringify(score))
      this.$router.push('/result')
    },
    calculateScore() {
      let totalGoodAnswers = 0
      let wrongAnswers = []

      for (let i = 0; i < this.collegas.length; i++) {
        if ((this.collegas[i].answer || '').trim() === (this.collegas[i].firstName || '').trim()) {
          totalGoodAnswers++
        } else {
          wrongAnswers.push({
            name: this.collegas[i].firstName,
            imgUrl: this.collegas[i].link
          })
        }
      }

      return {
        scoreOutOf10: ((totalGoodAnswers / this.collegas.length) * 10).toFixed(1),
        totalGoodAnswers,
        wrongAnswers
      }
    }
  }
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card xebia-card p-3 p-md-4">
        <div class="card-body">

          <div class="d-flex align-items-center justify-content-between mb-3">
            <div class="fw-semibold text-muted">Guess who this is</div>
            <div class="small text-muted">{{ progressText }}</div>
          </div>

          <div class="progress mb-4" style="height: 10px;">
            <div class="progress-bar" role="progressbar" :style="{ width: progressPercent + '%' }"></div>
          </div>

          <div class="text-center mb-3">
            <img
                :src="collegas[currentIndex].link"
                class="person-photo"
                @error="(e) => (e.target.src = '/fallback-photos/fallback.jpg')"
            />
          </div>

          <label class="form-label fw-semibold">Name</label>
          <input
              type="text"
              class="form-control form-control-lg mb-4"
              placeholder="Type the first name…"
              v-model="collegas[currentIndex].answer"
          />

          <div class="d-flex gap-2">
            <button
                class="btn btn-xebia-outline btn-lg flex-grow-1"
                :disabled="currentIndex === 0"
                @click="prevousItem"
            >
              Previous
            </button>

            <button
                v-if="currentIndex < collegas.length - 1"
                class="btn btn-xebia btn-lg flex-grow-1"
                @click="nextItem"
            >
              Next
            </button>

            <button
                v-else
                class="btn btn-xebia btn-lg flex-grow-1"
                @click="submitAnswers"
            >
              Finish
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Let Bootstrap do most work; keep scoped CSS minimal. */
</style>
