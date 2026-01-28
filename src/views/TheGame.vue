<!--
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
      if (this.currentIndex > 0) this.currentIndex&#45;&#45;
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
  <main class="game-page" v-if="collegas && collegas.length">
    <div class="row g-0 justify-content-center w-100">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card xebia-card p-3 p-md-4">
          <div class="card-body">

            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="fw-semibold text-muted">Guess who this is</div>
              <div class="small text-muted">{{ progressText }}</div>
            </div>

            <div class="progress mb-4" style="height: 10px;">
              <div class="progress-bar xebia-progress" role="progressbar" :style="{ width: progressPercent + '%' }"></div>
            </div>

            <div class="text-center mb-3">
              <img
                  :src="collegas[currentIndex].link"
                  class="person-photo"
                  @error="(e) => (e.target.src = '/fallback-photos/fallback.jpg')"
              />
            </div>

            <div class="answer-block">
              <label class="answer-label" for="answer">Name</label>

              <input
                  id="answer"
                  name="answer"
                  type="text"
                  class="form-control form-control-lg answer-input w-100"
                  placeholder="Type the first name…"
                  autocomplete="off"
                  v-model="collegas[currentIndex].answer"
              />
            </div>

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
  </main>

  <main class="game-page" v-else>
    <div class="text-muted">Loading…</div>
  </main>
</template>

<style scoped>
/* Full-page centering (this is what you were missing) */
.game-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #fff;
}

/* Card should look clean + not too “Bootstrapy” */
.xebia-card {
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 12px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.10);
  background: #fff;
}

/* Photo: consistent size, circular, premium */
.person-photo {
  width: 260px;
  height: 260px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(46, 164, 79, 0.18);
  box-shadow: 0 10px 22px rgba(0,0,0,0.12);
}

/* On small phones: reduce photo slightly so it doesn’t push everything */
@media (max-width: 360px) {
  .person-photo {
    width: 220px;
    height: 220px;
  }
}

/* Progress bar uses your green */
.xebia-progress {
  background: #2ea44f;
}

.answer-block {
  display: grid !important;
  justify-items: center !important;
  width: 100% !important;
  margin-top: 6px;
}


.answer-label {
  width: min(300px, 100%) !important;
  margin-bottom: 8px;
  font-weight: 600;
  text-align: left;
  color: #111;
}

.answer-input {
  width: 300px;
  max-width: 300px;
  margin: 0 auto 18px;
}

</style>
-->
