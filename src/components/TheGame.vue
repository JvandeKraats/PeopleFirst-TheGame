<script>
export default {
  props: {
    collegas: Array, // Define a prop for the list
  },
  data() {
    return {
      currentIndex: 0, // Start with the first item
    };
  },
  methods: {
    nextItem() {
      if (this.currentIndex < this.collegas.length - 1) {
        this.currentIndex++;
      }
    },
    prevousItem() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
    submitAnswers() {
      var score = this.calculateScore();
      localStorage.setItem('gameScore', JSON.stringify(score));
      this.$router.push('/result');
    },
    calculateScore() {
      let totalGoodAnswers = 0;
      for (let i = 0; i < this.collegas.length; i++) {
        if (this.collegas[i].answer === this.collegas[i].firstName) {
          totalGoodAnswers++;
        }
      }

      const score = (totalGoodAnswers / this.collegas.length) * 10;
      return score;
    }
  },
};
</script>

<template>
  <div class="guess-who-container">
    <p>Guess who is that:</p>
    <img :src="collegas[currentIndex].link" class="guess-who-image" />
    <input type="text" v-model="collegas[currentIndex].answer" class="guess-who-input" />
    <p v-if="currentIndex < collegas.length - 1">
      <button v-if="currentIndex > 0" @click="prevousItem" class="guess-who-button">Previous</button>
      <button @click="nextItem" class="guess-who-button">Next</button>
    </p>
    <p v-else>
      <button @click="submitAnswers" class="guess-who-button">Submit answers</button>
    </p>
  </div>
</template>

<style scoped>
.guess-who-container {
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.guess-who-image {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.guess-who-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.guess-who-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.guess-who-button:hover {
  background-color: #0056b3;
}
</style>
