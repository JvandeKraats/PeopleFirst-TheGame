<template>
  <div class="score-container">
    <h1 :class="score >= 5 ? 'high-score' : 'low-score'">Your Score: {{ score }}</h1>
    <button @click="resetScore" class="try-again-button">Try Again</button>
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
      this.score = storedScore.toFixed(1);
    }
  },
  methods: {
    resetScore() {
      this.$router.push('/');
    }
  }
};
</script>
  
<style>
.score-container {
  display: flex;
  flex-direction: column;
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

.try-again-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.try-again-button:hover {
  background-color: #0056b3;
}
</style>
  