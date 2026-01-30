<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
</script>

<template>
  <main class="start-screen">
    <div class="start-content">
      <div class="flex items-center xl:pr-[1.813rem]" style="opacity: 1;"><a href="/"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 85 29" class="w-[5.375rem]"><path fill="currentColor" fill-rule="evenodd" d="M44.695 15.768H33.012c.167 2.07 1.715 3.394 4.099 3.31 1.478 0 2.774-.62 3.471-1.817h3.667c-1.227 3.21-3.792 5.028-7.027 5.028-2.175 0-3.973-.747-5.479-2.268-1.366-1.45-2.175-3.465-2.175-5.408 0-2.057.697-3.874 2.05-5.324 1.478-1.564 3.402-2.437 5.395-2.437 2.482 0 4.782 1.268 6.33 3.338.906 1.324 1.352 2.887 1.352 4.831zm-11.64-2.761h7.96c-.544-1.944-1.966-3.014-4.113-3.014-1.729 0-3.36 1.197-3.848 3.014M49.838 2.57V8.47c1.31-1.07 2.747-1.493 4.517-1.45 1.924 0 3.68.62 5.033 1.943 1.631 1.45 2.496 3.592 2.496 5.733 0 2.323-.976 4.507-2.733 6.028-1.31 1.07-2.914 1.69-4.782 1.69-1.715 0-3.178-.493-4.53-1.563v1.197h-3.347V2.569zm4.293 7.774c-2.37 0-4.168 1.888-4.168 4.409 0 2.394 1.882 4.281 3.987 4.267 2.621 0 4.42-1.901 4.42-4.338 0-2.324-1.869-4.338-4.239-4.338M67.447 2.57h-3.234v3.267h3.234zm0 4.789h-3.234v14.69h3.234zM85 22.05h-3.2479999999999998v-1.817c-.808 1.52-2.286 2.14-4.53 2.14-4.28 0-7.515-3.31-7.515-7.718 0-2.07.697-3.958 2.05-5.408 1.477-1.564 3.22-2.268 5.395-2.268 2.119 0 3.625.69 4.614 2.14V7.36h3.235zm-7.709-11.762c-2.3 0-4.168 1.817-4.168 4.211 0 2.592 1.924 4.409 4.224 4.409 2.12 0 4.043-1.944 4.043-4.211 0-2.521-1.98-4.409-4.099-4.409" clip-rule="evenodd"></path><path fill="currentColor" d="M.125 28.333h8.827L18.5 18.73l9.521 9.603h8.938l-13.99-14.11L37.085 0h-8.938L18.5 9.743 8.91 0H0l14.032 14.223z"></path></svg></a></div>
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
    </div>
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
