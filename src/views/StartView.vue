<script setup>
import { useRouter } from 'vue-router'
import WelcomeHeader from '../components/WelcomeHeader.vue'

const router = useRouter()
function start() {
  router.push('/game')
}
</script>

<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-6">
      <div class="card xebia-card p-3 p-md-4">
        <div class="card-body text-center">
          <WelcomeHeader msg="Welcome!" />
          <p class="text-muted mb-4">
            Guess your colleagues by their photo. Ten rounds. No pressure… except public bragging rights.
          </p>

          <button class="btn btn-xebia btn-lg w-100" @click="start">
            Start the game
          </button>

          <div class="mt-3 text-muted small">
            Tip: works best in portrait mode on mobile.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
