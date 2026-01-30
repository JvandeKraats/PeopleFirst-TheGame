<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">

    <main class="flex-grow-1 d-flex align-items-center py-4">
      <div class="container">
        <RouterView />
      </div>
    </main>

  </div>
</template>
