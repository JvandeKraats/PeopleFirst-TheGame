<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import XmsLogoHomeLink from '../components/XmsLogoHomeLink.vue'

const router = useRouter()
const trackTime = ref(false)

function start(mode) {
  const query = { mode }
  if (trackTime.value) query.time = '1'
  router.push({ path: '/game', query })
}

function goToMatch() {
  router.push('/match')
}

function goToMemoryGame() {
  router.push('/memory')
}

function goToFindJesse() {
  router.push('/find-jesse')
}

function goToSilhouetteQuiz() {
  router.push('/silhouette-quiz')
}

function goToProgressiveReveal() {
  router.push('/progressive-reveal')
}
</script>

<template>
  <main class="start-screen">
    <div class="start-content">
      <XmsLogoHomeLink />
      <h1 class="title">People First – The Game</h1>
      <div class="subtitle">
        The Magic of Innovation Days
      </div>

      <p class="description">
        Guess your colleagues by their photo.<br />
        Ten quick rounds. Have fun.
      </p>

      <div class="mode-buttons">
        <button class="start-button" @click="start('easy')">
          Easy mode
        </button>
        <div class="mode-hint">
          Multiple choice — pick the correct first name.
        </div>

        <button class="start-button start-button--danger" @click="start('hard')">
          Hard mode
        </button>
        <div class="mode-hint">
          Type the first name yourself and get an exact match.
        </div>

        <button class="start-button" @click="goToMatch">
          Match name to pictures
        </button>
        <div class="mode-hint">
          You’ll see one name and four photos — tap the correct photo.
        </div>
        <button class="start-button start-button--xebia" @click="goToMemoryGame">
          Memory game
        </button>
        <div class="mode-hint">
          Match pairs of names and photos in this classic memory game.
        </div>

        <button class="start-button start-button--secondary" @click="goToFindJesse">
          Find Jesse
        </button>
        <div class="mode-hint">
          CAPTCHA-style: select all Jesses by photo only.
        </div>

        <button class="start-button start-button--secondary" @click="goToSilhouetteQuiz">
          Silhouette Quiz
        </button>
        <div class="mode-hint">
          Guess 10 names from silhouettes – photos revealed at the end.
        </div>

        <button class="start-button start-button--xebia" @click="goToProgressiveReveal">
          Who's that colleague?
        </button>
        <div class="mode-hint">
          Guess one colleague - wrong attempts gradually reveal the photo.
        </div>
      </div>

        <!-- Time tracking option -->
        <div class="timebox">
          <label class="timebox-label">
            <input type="checkbox" v-model="trackTime" />
            Show how long it took (track time)
          </label>
          <div class="mode-hint">If enabled, your total time will be shown on the results screen.</div>
        </div>
      </div>
<!--
      <div class="hint">
        Best experienced on mobile · Portrait mode
      </div>-->
  </main>
</template>

<style scoped>
.timebox {
  margin-top: 12px;
}
.timebox-label {
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.timebox input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

</style>
