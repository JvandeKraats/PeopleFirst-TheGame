<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function start() {
  router.push('/game')
}
</script>

<template>
  <main class="start-screen">
    <div class="start-content">
      <h1 class="title">People First – The Game</h1>
      <div class="subtitle">
        Microsoft Services Innovation Day • Xebia
      </div>

      <p class="description">
        Guess your colleagues by their photo.<br />
        Ten quick rounds. Have fun.
      </p>

      <button class="start-button" @click="start">
        Start game
      </button>

      <div class="hint">
        Best experienced on mobile · Portrait mode
      </div>
    </div>
  </main>
</template>
