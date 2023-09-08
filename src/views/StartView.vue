<script setup>
import { RouterLink } from 'vue-router'
import WelcomeHeader from '../components/WelcomeHeader.vue'
</script>
<template>
  <header>
    <div class="wrapper">
      <WelcomeHeader msg="Welcome to the game!" />
    </div>
  </header>
  <RouterLink to="/game">Start the game </RouterLink>
</template>

<style></style>
