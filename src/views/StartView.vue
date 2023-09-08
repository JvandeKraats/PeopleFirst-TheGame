<script setup>
import { RouterLink } from 'vue-router'
import WelcomeHeader from '../components/WelcomeHeader.vue'
</script>
<template>
  <div>
    <header class="header">
      <div class="wrapper">
        <WelcomeHeader msg="Welcome to the game!" />
      </div>
    </header>
    <div class="button-container">
      <RouterLink to="/game" class="start-button">Start the game</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.header {
  color: #fff;
  padding: 20px 0;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.button-container {
  text-align: center;
  margin-top: 20px;
}

.start-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #0056b3;
  color: #fff;
  text-decoration: none;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button:hover {
  background-color: #004098;
}
</style>

