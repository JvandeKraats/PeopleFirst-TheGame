<script setup>
import { RouterView } from 'vue-router'
import ThemeToggle from './components/ThemeToggle.vue'
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">

    <ThemeToggle />

    <main class="flex-grow-1 d-flex align-items-center py-4">
      <div class="container">
        <RouterView />
      </div>
    </main>

  </div>
</template>
