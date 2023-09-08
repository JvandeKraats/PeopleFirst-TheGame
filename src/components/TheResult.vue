<template>
    <div class="score-container">
      <h1 :class="score >= 5 ? 'high-score' : 'low-score'">Your Score: {{ score }}</h1>
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
  .high-score {
    color: green;
  }
  .low-score {
    color: red;
  }
  </style>
  