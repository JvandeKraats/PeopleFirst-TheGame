<script setup>
import { useRouter } from 'vue-router'
import WelcomeHeader from '../components/WelcomeHeader.vue'

const router = useRouter()
function start() {
  router.push('/game')
}
</script>

<template>
  <div class="start-page">
    <div class="row justify-content-center w-100 g-0">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
        <div class="card xebia-card start-card">
          <div class="card-body text-center px-4 py-4 py-md-5">

            <WelcomeHeader msg="Welcome!" />

            <p class="text-muted mt-3 mb-4 start-description">
              Guess your colleagues by their photo.<br class="d-none d-md-block" />
              Ten rounds. No pressure… except public bragging rights.
            </p>

            <button class="btn btn-xebia btn-lg w-100" @click="start">
              Start the game
            </button>

            <div class="mt-3 text-muted small">
              Best experienced on mobile • Portrait mode
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile-first: top aligned, no awkward empty space */
.start-page {
  width: 100%;
  padding: 24px 12px;
}

/* Desktop/tablet: center vertically */
@media (min-width: 768px) {
  .start-page {
    min-height: 70vh;          /* NOT full viewport; avoids footer gap */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 12px;
  }
}

.start-card {
  border-radius: 14px;
}

.start-description {
  font-size: 1.05rem;
  line-height: 1.6;
}
</style>
