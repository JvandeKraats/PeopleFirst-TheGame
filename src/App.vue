<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">
    <header class="xebia-header py-3">
      <div class="container">
        <div class="d-flex align-items-center justify-content-between gap-3">
          <div>
            <div class="xebia-title h4 mb-0">People First – The Game</div>
            <div class="xebia-subtitle">Microsoft Services Innovation Day • Xebia</div>
          </div>

          <!-- Optional: you can add a small badge -->
          <span class="badge rounded-pill text-bg-light">Demo</span>
        </div>
      </div>
    </header>

    <main class="flex-grow-1 d-flex align-items-center py-5">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="py-3 border-top">
      <div class="container text-center text-muted small">
        © Xebia • Microsoft Services Innovation Day
      </div>
    </footer>
  </div>
</template>
