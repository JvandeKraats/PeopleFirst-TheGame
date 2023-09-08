<template>
    <div class="score-container">
      <h1>Your Score: {{ score }}</h1>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        score: null
      };
    },
    mounted() {
      const storedScore = JSON.parse(localStorage.getItem('gameScore'));
      if (storedScore !== null) {
        this.score = storedScore;
      }
    }
  };
  </script>
  
  <style>
  .score-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 2em;
  }
  </style>
  